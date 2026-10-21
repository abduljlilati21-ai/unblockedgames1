import { motion } from "motion/react";
import { Play, Trash2, Star } from "lucide-react";
import { useState } from "react";

const CATEGORY_COLORS = {
  Puzzle: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Arcade: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  Classic: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Retro: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
  Action: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  Sports: "bg-blue-500/15 text-blue-300 border-blue-500/30",
};

export default function GameCard({ game, isFavorite, onToggleFavorite, onSelect, onDelete }) {
  const [imgError, setImgError] = useState(false);
  const badgeClass = CATEGORY_COLORS[game.category] || "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";

  return (
    <motion.div
      id={`game-card-${game.id}`}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(game)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/90 p-3 transition-all duration-300 hover:border-cyan-400/50 hover:bg-neutral-850 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between"
    >
      <div>
        <div className="aspect-[16/10] relative w-full overflow-hidden rounded-xl bg-neutral-950">
          {!imgError && game.thumbnail ? (
            <img
              src={game.thumbnail}
              alt={game.title}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-400 p-4 text-center">
              <span className="font-display font-bold text-base text-cyan-300">{game.title}</span>
              <span className="text-[11px] text-neutral-500 mt-1 uppercase font-mono tracking-wider">{game.category}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
          
          {/* Category Pill */}
          <div className="absolute top-2.5 left-2.5">
            <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md border tracking-wider uppercase backdrop-blur-sm ${badgeClass}`}>
              {game.category}
            </span>
          </div>

          {/* Favorite Star Button */}
          <button
            type="button"
            id={`fav-btn-${game.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(game.id);
            }}
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-all ${
              isFavorite
                ? "bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm"
                : "bg-black/40 text-neutral-400 hover:text-white border border-white/10 opacity-70 group-hover:opacity-100"
            }`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Star className={`h-3.5 w-3.5 ${isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
          </button>

          {/* Hover Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-neutral-950/40 backdrop-blur-[2px]">
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 text-neutral-950 font-bold text-xs shadow-lg transition-transform transform group-hover:scale-105">
              <Play className="h-3.5 w-3.5 fill-current" />
              Play Now
            </span>
          </div>
        </div>

        <div className="mt-3 px-1">
          <h3 className="text-base font-bold text-neutral-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
            {game.title}
          </h3>
          <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between px-1 text-[11px] text-neutral-400">
        <span className="font-mono text-[10px] text-cyan-400/70 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
          JSON Iframe
        </span>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              id={`delete-game-btn-${game.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Remove "${game.title}" from library?`)) {
                  onDelete(game.id);
                }
              }}
              className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Delete Game"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            id={`play-btn-${game.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(game);
            }}
            className="inline-flex items-center gap-1 text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Play</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
