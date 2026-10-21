# Add Highway Racer 2 & Update Games Catalog

Configure the unblocked games portal by clearing invalid/placeholder game entries and adding **Highway Racer 2** as the featured unblocked 3D racing game with responsive iframe playback and sandbox permissions.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> - **Game Entry**: We are adding **Highway Racer 2** using the verified playable embed URL: `https://petezahgames.com/storage/ag/originals/highway-race2/index.html`.
> - **Category**: Assigned to the **Action** category (with a **Racing** badge tag).
> - **Iframe Sandbox & Permissions**: Configured with `allow-scripts allow-pointer-lock allow-forms allow-same-origin allow-downloads allow-popups allow-popups-to-escape-sandbox allowfullscreen` so 3D mouse look/controls, audio, and keyboard inputs work smoothly.
> - **Catalog State**: Stored in `src/data/games.json` and synchronized with client `localStorage` (`novaplay_games_v6`), with automatic fallback support for GitHub Pages static hosting.

---

### 1. Overview & Core Concept

- **What It Does**: Integrates **Highway Racer 2** into the NovaPlay portal as an unblocked, high-speed 3D driving title. Users can browse the game card, view gameplay tags, click into a full-screen or framed theater mode, toggle favorites, and launch the game directly inside an interactive sandbox iframe.
- **Target Audience**: Students, casual web gamers, and arcade racing enthusiasts looking for fast, unblocked web games with responsive controls.
- **Key Value**: Provides a verified, working web game iframe with full browser fullscreen support, stealth tab cloaking, and zero external dependency failures.

---

### 2. User Experience & Visual Design

- **Discovery & Spotlight**:
  - **Featured Hero Banner**: Highway Racer 2 prominently highlighted as the primary featured title when opening the portal with launch action and game metadata badges (`Action`, `3D Racing`, `Embedded Iframe`).
  - **Game Card**: High-contrast dark cyber-arcade card with dynamic hover lighting, play overlay, favorite star toggle, and category pill.
- **Theater Game View Modal**:
  - Full viewport immersion with a top navigation bar (Back button, Title, Fullscreen toggle, Reload frame, and Open in New Tab option).
  - Responsive 16:9 and full-window iframe container with sandbox security attributes.
- **Visual Palette**:
  - Background: Deep slate/black (`#0a0a0c`, `bg-neutral-950`)
  - Accent: High-visibility cyan (`#22d3ee`) with amber and emerald indicator chips.
  - Typography: Display typography for bold gaming headers and clean sans-serif for controls.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full Sandbox Permissions for Highway Racer 2**
  - *Chosen Approach*: Include `allow-pointer-lock`, `allow-scripts`, `allow-same-origin`, and `allow-downloads` inside the iframe element.
  - *Why*: Highway Racer 2 uses mouse-look or keyboard pointer locking and sound drivers; without these permissions, the game controls would freeze.
- **Decision 2: Persistent Storage Key Bump (`v6`)**
  - *Chosen Approach*: Bump the localStorage sync key to `novaplay_games_v6`.
  - *Why*: Ensures any client with previously cached empty arrays or old entries immediately displays Highway Racer 2 without requiring manual browser cache clearing.
- **Decision 3: Maintain Dual-Mode GitHub Pages and Vite Bundles**
  - *Chosen Approach*: Update `src/data/games.json` and rebuild both `./dist/` and root `./assets/app.js` with the updated catalog.
  - *Why*: Guarantees the game works seamlessly on GitHub Pages branch deployments, GitHub Actions deployments, and local dev environments.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                   src/data/games.json                  │
│       [ Highway Racer 2: id, title, url, iframe ]       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                     src/App.js                         │
│  - State: games (v6), favorites, selectedGame, search  │
│  - Sync: localStorage (novaplay_games_v6)              │
└─────────────┬────────────────────────────┬─────────────┘
              │                            │
              ▼                            ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│       GameCard.js         │ │        GameView.js        │
│  - Hero spotlight view    │ │  - Responsive iframe      │
│  - Catalog grid card      │ │  - Fullscreen / Reload    │
│  - Star favorite toggle   │ │  - Pointer-lock sandbox   │
└───────────────────────────┘ └───────────────────────────┘
```

- **Data Schema (`src/data/games.json`)**:
  ```json
  [
    {
      "id": "highway-racer-2",
      "title": "Highway Racer 2",
      "category": "Action",
      "description": "High-speed 3D highway racing game. Dodge dense traffic, overtake vehicles at full speed, and customize your supercars across dynamic highways.",
      "thumbnail": "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80",
      "url": "https://petezahgames.com/storage/ag/originals/highway-race2/index.html",
      "iframe": "<iframe src=\"https://petezahgames.com/storage/ag/originals/highway-race2/index.html\" sandbox=\"allow-scripts allow-pointer-lock allow-forms allow-same-origin allow-downloads allow-popups allow-popups-to-escape-sandbox\" title=\"Highway Racer 2\" style=\"width: 100%; height: 100%; border: none; display: block;\" allow=\"autoplay; fullscreen; keyboard; gamepad\" allowfullscreen></iframe>"
    }
  ]
  ```
