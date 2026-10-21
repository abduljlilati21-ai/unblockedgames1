import { useState, useEffect } from "react";
import { X, EyeOff, Check, AlertTriangle } from "lucide-react";

// Safe SVG data URIs that never trigger 404 network errors
const DEFAULT_FAVICON_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2322d3ee' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='20' height='14' x='2' y='5' rx='4' fill='%230a0a0c' stroke='%2322d3ee'/%3E%3Cline x1='6' x2='10' y1='12' y2='12' stroke='%2322d3ee'/%3E%3Cline x1='8' x2='8' y1='10' y2='14' stroke='%2322d3ee'/%3E%3Ccircle cx='15' cy='12' r='1' fill='%2322d3ee'/%3E%3Ccircle cx='18' cy='10' r='1' fill='%2322d3ee'/%3E%3C/svg%3E";

const GDOCS_FAVICON_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z'/%3E%3Cpath fill='%23fff' d='M14 2v6h6M8 13h8M8 17h6'/%3E%3C/svg%3E";

const GCLASSROOM_FAVICON_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='20' height='16' x='2' y='4' rx='2' fill='%230F9D58' stroke='%23F4B400' stroke-width='2'/%3E%3Ccircle cx='12' cy='11' r='2' fill='%23fff'/%3E%3Cpath fill='%23fff' d='M9 16c0-1.5 1.5-2 3-2s3 .5 3 2'/%3E%3C/svg%3E";

const GDRIVE_FAVICON_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFBA00' d='m8.7 3.5 6.6 11.5H22L15.4 3.5z'/%3E%3Cpath fill='%230066DA' d='m15.3 15-3.3 5.5H2l3.3-5.5z'/%3E%3Cpath fill='%2300AC47' d='m2 20.5 6.7-11.5 3.3 5.5-6.7 11.5z'/%3E%3C/svg%3E";

const CANVAS_FAVICON_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23E13F2B'/%3E%3Ccircle cx='12' cy='12' r='4' fill='%23fff'/%3E%3C/svg%3E";

const WIKI_FAVICON_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23333'/%3E%3Ctext x='7' y='17' fill='%23fff' font-family='serif' font-size='15' font-weight='bold'%3EW%3C/text%3E%3C/svg%3E";

export const CLOAK_PRESETS = [
  {
    id: "default",
    name: "NovaPlay Unblocked (Default)",
    title: "NovaPlay Unblocked",
    icon: "🎮",
    favicon: DEFAULT_FAVICON_DATA_URI,
  },
  {
    id: "gdocs",
    name: "Google Docs",
    title: "Untitled document - Google Docs",
    icon: "📄",
    favicon: GDOCS_FAVICON_DATA_URI,
  },
  {
    id: "gclassroom",
    name: "Google Classroom",
    title: "Classes - Google Classroom",
    icon: "🏫",
    favicon: GCLASSROOM_FAVICON_DATA_URI,
  },
  {
    id: "gdrive",
    name: "Google Drive",
    title: "My Drive - Google Drive",
    icon: "📁",
    favicon: GDRIVE_FAVICON_DATA_URI,
  },
  {
    id: "canvas",
    name: "Canvas LMS",
    title: "Dashboard - Canvas LMS",
    icon: "🎓",
    favicon: CANVAS_FAVICON_DATA_URI,
  },
  {
    id: "wikipedia",
    name: "Wikipedia",
    title: "Wikipedia, the free encyclopedia",
    icon: "🌐",
    favicon: WIKI_FAVICON_DATA_URI,
  },
];

export function applyCloak(presetId) {
  const preset =
    CLOAK_PRESETS.find((p) => p.id === presetId) || CLOAK_PRESETS[0];
  document.title = preset.title;

  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  if (preset.favicon) {
    link.href = preset.favicon;
  }
  localStorage.setItem("novaplay_cloak_preset", preset.id);
}

export default function CloakModal({ isOpen, onClose }) {
  const [activeCloak, setActiveCloak] = useState(() => {
    return localStorage.getItem("novaplay_cloak_preset") || "default";
  });

  useEffect(() => {
    const saved = localStorage.getItem("novaplay_cloak_preset") || "default";
    setActiveCloak(saved);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (id) => {
    setActiveCloak(id);
    applyCloak(id);
  };

  return (
    <div
      id="cloak-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="cloak-modal-dialog"
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl text-neutral-100"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <EyeOff className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tab Cloaker / Stealth</h3>
              <p className="text-xs text-neutral-400">Disguise browser tab title and favicon</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-xs text-neutral-400 pb-1">
            Choose a preset to disguise this website in your browser tab history and active tabs:
          </p>

          <div className="grid grid-cols-1 gap-2">
            {CLOAK_PRESETS.map((preset) => {
              const isSelected = activeCloak === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelect(preset.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-purple-500/15 border-purple-500/50 text-white shadow-sm"
                      : "bg-neutral-950/60 border-white/5 hover:border-white/15 text-neutral-300 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl" role="img" aria-label={preset.name}>
                      {preset.icon}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-neutral-100">{preset.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono line-clamp-1">
                        {preset.title}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="h-6 w-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-neutral-950 border border-white/5 flex items-start gap-2.5 text-[11px] text-neutral-400">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Quick Panic Key:</strong> Press the <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded font-mono text-neutral-300 border border-white/10">`</kbd> (backtick) key anywhere to immediately redirect to Google Classroom.
            </span>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
