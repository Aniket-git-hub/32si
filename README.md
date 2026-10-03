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

-   **vs Computer** – Easy, Medium or Hard, play as either colour. The AI runs in a web worker so the board never freezes.
-   **Pass & Play** – two players on one device, with undo.
-   **Online** – create a game and share the 6-letter code or link, join a friend's game, or use **Random Match**. Rematches swap colours. A player who loses connection has 60 seconds to come back before they forfeit.

## Features ⭐

-   User registration and login 🔑
-   Password reset functionality with OTP verification via email 📧
-   Email notifications on account creation 🎉
-   Real-time communication using WebSockets 💬
-   Finished online games are saved to each player's history 📜

## How it works 🛠️

-   **Rules engine** – `client/src/game/engine.js` holds the board graph (37 points, with jump lines derived from the board geometry) and the rules. The server has a TypeScript copy in `server/src/game/engine.ts`; `scripts/engine-parity.test.mjs` checks the two behave identically.
-   **AI** – `client/src/game/ai.js`: negamax search with alpha-beta pruning, iterative deepening, a transposition table and a capture-only quiescence search. It searches whole turns (including multi-capture chains). Hard looks about 7–8 turns ahead.
-   **Online play** – the server is authoritative. `server/src/game/rooms.ts` stores the games and validates every move with the rules engine; `server/src/socketIOEventHandlers/gameEventHandler.ts` exposes it over socket.io (`game:create`, `game:join`, `game:action`, `game:resign`, `game:rematch`, `game:leave`, `game:quickMatch`).

## Tests ✅

```bash
cd client && npm test                                                   # rules engine + AI
cd server && npx jest tests/game                                        # online game rooms
node --experimental-strip-types --test scripts/engine-parity.test.mjs   # client/server engines agree (Node 22.6+)
```

## Future Enhancements 🚀

-   Challenge a friend directly from the Rivals page.
-   Stats and leaderboards from the saved games.

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
