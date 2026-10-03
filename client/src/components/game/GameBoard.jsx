import { useColorMode } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    BLUE,
    EMPTY,
    NEIGHBORS,
    POINTS,
    POSITIONS,
    RED,
    destinationsFrom,
} from "../../game/engine";

const WIDTH = 430;
const HEIGHT = 600;
const UNIT = 37.5; // pixels per board unit (one square cell = 2 units = 75px)
// The points span x 65..365 and y 75..525; crop the drawing to them plus room for a bead (symmetric, so
// flipping the board keeps it centred).
const VIEW = { x: 40, y: 50, width: 350, height: 500 };

const COLORS = {
    light: { [RED]: "#E63946", [BLUE]: "#457B9D", line: "white" },
    // Brighter blue so beads stand out on the dark board.
    dark: { [RED]: "#EF4444", [BLUE]: "#5DA9E9", line: "#c7c2f0" },
};

const EDGES = POINTS.flatMap((a) => NEIGHBORS[a].filter((b) => b > a).map((b) => [a, b]));

/**
 * Keeps a stable id for every bead so a moving bead animates from its old point to its new one.
 * Works by diffing the previous and the new board, so it also copes with states coming from the server.
 */
const usePieceIds = (board) => {
    const ref = useRef({ board: null, ids: null, next: 0 });
    return useMemo(() => {
        const prev = ref.current;
        if (prev.board === board) return prev.ids;
        const ids = new Array(board.length).fill(null);
        let next = prev.next;
        if (!prev.board) {
            for (const p of POINTS) if (board[p] !== EMPTY) ids[p] = next++;
        } else {
            const vacated = [];
            const filled = [];
            for (const p of POINTS) {
                if (prev.board[p] === board[p]) {
                    if (board[p] !== EMPTY) ids[p] = prev.ids[p];
                    continue;
                }
                if (prev.board[p] !== EMPTY) vacated.push(p);
                if (board[p] !== EMPTY) filled.push(p);
            }
            for (const p of filled) {
                const k = vacated.findIndex((v) => prev.board[v] === board[p]);
                if (k >= 0) {
                    ids[p] = prev.ids[vacated[k]];
                    vacated.splice(k, 1);
                } else {
                    ids[p] = next++;
                }
            }
        }
        ref.current = { board, ids, next };
        return ids;
    }, [board]);
};

/**
 * The 32 Beads board.
 *
 * Controlled component: it renders `state` (see game/engine.js) and reports the player's intent
 * through `onAction({ type: 'move', from, to })` or `onAction({ type: 'endChain' })`.
 */
const GameBoard = ({ state, onAction, canMove = true, flipped = false }) => {
    const [selected, setSelected] = useState(null);
    const palette = COLORS[useColorMode().colorMode] ?? COLORS.light;
    const pieceIds = usePieceIds(state.board);

    // Forget the selection whenever the position changes.
    useEffect(() => setSelected(null), [state.moveNumber, canMove]);

    const active = canMove && state.winner === null;
    // During a capture chain only the capturing bead may move.
    const current = active ? (state.chain ?? selected) : null;
    const destinations = useMemo(
        () => (current === null ? [] : destinationsFrom(state, current)),
        [state, current]
    );
    const movable = useMemo(() => {
        if (!active || state.chain !== null) return new Set();
        return new Set(POINTS.filter((p) => state.board[p] === state.turn && destinationsFrom(state, p).length > 0));
    }, [state, active]);

    const toScreen = (p) => {
        const { x, y } = POSITIONS[p];
        const sx = WIDTH / 2 + x * UNIT;
        const sy = HEIGHT / 2 + y * UNIT;
        return flipped ? { x: WIDTH - sx, y: HEIGHT - sy } : { x: sx, y: sy };
    };

    const handleClick = (p) => {
        if (!active) return;
        if (current !== null && destinations.some((d) => d.to === p)) {
            onAction({ type: "move", from: current, to: p });
            setSelected(null);
        } else if (state.chain !== null) {
            if (p === state.chain) onAction({ type: "endChain" });
        } else if (state.board[p] === state.turn && p !== selected) {
            setSelected(p);
        } else {
            setSelected(null);
        }
    };

    const highlighted = new Set(destinations.map((d) => d.to));
    const threatened = new Set(destinations.map((d) => d.capture).filter((c) => c !== null));
    const last = state.lastMove;

    const pieces = POINTS.filter((p) => state.board[p] !== EMPTY)
        .map((p) => ({ p, id: pieceIds[p], color: state.board[p] }))
        .sort((a, b) => a.id - b.id);

    return (
        <svg
            viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}`}
            width="100%"
            style={{ maxWidth: 420, touchAction: "manipulation", userSelect: "none" }}
            role="img"
            aria-label="32 Beads board"
        >
            {/* Lines */}
            {EDGES.map(([a, b]) => {
                const from = toScreen(a);
                const to = toScreen(b);
                const isPath =
                    current !== null &&
                    ((a === current && highlighted.has(b)) ||
                        (b === current && highlighted.has(a)) ||
                        (threatened.has(a) && highlighted.has(b)) ||
                        (threatened.has(b) && highlighted.has(a)));
                return (
                    <line
                        key={`${a}-${b}`}
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke={isPath ? "#4ade80" : palette.line}
                        strokeWidth={isPath ? 3 : 2}
                        strokeOpacity={isPath ? 1 : 0.5}
                    />
                );
            })}

            {/* Last move */}
            {last && last.from !== undefined && (
                <g pointerEvents="none">
                    <circle {...centre(toScreen(last.from))} r="20" fill="none" stroke="#facc15" strokeWidth="2" strokeDasharray="4 4" />
                    {last.captured.map((c) => (
                        <g key={c} stroke="#facc15" strokeWidth="2" opacity="0.8">
                            <line x1={toScreen(c).x - 7} y1={toScreen(c).y - 7} x2={toScreen(c).x + 7} y2={toScreen(c).y + 7} />
                            <line x1={toScreen(c).x - 7} y1={toScreen(c).y + 7} x2={toScreen(c).x + 7} y2={toScreen(c).y - 7} />
                        </g>
                    ))}
                </g>
            )}

            {/* Points */}
            {POINTS.map((p) => {
                const { x, y } = toScreen(p);
                const target = highlighted.has(p);
                const capture = target && destinations.find((d) => d.to === p)?.capture !== null;
                return (
                    <g key={p} onClick={() => handleClick(p)} style={{ cursor: active ? "pointer" : "default" }}>
                        <circle cx={x} cy={y} r="22" fill="transparent" />
                        <circle cx={x} cy={y} r="20" fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                        <AnimatePresence>
                            {target && (
                                <motion.circle
                                    key="target"
                                    cx={x}
                                    cy={y}
                                    r="11"
                                    fill={capture ? "rgba(250, 204, 21, 0.85)" : "rgba(74, 222, 128, 0.75)"}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    style={{ transformOrigin: `${x}px ${y}px` }}
                                />
                            )}
                        </AnimatePresence>
                    </g>
                );
            })}

            {/* Beads */}
            <AnimatePresence>
                {pieces.map(({ p, id, color }) => {
                    const { x, y } = toScreen(p);
                    const isSelected = current === p;
                    const isThreatened = threatened.has(p);
                    return (
                        <motion.g
                            key={id}
                            initial={{ opacity: 0, scale: 0.5, x, y }}
                            animate={{ opacity: 1, scale: 1, x, y }}
                            exit={{ opacity: 0, scale: 0.2, transition: { duration: 0.35 } }}
                            transition={{ type: "spring", stiffness: 260, damping: 24 }}
                            onClick={() => handleClick(p)}
                            style={{ cursor: active ? "pointer" : "default" }}
                        >
                            {movable.has(p) && !isSelected && (
                                <circle r="19" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="2" />
                            )}
                            <motion.circle
                                r="15"
                                fill={palette[color]}
                                stroke={isSelected ? "white" : isThreatened ? "#facc15" : "rgba(0,0,0,0.25)"}
                                strokeWidth={isSelected || isThreatened ? 3 : 1}
                                animate={{ scale: isSelected ? 1.2 : 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 12 }}
                            />
                            <circle r="5" cx="-4" cy="-5" fill="white" opacity="0.25" pointerEvents="none" />
                        </motion.g>
                    );
                })}
            </AnimatePresence>
        </svg>
    );
};

const centre = ({ x, y }) => ({ cx: x, cy: y });

export default GameBoard;
