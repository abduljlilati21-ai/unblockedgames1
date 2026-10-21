import {
  X,
  Maximize2,
  RotateCcw,
  ExternalLink,
  Minimize2,
  Info,
  Code,
  Play,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect, useMemo } from "react";

export default function GameView({
  game,
  allGames = [],
  onSelectGame,
  onClose,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0);
  const [viewMode, setViewMode] = useState("game");
  const [copiedCode, setCopiedCode] = useState(false);

  // Extract source url from the iframe string stored in the JSON or fallback to game.url
  const gameSrc = useMemo(() => {
    if (game.iframe) {
      const match = game.iframe.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        return match[1];
      }
    }
    return game.url || "";
  }, [game]);

  const rawIframeTag = useMemo(() => {
    if (game.iframe) return game.iframe;
    return `<iframe src="${gameSrc}" title="${game.title}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; keyboard; gamepad" allowfullscreen></iframe>`;
  }, [game, gameSrc]);

  // Find index for next/previous navigation
  const currentIndex = useMemo(() => {
    return allGames.findIndex((g) => g.id === game.id);
  }, [allGames, game.id]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < allGames.length - 1;

  const reloadGame = () => {
    setKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    const element = document.getElementById("game-iframe-shell");
    if (!element) return;

    if (!document.fullscreenElement) {
      element
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.warn(`Fullscreen request failed: ${err.message}`);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((err) => {
          console.warn(`Exit fullscreen failed: ${err.message}`);
        });
    }
  };

  const handleOpenExternal = () => {
    if (gameSrc) {
      window.open(gameSrc, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyIframe = async () => {
    try {
      await navigator.clipboard.writeText(rawIframeTag);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = rawIframeTag;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Keyboard navigation & ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <motion.div
      id="game-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-neutral-950/90 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        id="game-modal-dialog"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-neutral-900">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-neutral-100 flex items-center gap-2">
                {game.title}
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/10 text-cyan-300 uppercase tracking-wider">
                  {game.category}
                </span>
              </h2>

              {/* Prev / Next Game buttons */}
              {allGames.length > 1 && (
                <div className="hidden md:flex items-center gap-1 ml-3 pl-3 border-l border-white/10">
                  <button
                    type="button"
                    disabled={!hasPrev}
                    onClick={() => onSelectGame?.(allGames[currentIndex - 1])}
                    className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Previous Game"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {currentIndex + 1}/{allGames.length}
                  </span>
                  <button
                    type="button"
                    disabled={!hasNext}
                    onClick={() => onSelectGame?.(allGames[currentIndex + 1])}
                    className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Next Game"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mode Switcher & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/5 mr-1">
              <button
                id="toggle-game-view-btn"
                type="button"
                onClick={() => setViewMode("game")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  viewMode === "game"
                    ? "bg-cyan-400 text-neutral-950 font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Play className="h-3 w-3 fill-current" />
                <span className="hidden sm:inline">Play</span>
              </button>
              <button
                id="toggle-code-view-btn"
                type="button"
                onClick={() => setViewMode("code")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  viewMode === "code"
                    ? "bg-cyan-400 text-neutral-950 font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Code className="h-3 w-3" />
                <span className="hidden sm:inline">Iframe Tag</span>
              </button>
            </div>

            {viewMode === "game" && (
              <>
                <button
                  id="reload-game-button"
                  type="button"
                  onClick={reloadGame}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-medium transition-colors"
                  title="Restart Game"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Restart</span>
                </button>

                {gameSrc && (
                  <button
                    id="external-game-button"
                    type="button"
                    onClick={handleOpenExternal}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-medium transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Popout</span>
                  </button>
                )}

                <button
                  id="fullscreen-game-button"
                  type="button"
                  onClick={toggleFullscreen}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-medium transition-colors"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-3.5 w-3.5" />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {isFullscreen ? "Exit" : "Fullscreen"}
                  </span>
                </button>
              </>
            )}

            <div className="h-4 w-[1px] bg-white/10 mx-1" />

            <button
              id="close-game-button"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors"
              title="Close (ESC)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Viewport Content */}
        {viewMode === "game" ? (
          <div
            id="game-iframe-shell"
            className="relative flex-1 bg-black overflow-hidden flex flex-col"
          >
            {gameSrc ? (
              <iframe
                key={key}
                src={gameSrc}
                title={game.title}
                className="h-full w-full border-0 block flex-1 bg-black"
                allow="autoplay; fullscreen; keyboard; gamepad; clipboard-read; clipboard-write"
                loading="eager"
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-neutral-400 p-6">
                <Info className="h-8 w-8 mb-2 text-neutral-500" />
                <p>No iframe URL configured for this game.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 bg-neutral-950 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  Stored Iframe JSON Structure
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  This game is stored directly in <code className="text-cyan-400">src/data/games.json</code> with the following iframe markup:
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyIframe}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-xs font-bold text-neutral-950 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-neutral-950" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Iframe Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-neutral-900 font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed shadow-inner">
              <code>{rawIframeTag}</code>
            </div>

            <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-5 space-y-3 text-xs text-neutral-300">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-cyan-400">
                JSON Object Properties
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-neutral-950 p-2.5 rounded-lg border border-white/5">
                  <span className="text-neutral-500 block text-[10px] uppercase">ID</span>
                  <span className="text-white font-semibold">{game.id}</span>
                </div>
                <div className="bg-neutral-950 p-2.5 rounded-lg border border-white/5">
                  <span className="text-neutral-500 block text-[10px] uppercase">Category</span>
                  <span className="text-white font-semibold">{game.category}</span>
                </div>
                <div className="bg-neutral-950 p-2.5 rounded-lg border border-white/5 sm:col-span-2">
                  <span className="text-neutral-500 block text-[10px] uppercase">Source URL</span>
                  <a
                    href={gameSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline break-all"
                  >
                    {gameSrc}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 sm:px-6 py-2.5 bg-neutral-950/90 border-t border-white/10 text-xs text-neutral-400">
          <p className="line-clamp-1">{game.description}</p>
          <div className="flex items-center gap-3 shrink-0 text-[11px] text-neutral-500">
            <span>Click canvas to focus keyboard</span>
            <span>•</span>
            <span>Press ESC to exit</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
