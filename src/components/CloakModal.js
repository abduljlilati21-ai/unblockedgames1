import { useState, useEffect } from "react";
import { X, Shield, EyeOff, Check, AlertTriangle } from "lucide-react";

export const CLOAK_PRESETS = [
  {
    id: "default",
    name: "NovaPlay Unblocked (Default)",
    title: "NovaPlay Unblocked",
    icon: "🎮",
    favicon: "/favicon.ico",
  },
  {
    id: "gdocs",
    name: "Google Docs",
    title: "Untitled document - Google Docs",
    icon: "📄",
    favicon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico",
  },
  {
    id: "gclassroom",
    name: "Google Classroom",
    title: "Classes - Google Classroom",
    icon: "🏫",
    favicon: "https://ssl.gstatic.com/classroom/favicon.png",
  },
  {
    id: "gdrive",
    name: "Google Drive",
    title: "My Drive - Google Drive",
    icon: "📁",
    favicon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png",
  },
  {
    id: "canvas",
    name: "Canvas LMS",
    title: "Dashboard - Canvas LMS",
    icon: "🎓",
    favicon: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico",
  },
  {
    id: "wikipedia",
    name: "Wikipedia",
    title: "Wikipedia, the free encyclopedia",
    icon: "🌐",
    favicon: "https://en.wikipedia.org/static/favicon/wikipedia.ico",
  },
];

export function applyCloak(presetId) {
  const preset = CLOAK_PRESETS.find((p) => p.id === presetId) || CLOAK_PRESETS[0];
  document.title = preset.title;

  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "shortcut icon";
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
