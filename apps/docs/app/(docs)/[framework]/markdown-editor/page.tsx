import Link from "next/link";
import {
  ArrowLeft,
  Info,
  Bold,
  Eye,
  Upload,
  Save,
  Moon,
  Settings,
  Keyboard,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { parseFramework, type Framework } from "@/lib/framework";
import { CODE, PROPS, CONFIG_FIELDS, TOOLBAR_ACTIONS } from "./markdown_editor_data";

interface PageProps {
  params: Promise<{ framework: string }>;
}

function get_language(fw: Framework) {
  if (fw === "vue") return "vue";
  if (fw === "svelte") return "svelte";
  return "tsx";
}

export default async function MarkdownEditorPage({ params }: PageProps) {
  const { framework: raw_framework } = await params;
  const framework = parseFramework(raw_framework);
  const lang = get_language(framework);

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Markdown Editor</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          CodeMirror-based Markdown editor with toolbar, live preview, image
          upload, draft auto-save, and Hive blockchain integration.
        </p>
      </div>

      {/* Features */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { Icon: Bold, title: "Full Toolbar", desc: "Bold, italic, headings, lists, tables, code blocks, links, images, spoilers" },
          { Icon: Eye, title: "Live Preview", desc: "Split, tab, or off -- three preview modes" },
          { Icon: Upload, title: "Hive Image Upload", desc: "Upload to Hive imagehoster with signing challenge" },
          { Icon: Save, title: "Draft Auto-save", desc: "LocalStorage drafts with debounce and TTL" },
          { Icon: Moon, title: "Dark Mode", desc: "Auto, light, or dark theme (one-dark-pro)" },
          { Icon: Settings, title: "Plugin System", desc: "Custom toolbar items, keyboard shortcuts, paste handlers" },
        ].map(({ Icon, title, desc }) => (
          <div key={title} className="rounded-lg border border-border p-4">
            <Icon className="h-5 w-5 text-hive-red mb-2" />
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">CodeMirror peer dependencies</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The editor uses CodeMirror 6 internally. You need to install the
              CodeMirror packages as peer dependencies alongside the honeycomb package.
            </p>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Installation</h2>
        <CodeBlock code={CODE.install} language="bash" />
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basic[framework]} language={lang} />
      </section>

      {/* Preview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="rounded-lg border border-border p-6">
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center gap-1 px-2 py-2 border-b border-border bg-muted/30 flex-wrap">
              {["B", "I", "S", "<>", "|", "H", '"', "--", "{ }", "T", "|", "Link", "Img", "Eye", "|", "- ", "1.", "[ ]"].map((item, i) =>
                item === "|" ? (
                  <div key={i} className="w-px h-5 bg-border mx-1" />
                ) : (
                  <button key={i} className="p-2 rounded hover:bg-muted text-muted-foreground text-xs font-mono">{item}</button>
                ),
              )}
            </div>
            <div className="p-4 min-h-[150px] text-muted-foreground font-mono text-sm">
              Write your markdown here...
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Examples</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Hive Image Upload</h3>
            <p className="text-muted-foreground mb-2 text-sm">
              Use <code className="rounded bg-muted px-1.5 py-0.5 text-xs">create_hive_upload_handler</code> to
              upload images to the Hive imagehoster with a signing challenge.
            </p>
            <CodeBlock code={CODE.withUpload[framework]} language={lang} />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Preview Modes</h3>
            <div className="grid gap-2 sm:grid-cols-3 mb-3">
              {[
                { mode: "split", desc: "Editor and preview side by side" },
                { mode: "tab", desc: "Switchable Write/Preview tabs" },
                { mode: "off", desc: "Editor only (default)" },
              ].map(({ mode, desc }) => (
                <div key={mode} className="rounded-lg border border-border p-3 text-sm">
                  <code className="text-hive-red">{`"${mode}"`}</code>
                  <p className="mt-1 text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
            <CodeBlock code={CODE.previewSplit[framework]} language={lang} />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Custom Toolbar</h3>
            <p className="text-muted-foreground mb-2 text-sm">
              Filter or reorder <code className="rounded bg-muted px-1.5 py-0.5 text-xs">DEFAULT_TOOLBAR</code> to
              create a minimal editor.
            </p>
            <CodeBlock code={CODE.customToolbar[framework]} language={lang} />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Draft Auto-save</h3>
            <p className="text-muted-foreground mb-2 text-sm">
              Enable draft auto-save to localStorage with configurable debounce and TTL.
            </p>
            <CodeBlock code={CODE.draftAutoSave[framework]} language={lang} />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Dark Mode</h3>
            <p className="text-muted-foreground mb-2 text-sm">
              The <code className="rounded bg-muted px-1.5 py-0.5 text-xs">&quot;auto&quot;</code> value
              follows the system preference via <code className="rounded bg-muted px-1.5 py-0.5 text-xs">prefers-color-scheme</code>.
            </p>
            <CodeBlock code={CODE.darkMode[framework]} language={lang} />
          </div>
        </div>
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
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PROPS.map((p) => (
                <tr key={p.nameFn ? p.nameFn(framework) : p.name}>
                  <td className="py-3 px-4"><code>{p.nameFn ? p.nameFn(framework) : p.name}</code></td>
                  <td className="py-3 px-4 text-muted-foreground"><code>{p.type}</code></td>
                  <td className="py-3 px-4 text-muted-foreground">{p.default === "-" ? "-" : <code>{p.default}</code>}</td>
                  <td className="py-3 px-4 text-muted-foreground">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Config */}
      <section>
        <h2 className="text-xl font-semibold mb-4">MdEditorConfig</h2>
        <p className="text-muted-foreground mb-4">
          Pass via the <code className="rounded bg-muted px-1.5 py-0.5 text-sm">config</code> prop. All fields are optional.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Field</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Default</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {CONFIG_FIELDS.map((f) => (
                <tr key={f.name}>
                  <td className="py-3 px-4"><code>{f.name}</code></td>
                  <td className="py-3 px-4 text-muted-foreground"><code>{f.type}</code></td>
                  <td className="py-3 px-4 text-muted-foreground">{f.default === "-" ? "-" : <code>{f.default}</code>}</td>
                  <td className="py-3 px-4 text-muted-foreground">{f.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Toolbar Actions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          <Keyboard className="inline h-5 w-5 mr-2" />
          Default Toolbar Actions
        </h2>
        <p className="text-muted-foreground mb-4">
          Keyboard shortcuts use Mod (Cmd on macOS, Ctrl on Windows/Linux).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Action</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Shortcut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TOOLBAR_ACTIONS.map(({ label, type, shortcut }) => (
                <tr key={type}>
                  <td className="py-3 px-4">{label}</td>
                  <td className="py-3 px-4 text-muted-foreground"><code>{type}</code></td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {shortcut === "-" ? (
                      <span className="text-muted-foreground/50">-</span>
                    ) : (
                      <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{shortcut}</kbd>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href={`/${framework}/content-renderer`}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Content Renderer
        </Link>
      </section>
    </article>
  );
}
