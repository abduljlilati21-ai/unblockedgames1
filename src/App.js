import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  Gamepad2,
  Play,
  Plus,
  X,
  RotateCcw,
  Flame,
  FileJson,
  Trash2,
  FolderPlus,
  EyeOff,
  Star,
  Shuffle,
  ShieldAlert,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import defaultGamesData from "./data/games.json";
import GameCard from "./components/GameCard";
import GameView from "./components/GameView";
import AddGameModal from "./components/AddGameModal";
import JsonViewModal from "./components/JsonViewModal";
import CloakModal, { applyCloak } from "./components/CloakModal";

const STORAGE_KEY = "novaplay_games_v6";
const FAVORITES_KEY = "novaplay_favorites_v1";

export default function App() {
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse errors
    }
    return defaultGamesData || [];
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [];
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGame, setSelectedGame] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);

  // Initialize cloaking on load if preset exists
  useEffect(() => {
    const savedCloak = localStorage.getItem("novaplay_cloak_preset");
    if (savedCloak && savedCloak !== "default") {
      applyCloak(savedCloak);
    }
  }, []);

  // Panic button shortcut handler (backtick '`')
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        window.location.href = "https://classroom.google.com";
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync games list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    } catch {
      // Ignore storage errors
    }
  }, [games]);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore
    }
  }, [favorites]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const categories = useMemo(() => {
    const set = new Set(games.map((g) => g.category).filter(Boolean));
    const list = ["All"];
    if (favorites.length > 0) {
      list.push("Favorites");
    }
    return [...list, ...Array.from(set)];
  }, [games, favorites]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        game.title?.toLowerCase().includes(query) ||
        game.description?.toLowerCase().includes(query) ||
        game.category?.toLowerCase().includes(query);

      let matchesCategory = true;
      if (selectedCategory === "Favorites") {
        matchesCategory = favorites.includes(game.id);
      } else if (selectedCategory !== "All") {
        matchesCategory = game.category === selectedCategory;
      }

      return matchesSearch && matchesCategory;
    });
  }, [games, search, selectedCategory, favorites]);

  const handleAddGame = (newGame) => {
    setGames((prev) => [newGame, ...prev]);
    setSelectedGame(newGame);
  };

  const handleDeleteGame = (id) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
    setFavorites((prev) => prev.filter((favId) => favId !== id));
    if (selectedGame && selectedGame.id === id) {
      setSelectedGame(null);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset library to the original 12 unblocked games?")) {
      setGames(defaultGamesData);
      setSelectedCategory("All");
      setSearch("");
    }
  };

  const handleClearAllGames = () => {
    if (window.confirm("Are you sure you want to remove all games from the portal?")) {
      setGames([]);
      setSelectedGame(null);
      setSelectedCategory("All");
      setSearch("");
    }
  };

  const handleRandomGame = () => {
    if (games.length === 0) return;
    const randomIndex = Math.floor(Math.random() * games.length);
    setSelectedGame(games[randomIndex]);
  };

  const handlePanic = () => {
    window.location.href = "https://classroom.google.com";
  };

  const featuredGame = games[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-display">
                  NovaPlay
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-cyan-400 text-neutral-950 uppercase tracking-wider">
                  Unblocked
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                HTML5 &amp; Iframe JSON Web Games
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            <input
              id="game-search-input"
              type="text"
              placeholder={games.length > 0 ? "Search games, categories..." : "Library is empty..."}
              disabled={games.length === 0}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-neutral-900 py-2 pl-10 pr-9 text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-cyan-400/60 focus:bg-neutral-850 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {search && (
              <button
                id="clear-search-btn"
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Random Game */}
            {games.length > 0 && (
              <button
                id="random-game-btn"
                type="button"
                onClick={handleRandomGame}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-white/10 text-neutral-300 hover:text-white font-semibold text-xs transition-colors"
                title="Play Random Game"
              >
                <Shuffle className="h-3.5 w-3.5 text-amber-400" />
                <span>Random</span>
              </button>
            )}

            {/* Tab Cloaker / Stealth */}
            <button
              id="cloak-tab-btn"
              type="button"
              onClick={() => setIsCloakModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-white/10 text-neutral-300 hover:text-purple-300 font-semibold text-xs transition-colors"
              title="Disguise browser tab (Google Docs, Classroom, etc.)"
            >
              <EyeOff className="h-3.5 w-3.5 text-purple-400" />
              <span className="hidden sm:inline">Stealth</span>
            </button>

            {/* Quick Panic Button */}
            <button
              id="panic-redirect-btn"
              type="button"
              onClick={handlePanic}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-neutral-400 hover:text-red-300 font-semibold text-xs transition-colors"
              title="Panic Key (`): Redirect to Classroom"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
              <span>Panic</span>
            </button>

            {/* View JSON */}
            <button
              id="view-json-btn"
              type="button"
              onClick={() => setIsJsonModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-white/10 text-neutral-300 hover:text-white font-semibold text-xs transition-colors"
              title="View, Edit & Export games.json"
            >
              <FileJson className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden md:inline">JSON</span>
            </button>

            {/* Add Game Button */}
            <button
              id="add-game-btn"
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs shadow-md transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add Game</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {games.length > 0 ? (
          <>
            {/* Category Filter Pills & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  let count = 0;
                  if (cat === "All") count = games.length;
                  else if (cat === "Favorites") count = favorites.length;
                  else count = games.filter((g) => g.category === cat).length;

                  return (
                    <button
                      key={cat}
                      id={`filter-category-${cat.toLowerCase()}`}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-cyan-400 text-neutral-950 shadow-[0_0_12px_rgba(34,211,238,0.25)] font-bold"
                          : "bg-neutral-900 border border-white/10 text-neutral-300 hover:bg-neutral-850 hover:text-white"
                      }`}
                    >
                      {cat === "Favorites" && (
                        <Star className={`h-3 w-3 ${isActive ? "fill-neutral-950" : "fill-amber-400 text-amber-400"}`} />
                      )}
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded ${
                          isActive
                            ? "bg-neutral-950/20 text-neutral-950"
                            : "bg-white/5 text-neutral-400"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 text-xs text-neutral-400">
                <span>
                  Showing {filteredGames.length} of {games.length} {games.length === 1 ? "game" : "games"}
                </span>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-cyan-400 transition-colors"
                  title="Reset to default games collection"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            {/* Featured Spotlight Banner (shown when browsing All with no search query) */}
            {!search && selectedCategory === "All" && featuredGame && (
              <section
                id="featured-spotlight"
                onClick={() => setSelectedGame(featuredGame)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 p-6 sm:p-8 transition-all hover:border-cyan-400/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="max-w-xl space-y-3 z-10">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                      <Flame className="h-3 w-3 fill-current" />
                      Featured Game
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">
                      {featuredGame.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                      Embedded Iframe
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors font-display">
                    {featuredGame.title}
                  </h1>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {featuredGame.description}
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      id="featured-play-btn"
                      type="button"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 text-neutral-950 font-bold text-xs shadow-lg transition-transform group-hover:scale-105"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Launch Game
                    </button>
                    <span className="text-xs text-neutral-400 font-mono">
                      Press to play
                    </span>
                  </div>
                </div>

                <div className="relative shrink-0 w-full md:w-80 aspect-video rounded-xl overflow-hidden bg-neutral-950 border border-white/10 shadow-lg">
                  <img
                    src={featuredGame.thumbnail}
                    alt={featuredGame.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-colors" />
                </div>
              </section>
            )}

            {/* Games Grid */}
            <section id="games-grid-section">
              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                  <AnimatePresence mode="popLayout">
                    {filteredGames.map((game) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        isFavorite={favorites.includes(game.id)}
                        onToggleFavorite={toggleFavorite}
                        onSelect={(g) => setSelectedGame(g)}
                        onDelete={handleDeleteGame}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div
                  id="empty-search-state"
                  className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-neutral-900/40 p-8 space-y-3"
                >
                  <div className="h-12 w-12 rounded-xl bg-white/5 mx-auto flex items-center justify-center text-neutral-400">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">No games found</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    {selectedCategory === "Favorites"
                      ? "You haven't starred any favorite games yet. Click the star icon on any game card to add it here."
                      : `No games match "${search}". Try searching another name or add a new game.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("All");
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-neutral-200 transition-colors"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </section>
          </>
        ) : (
          /* Empty Library State (When all games are cleared) */
          <div
            id="empty-library-container"
            className="py-20 px-6 max-w-2xl mx-auto text-center border border-dashed border-white/15 rounded-3xl bg-neutral-900/50 backdrop-blur-sm space-y-6"
          >
            <div className="h-16 w-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 mx-auto flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.2)]">
              <Gamepad2 className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight font-display">
                Games Library is Empty
              </h2>
              <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                Your portal currently has 0 games. You can restore the curated unblocked collection or add your own custom game iframe.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                id="empty-add-game-btn"
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs shadow-lg transition-transform hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                <span>Add Your First Game</span>
              </button>

              <button
                id="empty-paste-json-btn"
                type="button"
                onClick={() => setIsJsonModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-neutral-200 font-semibold text-xs transition-colors"
              >
                <FolderPlus className="h-4 w-4 text-cyan-400" />
                <span>Import JSON</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-white/10 bg-neutral-950 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-400">NovaPlay Unblocked</span>
            <span>•</span>
            <span>Unblocked Iframe Games JSON Portal</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-neutral-500">
            <span>{games.length} games stored in JSON</span>
            <span>•</span>
            <span>Panic key: <kbd className="px-1 py-0.5 rounded bg-neutral-800 font-mono text-neutral-300">`</kbd></span>
          </div>
        </div>
      </footer>

      {/* Game Player Modal */}
      <AnimatePresence>
        {selectedGame && (
          <GameView
            game={selectedGame}
            allGames={games}
            onSelectGame={(g) => setSelectedGame(g)}
            onClose={() => setSelectedGame(null)}
          />
        )}
      </AnimatePresence>

      {/* Add Custom Game Modal */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      {/* Raw JSON Database Viewer & Editor */}
      <JsonViewModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onUpdateGames={(updated) => setGames(updated)}
      />

      {/* Tab Cloaker / Stealth Modal */}
      <CloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
      />
    </div>
  );
}
