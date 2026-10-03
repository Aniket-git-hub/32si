![Dashboard](/dashboard_1.png)

# 32 Beads Board Game 🎲

## Table of Contents

1. Introduction
2. About the Game
3. How to Play
4. Features
5. Future Enhancements
6. Tech Stack
7. License
8. Disclaimer
9. Contributions

## Introduction 📖

32 Beads is an ancient board game played in the eastern part of Bharat (India). This project is a web-based implementation of the game, built using React for the frontend and Node.js for the backend. The game is hosted on Vercel, and the server is hosted on Render.com.

## About the Game 🕹️

32 Beads is a two-player strategy board game. Each player has 16 beads. The objective of the game is to eliminate all of your opponent's beads.

## How to Play 🎮

-   Each player has 16 beads. RED starts at the top of the board and moves first.
-   On your turn, move one bead along a line to a neighbouring empty point.
-   **Capture** by jumping over an enemy bead that is right next to yours, in a straight line, onto the empty point directly behind it. The jumped bead is removed.
-   After a capture, the same bead may keep jumping and capturing in the same turn (multi-capture). You can stop the chain whenever you like.
-   Capturing is optional.
-   **You win** by capturing all of your opponent's beads, or by leaving them with no legal move.
-   After 50 turns in a row without any capture, the game is a draw.

## Game Modes 🕹️

-   **Guest play** – anyone can play the computer, pass & play or take the tutorial without an account.
-   **vs Computer** – Easy, Medium or Hard, play as either colour. The AI runs in a web worker so the board never freezes.
-   **Pass & Play** – two players on one device, with undo.
-   **Online** – create a game and share the 6-letter code or link, join a friend's game, challenge an ally directly, or use **Random Match**. Each turn has a 60-second clock. Rematches swap colours. A player who loses connection has 60 seconds to come back before they forfeit.
-   **Learn** – `/learn` is a five-lesson interactive tutorial.

## Features ⭐

-   User registration and login 🔑, password reset with OTP verification via email 📧
-   Allies (friends), live presence, saved chat with unread badges 💬
-   Elo ratings and a leaderboard 🏆, stats, head-to-head records and replays of online games 📼
-   Game settings: sound, music volume, move/capture hints, confirm-move 🎛️
-   Works on phones (bottom tab bar), light and dark mode 🌗

## How it works 🛠️

-   **Rules engine** – `client/src/game/engine.js` holds the board graph (37 points, with jump lines derived from the board geometry) and the rules. The server has a TypeScript copy in `server/src/game/engine.ts`; `scripts/engine-parity.test.mjs` checks the two behave identically.
-   **AI** – `client/src/game/ai.js`: negamax search with alpha-beta pruning, iterative deepening, a transposition table and a capture-only quiescence search. It searches whole turns (including multi-capture chains). Hard looks about 7–8 turns ahead.
-   **Online play** – the server is authoritative. `server/src/game/rooms.ts` stores the games and validates every move with the rules engine; `server/src/socketIOEventHandlers/gameEventHandler.ts` exposes it over socket.io (`game:create`, `game:join`, `game:action`, `game:resign`, `game:rematch`, `game:leave`, `game:quickMatch`).

## Deploying 🚀

-   **Client (Vercel)**: route env variables like `VITE_GAME_STATS_ROUTE` are optional; when they are missing the default path is used against `VITE_PROD_BASE_URL`.
-   **Server (Render)**: online games, the turn clock and matchmaking live in memory, so run a single instance (a restart ends games in progress). The server trusts one proxy hop for rate limiting.
-   **Database**: no migration needed; existing users get a 1200 rating on their first rated game.

## Tests ✅

```bash
cd client && npm test                                                   # rules engine, AI, tutorial, replays
cd server && npm test                                                   # game rooms, turn clock, ratings, stats, middleware
node --experimental-strip-types --test scripts/engine-parity.test.mjs   # client/server engines agree (Node 22.6+)
```

## Future Enhancements 🚀

-   Tournaments and seasonal leaderboards.
-   Replays and analysis for games against the computer.

## Tech Stack 💻

-   Frontend: React
-   Backend: Node.js
-   Database: MongoDB
-   Hosting: Vercel (frontend), Render.com (backend)

## License 📄

\-

## Disclaimer ⚠️

This project is intended to showcase my capabilities as a developer.

## Contributions 👥

Suggestions and contributions are welcome! Please feel free to open an issue or submit a pull request.
