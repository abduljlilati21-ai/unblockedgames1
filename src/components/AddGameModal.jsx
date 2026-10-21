import { useState } from "react";
import { X, Code2, Plus, Sparkles, Wand2 } from "lucide-react";

const SAMPLE_GAMES = [
  {
    title: "Geometry Jump",
    category: "Action",
    description: "Rhythm-based jumping platformer with high-speed obstacles.",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    iframe: '<iframe src="https://geometrydashwave.io/" title="Geometry Jump" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; keyboard; gamepad" allowfullscreen></iframe>',
  },
  {
    title: "Crossy Road Web",
    category: "Arcade",
    description: "Hop across busy highways, train tracks, and rivers without getting hit.",
    thumbnail: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80",
    iframe: '<iframe src="https://crossyroad.io/" title="Crossy Road Web" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; keyboard; gamepad" allowfullscreen></iframe>',
  },
];

export default function AddGameModal({ isOpen, onClose, onAddGame }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Arcade");
  const [iframeInput, setIframeInput] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFillSample = (sample) => {
    setTitle(sample.title);
    setCategory(sample.category);
    setDescription(sample.description);
    setThumbnail(sample.thumbnail);
    setIframeInput(sample.iframe);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a game title.");
      return;
    }

    if (!iframeInput.trim()) {
      setError("Please enter an iframe embed code or URL.");
      return;
    }

    let finalIframe = iframeInput.trim();
    let url = "";

    // If the user entered a raw URL instead of an <iframe> tag, wrap it into an iframe string
    if (!finalIframe.toLowerCase().startsWith("<iframe")) {
      const sanitizedUrl = finalIframe.startsWith("http")
        ? finalIframe
        : `https://${finalIframe}`;
      url = sanitizedUrl;
      finalIframe = `<iframe src="${sanitizedUrl}" title="${title.trim()}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; keyboard; gamepad" allowfullscreen></iframe>`;
    } else {
      const srcMatch = finalIframe.match(/src=["']([^"']+)["']/i);
      url = srcMatch ? srcMatch[1] : "";
    }

    const newGame = {
      id: `game-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      category: category.trim() || "Arcade",
      description: description.trim() || "Unblocked web game stored via iframe in JSON.",
      thumbnail:
        thumbnail.trim() ||
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
      iframe: finalIframe,
      url: url,
    };

    onAddGame(newGame);
    onClose();

    // Reset form
    setTitle("");
    setCategory("Arcade");
    setIframeInput("");
    setDescription("");
    setThumbnail("");
  };

  return (
    <div
      id="add-game-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="add-game-modal-card"
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl text-neutral-100"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add Game to JSON</h3>
              <p className="text-xs text-neutral-400">Embed any game iframe code into your library</p>
            </div>
          </div>
          <button
            id="close-add-game-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="mt-3 p-3 rounded-xl bg-neutral-950/60 border border-white/5">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="flex items-center gap-1.5 font-semibold text-neutral-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Quick fill template:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_GAMES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleFillSample(sample)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/15 hover:text-cyan-300 border border-white/5 text-[11px] text-neutral-300 transition-colors"
              >
                + {sample.title}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Game Title *
            </label>
            <input
              id="new-game-title"
              type="text"
              placeholder="e.g. Retro Space Invaders"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Category
              </label>
              <select
                id="new-game-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:border-cyan-400 focus:outline-none transition-colors"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Retro">Retro</option>
                <option value="Action">Action</option>
                <option value="Sports">Sports</option>
                <option value="Casual">Casual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Thumbnail Image URL
              </label>
              <input
                id="new-game-thumbnail"
                type="url"
                placeholder="https://... (optional)"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Iframe Code or Web Game URL *
            </label>
            <textarea
              id="new-game-iframe"
              rows={3}
              placeholder='&lt;iframe src="https://example.com/game" width="100%" height="100%"&gt;&lt;/iframe&gt; or direct https:// url'
              value={iframeInput}
              onChange={(e) => setIframeInput(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 font-mono text-xs text-cyan-200 placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
              required
            />
            <p className="mt-1 text-[11px] text-neutral-500">
              Raw HTML <code className="text-cyan-400">&lt;iframe&gt;</code> string is formatted and saved to the JSON database.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Short Description / Controls
            </label>
            <input
              id="new-game-desc"
              type="text"
              placeholder="e.g. Use arrow keys to steer, space to jump"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
            <button
              id="cancel-add-game"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 text-neutral-300 hover:bg-white/10 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-add-game"
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 text-neutral-950 hover:bg-cyan-300 text-xs font-bold shadow-md transition-colors"
            >
              <Plus className="h-4 w-4" />
              Save Game to JSON
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
