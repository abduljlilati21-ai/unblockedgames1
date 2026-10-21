import { useState, useEffect } from "react";
import {
  X,
  Copy,
  Check,
  Download,
  FileJson,
  Code,
  Upload,
  Trash2,
  RotateCcw,
} from "lucide-react";
import defaultGamesData from "../data/games.json";

export default function JsonViewModal({
  isOpen,
  onClose,
  games,
  onUpdateGames,
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("view"); // "view" | "import"
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setImportText(JSON.stringify(games, null, 2));
      setImportError("");
      setImportSuccess(false);
    }
  }, [isOpen, games]);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(games, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = jsonString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "games.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApplyImport = () => {
    setImportError("");
    setImportSuccess(false);
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        throw new Error("JSON root must be an array of game objects [ ... ]");
      }
      onUpdateGames(parsed);
      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        setActiveTab("view");
      }, 1200);
    } catch (err) {
      setImportError(err.message || "Invalid JSON syntax");
    }
  };

  const handleRestoreDefaults = () => {
    if (
      window.confirm(
        "Reset games library to the default curated unblocked games list?"
      )
    ) {
      onUpdateGames(defaultGamesData);
      setImportText(JSON.stringify(defaultGamesData, null, 2));
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Remove all games from your library?")) {
      onUpdateGames([]);
      setImportText("[]");
    }
  };

  return (
    <div
      id="json-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="json-modal-dialog"
        className="relative w-full max-w-3xl flex flex-col max-h-[85vh] rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl text-neutral-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-neutral-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400">
              <FileJson className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                games.json Storage
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/10 text-cyan-300">
                  {games?.length || 0} games stored
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Each game contains an embedded &lt;iframe&gt; HTML string
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="close-json-modal-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector & Action Bar */}
        <div className="px-5 py-2.5 bg-neutral-950 border-b border-white/5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-white/5 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("view")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === "view"
                  ? "bg-cyan-400 text-neutral-950 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              View JSON
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("import")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === "import"
                  ? "bg-cyan-400 text-neutral-950 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Import / Edit
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
              title="Reset library to defaults"
            >
              <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
              <span>Reset Defaults</span>
            </button>

            {games.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}

            <button
              id="copy-json-btn"
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-neutral-200 hover:text-white transition-colors"
              title="Copy JSON to clipboard"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              id="download-json-btn"
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-xs font-bold text-neutral-950 transition-colors shadow-sm"
              title="Download games.json file"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {activeTab === "view" ? (
          <div className="flex-1 overflow-auto p-4 bg-neutral-950 font-mono text-xs text-cyan-100 leading-relaxed min-h-[300px]">
            <pre className="whitespace-pre-wrap break-all select-all font-mono">
              {jsonString}
            </pre>
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-4 bg-neutral-950 gap-3 min-h-[300px]">
            <p className="text-xs text-neutral-400">
              Paste or edit the JSON array below. Each game must include an <code className="text-cyan-400">iframe</code> property containing the HTML embed iframe tag.
            </p>
            <textarea
              value={importText}
              onChange={(e) => {
                setImportText(e.target.value);
                setImportError("");
              }}
              className="w-full flex-1 min-h-[220px] p-3 rounded-xl bg-neutral-900 border border-white/10 text-cyan-200 font-mono text-xs focus:outline-none focus:border-cyan-400 resize-none shadow-inner"
              placeholder='[{"id":"my-game","title":"Game Title","category":"Arcade","thumbnail":"...","url":"...","iframe":"<iframe ...></iframe>"}]'
            />
            {importError && (
              <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-2 font-mono">
                {importError}
              </div>
            )}
            {importSuccess && (
              <div className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-2 font-mono flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                Library updated successfully!
              </div>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setImportText("[]")}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 transition-colors"
              >
                Clear Text
              </button>
              <button
                type="button"
                onClick={handleApplyImport}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-xs font-bold text-neutral-950 transition-colors shadow-md"
              >
                <Upload className="h-3.5 w-3.5" />
                Apply to Library
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 bg-neutral-900 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Code className="h-3.5 w-3.5 text-neutral-500" />
            <span className="hidden sm:inline">
              Schema: id, title, description, category, thumbnail, url, iframe
            </span>
            <span className="sm:hidden">JSON Schema</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-neutral-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
