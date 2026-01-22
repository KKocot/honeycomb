import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Settings, User, Save, MapPin, Link as LinkIcon, FileText } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  basic: `import { HiveAccountSettings } from "@/components/hive";

function SettingsPage() {
  return (
    <HiveAccountSettings
      username="barddev"
      onSave={(data) => console.log("Saved:", data)}
    />
  );
}`,
};

export default async function AccountSettingsPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveAccountSettings</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Edit profile information stored on the blockchain.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">On-chain Profile</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Profile data is stored in posting_json_metadata on the blockchain.
              Changes are permanent and visible to all Hive apps. Uses posting key.
            </p>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Usage</h2>
        <CodeBlock code={CODE.basic} language="tsx" />
      </section>

      {/* Preview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="rounded-lg border border-border p-6">
          <div className="max-w-lg mx-auto rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Profile Settings</h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Update your public profile information
              </p>
            </div>

            {/* Preview banner */}
            <div className="relative">
              <div className="h-24 bg-gradient-to-r from-hive-red to-orange-500" />
              <div className="absolute -bottom-8 left-4">
                <div className="w-16 h-16 rounded-full border-4 border-card bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-4 pt-12 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                  <User className="h-4 w-4" /> Display Name
                </label>
                <div className="px-3 py-2 rounded-lg border border-border bg-muted text-sm">
                  Bard Developer
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                  <FileText className="h-4 w-4" /> About
                </label>
                <div className="px-3 py-2 rounded-lg border border-border bg-muted text-sm h-16 text-muted-foreground">
                  Tell us about yourself...
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                  <MapPin className="h-4 w-4" /> Location
                </label>
                <div className="px-3 py-2 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
                  City, Country
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                  <LinkIcon className="h-4 w-4" /> Website
                </label>
                <div className="px-3 py-2 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
                  https://yourwebsite.com
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/30">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium">
                <Save className="h-5 w-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Fetches current profile data on mount</li>
          <li>• Editable fields: name, about, location, website</li>
          <li>• Profile and cover image URLs</li>
          <li>• Change detection (only saves if modified)</li>
          <li>• Reset button to restore original values</li>
          <li>• Login prompt if not authenticated</li>
          <li>• Only editable by account owner</li>
        </ul>
      </section>

      {/* Props */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Prop</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>username</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onSave</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(data: ProfileData) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>className</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ProfileData type */}
      <section>
        <h2 className="text-xl font-semibold mb-4">ProfileData Type</h2>
        <CodeBlock
          code={`interface ProfileData {
  name: string;
  about: string;
  location: string;
  website: string;
  cover_image: string;
  profile_image: string;
}`}
          language="tsx"
        />
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/docs/components/communities-list"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Communities List
        </Link>
        <Link
          href="/docs/components/avatar"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Avatar
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
