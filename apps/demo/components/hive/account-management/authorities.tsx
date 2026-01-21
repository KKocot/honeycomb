"use client";

import { useState, useEffect, useReducer, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useHive, KeyType as ContextKeyType } from "@/contexts/hive-context";
import { useRequireKey } from "@/hooks/use-require-key";
import {
  Key,
  Copy,
  Check,
  AlertTriangle,
  User,
  Loader2,
  PlusCircle,
  Trash2,
  Pencil,
  X,
  Save,
  Shield,
} from "lucide-react";

// ===========================================
// Types
// ===========================================

type KeyType = "owner" | "active" | "posting" | "memo";
type EditableKeyType = "owner" | "active" | "posting";
type HideOption = "owner" | "active" | "posting" | "memo" | "warning";

interface KeyAuth {
  key: string;
  weight: number;
}

interface AccountAuth {
  account: string;
  weight: number;
}

interface AuthorityData {
  keyAuths: KeyAuth[];
  accountAuths: AccountAuth[];
  weightThreshold: number;
}

interface AuthoritiesData {
  owner: AuthorityData;
  active: AuthorityData;
  posting: AuthorityData;
  memo: string;
}

interface HiveAuthoritiesProps {
  username: string;
  hide?: HideOption[];
  editable?: boolean;
  onCopy?: (keyType: string) => void;
  onSave?: (level: EditableKeyType, data: AuthorityData) => Promise<void>;
  className?: string;
  style?: React.CSSProperties;
}

// ===========================================
// Reducer for authority changes
// ===========================================

type AuthorityAction =
  | { type: "SET_INITIAL"; payload: AuthorityData }
  | { type: "ADD"; payload: { keyOrAccount: string; weight: number } }
  | { type: "DELETE"; payload: { keyOrAccount: string } }
  | { type: "UPDATE"; payload: { oldKeyOrAccount: string; newKeyOrAccount: string; weight: number } }
  | { type: "UPDATE_THRESHOLD"; payload: { threshold: number } }
  | { type: "RESET" };

function authorityReducer(
  state: { current: AuthorityData; original: AuthorityData },
  action: AuthorityAction
): { current: AuthorityData; original: AuthorityData } {
  switch (action.type) {
    case "SET_INITIAL":
      return { current: action.payload, original: action.payload };

    case "ADD": {
      const { keyOrAccount, weight } = action.payload;
      const isKey = keyOrAccount.startsWith("STM");
      const newCurrent = { ...state.current };

      if (isKey) {
        newCurrent.keyAuths = [...newCurrent.keyAuths, { key: keyOrAccount, weight }];
      } else {
        newCurrent.accountAuths = [...newCurrent.accountAuths, { account: keyOrAccount, weight }];
      }

      return { ...state, current: newCurrent };
    }

    case "DELETE": {
      const { keyOrAccount } = action.payload;
      const newCurrent = {
        ...state.current,
        keyAuths: state.current.keyAuths.filter((k) => k.key !== keyOrAccount),
        accountAuths: state.current.accountAuths.filter((a) => a.account !== keyOrAccount),
      };
      return { ...state, current: newCurrent };
    }

    case "UPDATE": {
      const { oldKeyOrAccount, newKeyOrAccount, weight } = action.payload;
      const isKey = newKeyOrAccount.startsWith("STM");
      const newCurrent = { ...state.current };

      // Remove old entry
      newCurrent.keyAuths = newCurrent.keyAuths.filter((k) => k.key !== oldKeyOrAccount);
      newCurrent.accountAuths = newCurrent.accountAuths.filter((a) => a.account !== oldKeyOrAccount);

      // Add new entry
      if (isKey) {
        newCurrent.keyAuths = [...newCurrent.keyAuths, { key: newKeyOrAccount, weight }];
      } else {
        newCurrent.accountAuths = [...newCurrent.accountAuths, { account: newKeyOrAccount, weight }];
      }

      return { ...state, current: newCurrent };
    }

    case "UPDATE_THRESHOLD":
      return {
        ...state,
        current: { ...state.current, weightThreshold: action.payload.threshold },
      };

    case "RESET":
      return { ...state, current: state.original };

    default:
      return state;
  }
}

// ===========================================
// Constants
// ===========================================

const KEY_CONFIG: Record<KeyType, { label: string; description: string; color: string }> = {
  owner: {
    label: "Owner",
    description: "Account recovery (keep offline!)",
    color: "text-red-500 bg-red-500/10",
  },
  active: {
    label: "Active",
    description: "Financial transactions",
    color: "text-orange-500 bg-orange-500/10",
  },
  posting: {
    label: "Posting",
    description: "Posts, comments, votes",
    color: "text-blue-500 bg-blue-500/10",
  },
  memo: {
    label: "Memo",
    description: "Encrypted messages",
    color: "text-purple-500 bg-purple-500/10",
  },
};

// ===========================================
// Add Authority Dialog
// ===========================================

function AddAuthorityDialog({
  level,
  existingAuthorities,
  onAdd,
  onClose,
}: {
  level: EditableKeyType;
  existingAuthorities: string[];
  onAdd: (keyOrAccount: string, weight: number) => void;
  onClose: () => void;
}) {
  const [keyOrAccount, setKeyOrAccount] = useState("");
  const [weight, setWeight] = useState(1);

  const isDuplicate = existingAuthorities.includes(keyOrAccount);
  const isValid = keyOrAccount.trim().length > 0 && !isDuplicate;

  const handleAdd = () => {
    if (isValid) {
      onAdd(keyOrAccount.trim(), weight);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Add {level.charAt(0).toUpperCase() + level.slice(1)} Authority
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Key or Account</label>
            <input
              type="text"
              value={keyOrAccount}
              onChange={(e) => setKeyOrAccount(e.target.value)}
              placeholder="STM... or username"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {isDuplicate && (
              <p className="text-sm text-red-500 mt-1">This authority already exists</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Weight</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!isValid}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Authority Item (with edit/delete support)
// ===========================================

function AuthorityItem({
  value,
  weight,
  isAccount,
  editMode,
  onCopy,
  onDelete,
  onUpdate,
}: {
  value: string;
  weight: number;
  isAccount: boolean;
  editMode: boolean;
  onCopy?: (value: string) => void;
  onDelete?: () => void;
  onUpdate?: (newValue: string, newWeight: number) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [localWeight, setLocalWeight] = useState(weight);

  useEffect(() => {
    setLocalValue(value);
    setLocalWeight(weight);
  }, [value, weight]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    onCopy?.(value);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBlur = () => {
    if (localValue !== value || localWeight !== weight) {
      onUpdate?.(localValue, localWeight);
    }
  };

  if (editMode) {
    return (
      <div className="flex items-center gap-2 py-2 px-3 rounded bg-muted/50 text-sm">
        <div className="shrink-0">
          {isAccount ? (
            <User className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Key className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        <input
          type="number"
          value={localWeight}
          onChange={(e) => setLocalWeight(Math.max(1, parseInt(e.target.value) || 1))}
          onBlur={handleBlur}
          min={1}
          className="w-16 px-2 py-1 text-xs border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary/50 text-center"
        />
        <button
          onClick={onDelete}
          className="p-1 rounded text-red-500 hover:bg-red-500/10 transition-colors"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded bg-muted/50 text-sm">
      <div className="flex items-center gap-2 min-w-0">
        {isAccount ? (
          <User className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <Key className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <code className="text-xs break-all">{isAccount ? `@${value}` : value}</code>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-muted-foreground text-xs">w:{weight}</span>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-muted transition-colors"
          title={isAccount ? "Copy username" : "Copy public key"}
        >
          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>
    </div>
  );
}

// ===========================================
// Editable Key Section
// ===========================================

// Map authority type to required key for modifications
const AUTHORITY_REQUIRED_KEY: Record<EditableKeyType, ContextKeyType> = {
  owner: "owner",
  active: "owner", // Modifying active authority requires owner key
  posting: "active", // Modifying posting authority requires active key
};

function EditableKeySection({
  type,
  label,
  description,
  data,
  color,
  editable,
  onCopy,
  onSave,
}: {
  type: EditableKeyType;
  label: string;
  description: string;
  data: AuthorityData;
  color: string;
  editable: boolean;
  onCopy?: (keyType: string) => void;
  onSave?: (level: EditableKeyType, data: AuthorityData) => Promise<void>;
}) {
  const { user } = useHive();
  const requiredKey = AUTHORITY_REQUIRED_KEY[type];
  const { requireKey, isPending: isEscalating, hasAccess } = useRequireKey({
    requiredKeyType: requiredKey,
    reason: `Modify ${type} authority`,
    allowSave: type !== "owner", // Don't offer to save owner key
  });

  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [state, dispatch] = useReducer(authorityReducer, {
    current: data,
    original: data,
  });

  // Sync with external data changes
  useEffect(() => {
    dispatch({ type: "SET_INITIAL", payload: data });
  }, [data]);

  const hasChanges =
    JSON.stringify(state.current) !== JSON.stringify(state.original);

  const existingAuthorities = [
    ...state.current.keyAuths.map((k) => k.key),
    ...state.current.accountAuths.map((a) => a.account),
  ];

  const handleSave = async () => {
    if (!onSave) return;

    // Request required key if needed
    const canProceed = await requireKey();
    if (!canProceed) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(type, state.current);
      dispatch({ type: "SET_INITIAL", payload: state.current });
      setEditMode(false);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    dispatch({ type: "RESET" });
    setEditMode(false);
  };

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-lg", color)}>
            <Key className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold">{label}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {editMode ? (
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground mr-1">Threshold:</span>
              <input
                type="number"
                value={state.current.weightThreshold}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_THRESHOLD",
                    payload: { threshold: Math.max(1, parseInt(e.target.value) || 1) },
                  })
                }
                min={1}
                className="w-14 px-2 py-1 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary/50 text-center"
              />
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">
              Threshold: {state.current.weightThreshold}
            </span>
          )}

          {editable && (
            <>
              {editMode ? (
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="p-1.5 rounded text-muted-foreground hover:bg-muted transition-colors"
                    title="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving || isEscalating}
                    className="p-1.5 rounded text-green-500 hover:bg-green-500/10 transition-colors disabled:opacity-50"
                    title="Save changes"
                  >
                    {isSaving || isEscalating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="p-1.5 rounded text-muted-foreground hover:bg-muted transition-colors ml-2"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Key requirement indicator in edit mode */}
      {editMode && !hasAccess && user && (
        <div className="flex items-center gap-2 text-sm mb-2 p-2 rounded-lg bg-orange-500/10 text-orange-500">
          <Shield className="h-4 w-4" />
          <span>
            Saving requires {requiredKey.charAt(0).toUpperCase() + requiredKey.slice(1)} key
          </span>
        </div>
      )}

      {/* Add button in edit mode */}
      {editMode && (
        <button
          onClick={() => setShowAddDialog(true)}
          className="w-full flex items-center justify-center gap-2 py-2 mb-2 rounded border border-dashed border-border text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Add key or account
        </button>
      )}

      {/* Authority items */}
      {state.current.keyAuths.length > 0 || state.current.accountAuths.length > 0 ? (
        <div className="space-y-2">
          {state.current.keyAuths.map((ka) => (
            <AuthorityItem
              key={ka.key}
              value={ka.key}
              weight={ka.weight}
              isAccount={false}
              editMode={editMode}
              onCopy={() => onCopy?.(type)}
              onDelete={() => dispatch({ type: "DELETE", payload: { keyOrAccount: ka.key } })}
              onUpdate={(newValue, newWeight) =>
                dispatch({
                  type: "UPDATE",
                  payload: { oldKeyOrAccount: ka.key, newKeyOrAccount: newValue, weight: newWeight },
                })
              }
            />
          ))}
          {state.current.accountAuths.map((aa) => (
            <AuthorityItem
              key={aa.account}
              value={aa.account}
              weight={aa.weight}
              isAccount={true}
              editMode={editMode}
              onCopy={() => onCopy?.(type)}
              onDelete={() => dispatch({ type: "DELETE", payload: { keyOrAccount: aa.account } })}
              onUpdate={(newValue, newWeight) =>
                dispatch({
                  type: "UPDATE",
                  payload: { oldKeyOrAccount: aa.account, newKeyOrAccount: newValue, weight: newWeight },
                })
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-2">No authorities set</p>
      )}

      {/* Add Dialog */}
      {showAddDialog && (
        <AddAuthorityDialog
          level={type}
          existingAuthorities={existingAuthorities}
          onAdd={(keyOrAccount, weight) =>
            dispatch({ type: "ADD", payload: { keyOrAccount, weight } })
          }
          onClose={() => setShowAddDialog(false)}
        />
      )}
    </div>
  );
}

// ===========================================
// Memo Key Section (read-only)
// ===========================================

function MemoKeySection({
  label,
  description,
  data,
  color,
  onCopy,
}: {
  label: string;
  description: string;
  data: string;
  color: string;
  onCopy?: (keyType: string) => void;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-lg", color)}>
            <Key className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold">{label}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <AuthorityItem
        value={data}
        weight={1}
        isAccount={false}
        editMode={false}
        onCopy={() => onCopy?.("memo")}
      />
    </div>
  );
}

// ===========================================
// Main Component
// ===========================================

export function HiveAuthorities({
  username,
  hide = [],
  editable = false,
  onCopy,
  onSave,
  className,
  style,
}: HiveAuthoritiesProps) {
  const { chain } = useHive();
  const [isLoading, setIsLoading] = useState(true);
  const [authorities, setAuthorities] = useState<AuthoritiesData | null>(null);

  const fetchAuthorities = useCallback(async () => {
    if (!chain || !username) return;
    setIsLoading(true);

    try {
      const response = await chain.api.database_api.find_accounts({
        accounts: [username],
      });

      if (response.accounts.length > 0) {
        const acc = response.accounts[0];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformAuth = (auth: any): AuthorityData => ({
          keyAuths: auth.key_auths.map((ka: [string, number] | { 0: string; 1: number }) => ({
            key: Array.isArray(ka) ? ka[0] : ka[0],
            weight: Array.isArray(ka) ? ka[1] : ka[1],
          })),
          accountAuths: auth.account_auths.map((aa: [string, number] | { 0: string; 1: number }) => ({
            account: Array.isArray(aa) ? aa[0] : aa[0],
            weight: Array.isArray(aa) ? aa[1] : aa[1],
          })),
          weightThreshold: auth.weight_threshold,
        });

        setAuthorities({
          owner: transformAuth(acc.owner),
          active: transformAuth(acc.active),
          posting: transformAuth(acc.posting),
          memo: acc.memo_key,
        });
      }
    } catch (err) {
      console.error("Failed to fetch authorities:", err);
    } finally {
      setIsLoading(false);
    }
  }, [chain, username]);

  useEffect(() => {
    fetchAuthorities();
  }, [fetchAuthorities]);

  const shouldHide = (option: HideOption) => hide.includes(option);
  const editableKeyTypes: EditableKeyType[] = ["owner", "active", "posting"];

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)} style={style}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!authorities) {
    return (
      <div className={cn("text-sm text-muted-foreground text-center p-8", className)} style={style}>
        Failed to load authorities
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)} style={style}>
      {/* Warning */}
      {!shouldHide("warning") && (
        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-orange-500">Security Warning</p>
              <p className="text-sm text-muted-foreground">
                Never share your private keys. Anyone with your keys can access your account.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Editable key sections (owner, active, posting) */}
      {editableKeyTypes.map((type) => {
        if (shouldHide(type)) return null;
        const config = KEY_CONFIG[type];
        return (
          <EditableKeySection
            key={type}
            type={type}
            label={config.label}
            description={config.description}
            data={authorities[type]}
            color={config.color}
            editable={editable}
            onCopy={onCopy}
            onSave={onSave}
          />
        );
      })}

      {/* Memo key (read-only) */}
      {!shouldHide("memo") && (
        <MemoKeySection
          label={KEY_CONFIG.memo.label}
          description={KEY_CONFIG.memo.description}
          data={authorities.memo}
          color={KEY_CONFIG.memo.color}
          onCopy={onCopy}
        />
      )}
    </div>
  );
}
