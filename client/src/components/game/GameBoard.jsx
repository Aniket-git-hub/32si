import { useColorMode } from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    BLUE,
    DRAW,
    EMPTY,
    NEIGHBORS,
    POINTS,
    POSITIONS,
    RED,
    destinationsFrom,
    jumpsFrom,
    opponent,
} from "../../game/engine";
import { useGameSettings } from "../../context/GameSettingsContext";

const WIDTH = 430;
const HEIGHT = 600;
const UNIT = 37.5; // pixels per board unit (one square cell = 2 units = 75px)
// The points span x 65..365 and y 75..525; crop the drawing to them plus room for a bead (symmetric, so
// flipping the board keeps it centred).
const VIEW = { x: 40, y: 50, width: 350, height: 500 };
const SLAB = { x: 46, y: 56, width: 338, height: 488, radius: 28 };
const BEAD = 15;

// Motion language: one easing curve, three durations, no overshoot ("premium").
const EASE = [0.4, 0, 0.2, 1];
const QUICK = 0.18;
const STANDARD = 0.38;
const SLOW = 0.6;

const THEMES = {
    light: {
        slab: ["#f6e7c8", "#e9d2a6"],
        slabEdge: "#c9a66b",
        line: "#8a6a3d",
        lineGlow: "rgba(255,255,255,0.55)",
        hole: ["#a88553", "#e9d2a6"],
        beads: {
            [RED]: ["#ff9b9b", "#e63946", "#9e1b28"],
            [BLUE]: ["#a8d4f5", "#3d82c0", "#1f4f7d"],
        },
        glow: { [RED]: "#e63946", [BLUE]: "#3d82c0" },
        step: "#22a35a",
        capture: "#e2a400",
    },
    dark: {
        slab: ["#2b2858", "#1c1a3d"],
        slabEdge: "#463f8a",
        line: "#a49ce8",
        lineGlow: "rgba(0,0,0,0.45)",
        hole: ["#0f0e24", "#2b2858"],
        beads: {
            [RED]: ["#ffb0b0", "#ef4444", "#a3202a"],
            [BLUE]: ["#c4e5ff", "#5da9e9", "#24619b"],
        },
        glow: { [RED]: "#ff6b6b", [BLUE]: "#6db8f5" },
        step: "#4ade80",
        capture: "#facc15",
    },
};

const EDGES = POINTS.flatMap((a) => NEIGHBORS[a].filter((b) => b > a).map((b) => [a, b]));

/**
 * Keeps a stable id for every bead so a moving bead animates from its old point to its new one.
 * Works by diffing the previous and the new board, so it also copes with states coming from the server.
 * A fresh game gets fresh ids, so the beads cascade in instead of flying back to the start.
 */
const usePieceIds = (board, moveNumber) => {
    const ref = useRef({ board: null, ids: null, next: 0, moveNumber: 0 });
    return useMemo(() => {
        const prev = ref.current;
        if (prev.board === board) return prev.ids;
        const ids = new Array(board.length).fill(null);
        let next = prev.next;
        const restart = moveNumber === 0 && prev.moveNumber !== 0;
        if (!prev.board || restart) {
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
        ref.current = { board, ids, next, moveNumber };
        return ids;
    }, [board, moveNumber]);
};

/**
 * Counts real moves: advances only when the board's contents change (ending a capture chain or the server
 * re-sending the same position must not replay the last move's animation).
 */
const useMoveSequence = (board) => {
    const ref = useRef({ key: null, seq: 0 });
    const key = board.join("");
    if (ref.current.key !== null && ref.current.key !== key) ref.current = { key, seq: ref.current.seq + 1 };
    else if (ref.current.key === null) ref.current = { key, seq: 0 };
    return ref.current.seq;
};

/** Particles and a shockwave where a bead was captured. */
const CaptureBurst = ({ x, y, color, delay }) => {
    const particles = useMemo(
        () =>
            Array.from({ length: 10 }, (_, i) => {
                const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.4;
                const distance = 20 + Math.random() * 14;
                return { dx: Math.cos(angle) * distance, dy: Math.sin(angle) * distance, r: 1.6 + Math.random() * 1.8 };
            }),
        []
    );
    return (
        <g pointerEvents="none" transform={`translate(${x} ${y})`}>
            <motion.circle
                r={BEAD}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                initial={{ scale: 0.6, opacity: 0.9 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: SLOW, delay, ease: EASE }}
            />
            {particles.map((p, i) => (
                <motion.circle
                    key={i}
                    r={p.r}
                    fill={color}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0.4 }}
                    transition={{ duration: SLOW, delay, ease: [0.05, 0.7, 0.1, 1] }}
                />
            ))}
        </g>
    );
};

/**
 * The 32 Beads board.
 *
 * Controlled component: it renders `state` (see game/engine.js) and reports the player's intent
 * through `onAction({ type: 'move', from, to })` or `onAction({ type: 'endChain' })`.
 * Hints and tap-to-confirm follow the player's game settings unless overridden with `hints`.
 */
const GameBoard = ({ state, onAction, canMove = true, flipped = false, hints }) => {
    const [selected, setSelected] = useState(null);
    // With "confirm moves" on, the first tap on a destination only marks it.
    const [pending, setPending] = useState(null);
    // A bead that was tapped but can't be used gives a small shake.
    const [shake, setShake] = useState({ p: null, n: 0 });
    const { settings } = useGameSettings();
    const { moveHints, captureHints, confirmMoves } = { ...settings, ...hints };
    const theme = THEMES[useColorMode().colorMode] ?? THEMES.light;
    const reduceMotion = useReducedMotion();
    const pieceIds = usePieceIds(state.board, state.moveNumber);
    const moveSeq = useMoveSequence(state.board);
    const uid = useMemo(() => Math.random().toString(36).slice(2, 8), []); // unique SVG ids per board

    // Forget the selection whenever the position changes.
    useEffect(() => {
        setSelected(null);
        setPending(null);
    }, [state.moveNumber, canMove]);

    const active = canMove && state.winner === null;
    // During a capture chain only the capturing bead may move.
    const current = active ? (state.chain ?? selected) : null;
    const destinations = useMemo(
        () => (current === null ? [] : destinationsFrom(state, current)),
        [state, current]
    );
    const movable = useMemo(() => {
        if (!active || state.chain !== null || !moveHints) return new Set();
        return new Set(POINTS.filter((p) => state.board[p] === state.turn && destinationsFrom(state, p).length > 0));
    }, [state, active, moveHints]);
    // Beads that can capture right now (captures are optional, so beginners easily miss them).
    const capturers = useMemo(() => {
        if (!active || state.chain !== null || !captureHints) return new Set();
        return new Set(POINTS.filter((p) => state.board[p] === state.turn && jumpsFrom(state.board, p).length > 0));
    }, [state, active, captureHints]);

    const toScreen = (p) => {
        const { x, y } = POSITIONS[p];
        const sx = WIDTH / 2 + x * UNIT;
        const sy = HEIGHT / 2 + y * UNIT;
        return flipped ? { x: WIDTH - sx, y: HEIGHT - sy } : { x: sx, y: sy };
    };

    const nudge = (p) => setShake((s) => ({ p, n: s.n + 1 }));

    const handleClick = (p) => {
        if (!active) return;
        if (current !== null && destinations.some((d) => d.to === p)) {
            if (confirmMoves && pending !== p) {
                setPending(p);
                return;
            }
            onAction({ type: "move", from: current, to: p });
            setSelected(null);
            setPending(null);
            return;
        }
        setPending(null);
        // Mid-chain the capturing bead stays selected; ending the chain early is an explicit button press
        // (tapping the bead again is too easy to do by accident).
        if (state.chain !== null) {
            if (state.board[p] !== EMPTY && p !== state.chain) nudge(p);
            return;
        }
        if (state.board[p] === state.turn && p !== selected) {
            if (destinationsFrom(state, p).length === 0) nudge(p); // boxed in
            else setSelected(p);
        } else if (state.board[p] !== EMPTY && state.board[p] !== state.turn) {
            nudge(p); // not your bead
            setSelected(null);
        } else {
            setSelected(null);
        }
    };

    // Destinations stay clickable without hints; they're just not drawn.
    const highlighted = new Set(moveHints ? destinations.map((d) => d.to) : []);
    const threatened = new Set(moveHints ? destinations.map((d) => d.capture).filter((c) => c !== null) : []);
    const last = state.lastMove;
    const lastWasJump = Boolean(last?.captured?.length);
    const moveDuration = reduceMotion ? 0.01 : lastWasJump ? 0.52 : STANDARD;

    const pieces = POINTS.filter((p) => state.board[p] !== EMPTY)
        .map((p) => ({ p, id: pieceIds[p], color: state.board[p] }))
        .sort((a, b) => a.id - b.id);

    const gameOver = state.winner !== null;
    const turnGlow = gameOver ? (state.winner === DRAW ? theme.slabEdge : theme.glow[state.winner]) : theme.glow[state.turn];
    const id = (name) => `${name}-${uid}`;

    return (
        <svg
            viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}`}
            width="100%"
            style={{ maxWidth: 420, touchAction: "manipulation", userSelect: "none", WebkitTapHighlightColor: "transparent" }}
            role="img"
            aria-label="32 Beads board"
        >
            <defs>
                <linearGradient id={id("slab")} x1="0" y1="0" x2="0.4" y2="1">
                    <stop offset="0%" stopColor={theme.slab[0]} />
                    <stop offset="100%" stopColor={theme.slab[1]} />
                </linearGradient>
                <radialGradient id={id("hole")} cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor={theme.hole[0]} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={theme.hole[1]} stopOpacity="0" />
                </radialGradient>
                {[RED, BLUE].map((c) => (
                    <radialGradient key={c} id={id(`bead-${c}`)} cx="35%" cy="30%" r="75%">
                        <stop offset="0%" stopColor={theme.beads[c][0]} />
                        <stop offset="45%" stopColor={theme.beads[c][1]} />
                        <stop offset="100%" stopColor={theme.beads[c][2]} />
                    </radialGradient>
                ))}
                <filter id={id("soft")} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.8" />
                </filter>
                <filter id={id("slabShadow")} x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.28" />
                </filter>
                <filter id={id("glow")} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" />
                </filter>
            </defs>

            {/* Board slab, with an edge glow in the colour of the player to move */}
            <motion.rect
                x={SLAB.x}
                y={SLAB.y}
                width={SLAB.width}
                height={SLAB.height}
                rx={SLAB.radius}
                fill="none"
                strokeWidth={6}
                filter={`url(#${id("glow")})`}
                initial={false}
                animate={{ stroke: turnGlow, opacity: gameOver ? 0.9 : 0.55 }}
                transition={{ duration: SLOW, ease: EASE }}
            />
            <rect
                x={SLAB.x}
                y={SLAB.y}
                width={SLAB.width}
                height={SLAB.height}
                rx={SLAB.radius}
                fill={`url(#${id("slab")})`}
                stroke={theme.slabEdge}
                strokeWidth={1.5}
                filter={`url(#${id("slabShadow")})`}
            />

            {/* Engraved lines: a light offset under a dark groove */}
            <g pointerEvents="none" strokeLinecap="round">
                {EDGES.map(([a, b]) => {
                    const from = toScreen(a);
                    const to = toScreen(b);
                    return (
                        <line key={`g-${a}-${b}`} x1={from.x} y1={from.y + 1.2} x2={to.x} y2={to.y + 1.2} stroke={theme.lineGlow} strokeWidth={2} />
                    );
                })}
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
                        <motion.line
                            key={`${a}-${b}`}
                            x1={from.x}
                            y1={from.y}
                            x2={to.x}
                            y2={to.y}
                            initial={false}
                            animate={{
                                stroke: isPath ? theme.step : theme.line,
                                strokeWidth: isPath ? 3.2 : 2,
                                opacity: isPath ? 1 : 0.7,
                            }}
                            transition={{ duration: QUICK, ease: EASE }}
                        />
                    );
                })}
            </g>

            {/* Last move: a faint gold trace from where the bead came from */}
            {last && last.from !== undefined && !gameOver && (
                <g pointerEvents="none" key={`last-${moveSeq}`}>
                    <motion.line
                        x1={toScreen(last.from).x}
                        y1={toScreen(last.from).y}
                        x2={toScreen(last.to).x}
                        y2={toScreen(last.to).y}
                        stroke={theme.capture}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.5 }}
                        transition={{ duration: moveDuration, ease: EASE }}
                    />
                    <circle cx={toScreen(last.from).x} cy={toScreen(last.from).y} r={BEAD - 3} fill="none" stroke={theme.capture} strokeOpacity={0.6} strokeWidth={1.5} />
                </g>
            )}

            {/* Points: carved holes, destination markers and click targets */}
            {POINTS.map((p) => {
                const { x, y } = toScreen(p);
                const target = highlighted.has(p);
                const capture = target && destinations.find((d) => d.to === p)?.capture !== null;
                const markerColor = capture ? theme.capture : theme.step;
                return (
                    <g key={p} onClick={() => handleClick(p)} style={{ cursor: active ? "pointer" : "default" }}>
                        <circle cx={x} cy={y} r="22" fill="transparent" />
                        <circle cx={x} cy={y} r="7" fill={`url(#${id("hole")})`} pointerEvents="none" />
                        {pending === p && (
                            <motion.circle
                                cx={x}
                                cy={y}
                                r="19"
                                fill="none"
                                stroke={markerColor}
                                strokeWidth="3"
                                pointerEvents="none"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                            />
                        )}
                        <AnimatePresence>
                            {target && (
                                <motion.g
                                    key="target"
                                    pointerEvents="none"
                                    style={{ transformOrigin: `${x}px ${y}px` }}
                                    initial={{ scale: 0.4, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.4, opacity: 0, transition: { duration: QUICK * 0.7, ease: [0.3, 0, 1, 1] } }}
                                    transition={{ duration: QUICK * 1.4, ease: EASE }}
                                >
                                    {!reduceMotion && (
                                        <motion.circle
                                            cx={x}
                                            cy={y}
                                            r="14"
                                            fill="none"
                                            stroke={markerColor}
                                            strokeWidth="2"
                                            animate={{ opacity: [0.7, 0.15, 0.7], scale: [1, 1.12, 1] }}
                                            style={{ transformOrigin: `${x}px ${y}px` }}
                                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                                        />
                                    )}
                                    <circle cx={x} cy={y} r="8.5" fill={markerColor} opacity={0.9} />
                                    {capture && <circle cx={x} cy={y} r="3.5" fill="white" opacity={0.85} />}
                                </motion.g>
                            )}
                        </AnimatePresence>
                    </g>
                );
            })}

            {/* Beads */}
            <AnimatePresence>
                {pieces.map(({ p, id: pieceId, color }, index) => {
                    const { x, y } = toScreen(p);
                    const isSelected = current === p;
                    const isThreatened = threatened.has(p);
                    const justMoved = last?.to === p && moveSeq > 0;
                    const lift = justMoved && !reduceMotion ? (lastWasJump ? 18 : 6) : 0;
                    const won = gameOver && state.winner === color;
                    const lost = gameOver && state.winner === opponent(color);
                    const shaking = shake.p === p;
                    return (
                        <motion.g
                            key={pieceId}
                            initial={reduceMotion ? { x, y, opacity: 0 } : { x, y: y - 14, opacity: 0 }}
                            animate={{ x, y, opacity: lost ? 0.45 : 1 }}
                            exit={{
                                opacity: 0,
                                scale: reduceMotion ? 1 : [1, 1.25, 0.2],
                                transition: { duration: 0.42, delay: reduceMotion ? 0 : 0.22, ease: EASE },
                            }}
                            transition={{
                                x: { duration: moveDuration, ease: EASE },
                                y: { duration: moveDuration, ease: EASE, delay: state.moveNumber === 0 ? index * 0.012 : 0 },
                                opacity: { duration: STANDARD, ease: EASE, delay: state.moveNumber === 0 ? index * 0.012 : 0 },
                            }}
                            onClick={() => handleClick(p)}
                            style={{ cursor: active ? "pointer" : "default" }}
                        >
                            {/* Contact shadow: spreads and softens as the bead lifts */}
                            <motion.ellipse
                                cx={0}
                                cy={5}
                                rx={BEAD - 1}
                                ry={6}
                                fill="#000"
                                filter={`url(#${id("soft")})`}
                                initial={false}
                                animate={
                                    lift
                                        ? { opacity: [0.32, 0.14, 0.32], scale: [1, 1.35, 1] }
                                        : { opacity: isSelected ? 0.2 : 0.32, scale: isSelected ? 1.3 : 1 }
                                }
                                transition={{ duration: lift ? moveDuration : QUICK, ease: EASE }}
                                key={lift ? `shadow-${moveSeq}` : "shadow"}
                            />

                            {capturers.has(p) && !isSelected && (
                                <motion.circle
                                    r={BEAD + 5}
                                    fill="none"
                                    stroke={theme.capture}
                                    strokeWidth="3"
                                    animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 0.35, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                                />
                            )}
                            {!capturers.has(p) && movable.has(p) && !isSelected && (
                                <circle r={BEAD + 4} fill="none" stroke={theme.glow[color]} strokeOpacity="0.55" strokeWidth="2" />
                            )}
                            {won && !reduceMotion && (
                                <motion.circle
                                    r={BEAD + 4}
                                    fill={theme.glow[color]}
                                    filter={`url(#${id("glow")})`}
                                    animate={{ opacity: [0.15, 0.55, 0.15] }}
                                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: (index % 6) * 0.15 }}
                                />
                            )}

                            {/* The bead itself (lifted in an arc when it jumps; shakes when it can't be used) */}
                            <motion.g
                                key={`${justMoved ? moveSeq : "rest"}-${shaking ? shake.n : 0}`}
                                initial={false}
                                animate={{
                                    y: lift ? [0, -lift, 0] : isSelected ? -3 : 0,
                                    scale: lift ? [1, lastWasJump ? 1.16 : 1.06, 1] : isSelected ? 1.14 : 1,
                                    x: shaking && !reduceMotion ? [0, -4, 4, -3, 3, 0] : 0,
                                }}
                                transition={{
                                    y: { duration: lift ? moveDuration : QUICK, ease: EASE },
                                    scale: { duration: lift ? moveDuration : QUICK, ease: EASE },
                                    x: { duration: 0.34, ease: "easeInOut" },
                                }}
                                whileHover={active && state.board[p] === state.turn && !isSelected ? { y: -2 } : undefined}
                            >
                                <circle
                                    r={BEAD}
                                    fill={`url(#${id(`bead-${color}`)})`}
                                    stroke={isSelected ? "white" : isThreatened ? theme.capture : "rgba(0,0,0,0.25)"}
                                    strokeWidth={isSelected || isThreatened ? 2.5 : 0.8}
                                />
                                <ellipse cx={-4.5} cy={-6} rx={5} ry={3.2} fill="white" opacity={0.55} transform="rotate(-30 -4.5 -6)" pointerEvents="none" />
                                <circle r={BEAD - 1} fill="none" stroke="white" strokeOpacity={0.12} strokeWidth={1} pointerEvents="none" />
                            </motion.g>
                        </motion.g>
                    );
                })}
            </AnimatePresence>

            {/* Capture bursts, timed to the jumper passing over the captured bead */}
            {!reduceMotion &&
                lastWasJump &&
                last.captured.map((c) => {
                    const { x, y } = toScreen(c);
                    return (
                        <CaptureBurst
                            key={`burst-${moveSeq}-${c}`}
                            x={x}
                            y={y}
                            color={theme.glow[opponent(last.player)]}
                            delay={moveDuration * 0.45}
                        />
                    );
                })}
        </svg>
    );
};

export default GameBoard;
