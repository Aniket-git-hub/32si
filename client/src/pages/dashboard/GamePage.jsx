import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaBook, FaChessBoard, FaRedo, FaRobot, FaUndo, FaUsers } from "react-icons/fa";
import { MdMusicNote, MdMusicOff } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import GameBoard from "../../components/game/GameBoard";
import {
  GameOverModal,
  HowToPlayModal,
  PanelCard,
  PLAYER_COLORS,
  PLAYER_LABELS,
  ScoreCard,
  TurnCard,
} from "../../components/game/GamePanels";
import { DIFFICULTIES } from "../../game/ai";
import { BLUE, DRAW, RED, applyAction, capturedBy, createInitialState, opponent } from "../../game/engine";
import useGameSounds from "../../hooks/useGameSounds";

const HISTORY_KEY = "32beads.recentGames";
const AI_STEP_DELAY = 450;
const AI_MIN_THINK = 500;

const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? [];
  } catch {
    return [];
  }
};

const saveHistory = (history) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Storage can be unavailable (private mode); the list just won't persist.
  }
};

/** Runs the AI in a web worker; returns a function that resolves with the chosen turn. */
const useAiWorker = () => {
  const workerRef = useRef(null);
  const pending = useRef(new Map());
  const nextId = useRef(0);

  useEffect(() => {
    const worker = new Worker(new URL("../../game/ai.worker.js", import.meta.url), { type: "module" });
    worker.onmessage = ({ data }) => {
      const callbacks = pending.current.get(data.id);
      if (!callbacks) return;
      pending.current.delete(data.id);
      if (data.error) callbacks.reject(new Error(data.error));
      else callbacks.resolve(data.result);
    };
    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  return useCallback(
    (state, level) =>
      new Promise((resolve, reject) => {
        const id = ++nextId.current;
        pending.current.set(id, { resolve, reject });
        workerRef.current.postMessage({ id, state, level });
      }),
    []
  );
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function GamePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "ai" ? "ai" : "local";
  const humanColor = searchParams.get("color") === "blue" ? BLUE : RED;
  const level = DIFFICULTIES[searchParams.get("level")] ? searchParams.get("level") : "medium";
  const aiColor = opponent(humanColor);

  const [state, setState] = useState(createInitialState);
  const [gameId, setGameId] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [history, setHistory] = useState(loadHistory);
  const [undoStack, setUndoStack] = useState([]);
  const gameOver = useDisclosure();
  const rules = useDisclosure();
  const { play, toggleMusic, isMusicPlaying } = useGameSounds();
  const askAi = useAiWorker();
  const stateRef = useRef(state);
  stateRef.current = state;

  const newGame = useCallback(() => {
    setState(createInitialState());
    setUndoStack([]);
    setGameId((id) => id + 1);
    setThinking(false);
    gameOver.onClose();
    play("newGame");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);

  const changeSettings = (changes) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  // Any change of mode, colour or difficulty starts a fresh game.
  useEffect(() => {
    newGame();
  }, [mode, humanColor, level, newGame]);

  // Sounds and game-over handling.
  useEffect(() => {
    if (state.moveNumber === 0) return;
    if (state.winner !== null) {
      const lost = mode === "ai" && state.winner === aiColor;
      play(lost ? "lose" : "win");
      gameOver.onOpen();
      const entry = {
        mode,
        level: mode === "ai" ? level : null,
        humanColor: mode === "ai" ? humanColor : null,
        winner: state.winner,
        red: capturedBy(state, RED),
        blue: capturedBy(state, BLUE),
        at: Date.now(),
      };
      setHistory((h) => {
        const next = [entry, ...h].slice(0, 5);
        saveHistory(next);
        return next;
      });
    } else {
      play(state.lastMove?.captured.length ? "kill" : "move");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.moveNumber]);

  // The computer's turn.
  const aiToMove = mode === "ai" && state.winner === null && state.turn === aiColor;
  useEffect(() => {
    if (!aiToMove) return;
    let cancelled = false;
    const timers = [];
    setThinking(true);
    Promise.all([askAi(stateRef.current, level), delay(AI_MIN_THINK)])
      .then(([result]) => {
        if (cancelled) return;
        setThinking(false);
        if (!result) return;
        result.actions.forEach((action, k) => {
          timers.push(setTimeout(() => !cancelled && setState((s) => applyAction(s, action)), k * AI_STEP_DELAY));
        });
      })
      .catch((error) => {
        console.error(error);
        setThinking(false);
      });
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [aiToMove, gameId, askAi, level]);

  const handleAction = (action) => {
    if (aiToMove) return;
    // Remember the position at the start of each human turn so it can be undone.
    if (state.chain === null) setUndoStack((stack) => [...stack, state]);
    setState((s) => applyAction(s, action));
  };

  const undo = () => {
    if (!undoStack.length || thinking) return;
    setState(undoStack[undoStack.length - 1]);
    setUndoStack((stack) => stack.slice(0, -1));
    setGameId((id) => id + 1); // cancels a pending computer move
  };

  const names =
    mode === "ai"
      ? { [humanColor]: "You", [aiColor]: "Computer" }
      : { [RED]: "Red", [BLUE]: "Blue" };

  const winnerTitle =
    state.winner === DRAW
      ? "It's a draw"
      : mode === "ai"
        ? state.winner === humanColor
          ? "You win!"
          : "The computer wins"
        : `${PLAYER_LABELS[state.winner] ?? ""} WINS!`;

  const bg = useColorModeValue("linear-gradient(to right, #f6d365, #fda085)", "linear-gradient(to right, #667eea, #764ba2)");

  return (
    <Grid
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      bg={bg}
      borderRadius={10}
      p={{ base: 3, md: 6 }}
      templateColumns={{ base: "1fr", lg: "repeat(10, 1fr)" }}
      gap={4}
    >
      <GridItem colSpan={{ base: 1, lg: 10 }} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <ButtonGroup isAttached size="sm">
          <Button
            leftIcon={<FaUsers />}
            colorScheme="purple"
            variant={mode === "local" ? "solid" : "outline"}
            onClick={() => changeSettings({ mode: "local" })}
          >
            Pass &amp; Play
          </Button>
          <Button
            leftIcon={<FaRobot />}
            colorScheme="purple"
            variant={mode === "ai" ? "solid" : "outline"}
            onClick={() => changeSettings({ mode: "ai" })}
          >
            vs Computer
          </Button>
        </ButtonGroup>
        <ButtonGroup size="sm">
          <Button leftIcon={<FaBook />} colorScheme="purple" variant="outline" onClick={rules.onOpen}>
            How to play
          </Button>
          <Button
            onClick={toggleMusic}
            colorScheme="purple"
            leftIcon={isMusicPlaying ? <MdMusicNote /> : <MdMusicOff />}
          >
            {isMusicPlaying ? "Pause Music" : "Play Music"}
          </Button>
        </ButtonGroup>
      </GridItem>

      {/* Left column */}
      <GridItem colSpan={{ base: 1, lg: 2 }}>
        <VStack spacing={4}>
          <ScoreCard state={state} names={names} />
          <PanelCard>
            <Text fontWeight="bold" display="flex" alignItems="center" justifyContent="center" gap={2}>
              <FaChessBoard /> RECENT GAMES
            </Text>
            {history.length === 0 && (
              <Text fontSize="sm" textAlign="center">
                No games yet
              </Text>
            )}
            {history.map((game) => (
              <Text key={game.at} fontSize="sm" color={PLAYER_COLORS[game.winner]} textAlign="center">
                {game.mode === "ai" ? `vs ${DIFFICULTIES[game.level]?.label ?? ""} AI` : "Pass & Play"} ·{" "}
                {game.winner === DRAW
                  ? "Draw"
                  : game.mode === "ai"
                    ? game.winner === game.humanColor
                      ? "Won"
                      : "Lost"
                    : `${PLAYER_LABELS[game.winner]} won`}{" "}
                ({game.red}-{game.blue})
              </Text>
            ))}
          </PanelCard>
        </VStack>
      </GridItem>

      {/* Board */}
      <GridItem colSpan={{ base: 1, lg: 6 }}>
        <Box display="flex" justifyContent="center">
          <GameBoard
            key={`${mode}-${humanColor}`}
            state={state}
            onAction={handleAction}
            canMove={!aiToMove}
            flipped={mode === "ai" && humanColor === RED}
          />
        </Box>
      </GridItem>

      {/* Right column */}
      <GridItem colSpan={{ base: 1, lg: 2 }}>
        <VStack spacing={4}>
          <TurnCard
            state={state}
            label={names[state.turn]}
            thinking={thinking}
            canEndChain={!aiToMove}
            onEndChain={() => handleAction({ type: "endChain" })}
          />
          {mode === "ai" && (
            <PanelCard>
              <Text fontWeight="bold" textAlign="center">
                YOU PLAY
              </Text>
              <ButtonGroup isAttached size="sm" w="full">
                {[RED, BLUE].map((color) => (
                  <Button
                    key={color}
                    flex={1}
                    colorScheme={color === RED ? "red" : "blue"}
                    variant={humanColor === color ? "solid" : "outline"}
                    onClick={() => changeSettings({ color: color === RED ? "red" : "blue" })}
                  >
                    {PLAYER_LABELS[color]}
                  </Button>
                ))}
              </ButtonGroup>
              <Text fontSize="xs" textAlign="center">
                Red moves first
              </Text>
              <Text fontWeight="bold" textAlign="center">
                DIFFICULTY
              </Text>
              <ButtonGroup isAttached size="sm" w="full" orientation="vertical">
                {Object.entries(DIFFICULTIES).map(([key, { label }]) => (
                  <Button
                    key={key}
                    flex={1}
                    colorScheme="purple"
                    variant={level === key ? "solid" : "outline"}
                    onClick={() => changeSettings({ level: key })}
                  >
                    {label}
                  </Button>
                ))}
              </ButtonGroup>
            </PanelCard>
          )}
          <PanelCard>
            <Button colorScheme="purple" leftIcon={<FaRedo />} onClick={newGame}>
              New Game
            </Button>
            <Button
              colorScheme="purple"
              variant="outline"
              leftIcon={<FaUndo />}
              onClick={undo}
              isDisabled={!undoStack.length || thinking}
            >
              Undo
            </Button>
          </PanelCard>
        </VStack>
      </GridItem>

      <GameOverModal state={state} isOpen={gameOver.isOpen && state.winner !== null} onClose={gameOver.onClose} title={winnerTitle}>
        <Button colorScheme="purple" size="lg" leftIcon={<FaRedo />} onClick={newGame}>
          Play Again
        </Button>
      </GameOverModal>
      <HowToPlayModal isOpen={rules.isOpen} onClose={rules.onClose} />
    </Grid>
  );
}
