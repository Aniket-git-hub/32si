import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { FaBackward, FaForward, FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getReplay } from "../../api/game";
import GameBoard from "../../components/game/GameBoard";
import { PanelCard, PLAYER_COLORS, ScoreCard, useGameBackground } from "../../components/game/GamePanels";
import { BLUE, RED, describeResult } from "../../game/engine";
import { getLocalReplay } from "../../game/localRecord";
import { replayStates } from "../../game/replay";
import { useAuth } from "../../hooks/useAuth";

const SPEEDS = [
  { label: "1×", ms: 900 },
  { label: "2×", ms: 450 },
  { label: "4×", ms: 200 },
];

/** Step through a finished online game. */
export default function ReplayPage() {
  // /replay/:gameId is an online game from the server; /replay/local/:localId one saved on this device.
  const { gameId, localId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const bg = useGameBackground();
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(SPEEDS[0]);

  useEffect(() => {
    if (localId) {
      const local = getLocalReplay(localId);
      if (local) setGame({ ...local, ratingChanges: null });
      else setError("This replay isn't on this device any more.");
      return;
    }
    const controller = new AbortController();
    getReplay(gameId, controller.signal)
      .then((res) => setGame(res.data))
      .catch((err) => {
        if (err.code !== "ERR_CANCELED") setError(err.response?.status === 404 ? "This replay isn't available." : "Couldn't load the replay.");
      });
    return () => controller.abort();
  }, [gameId, localId]);

  const states = useMemo(() => (game ? replayStates(game.history) : []), [game]);
  const last = Math.max(0, states.length - 1);
  const state = states[step];

  // The final position also carries how the game ended (resignations and timeouts aren't moves).
  const finalState = useMemo(() => {
    if (!states.length || !game) return null;
    const end = states[last];
    if (end.winner !== null || !game.result) return end;
    const winner = game.result === "red" ? RED : game.result === "blue" ? BLUE : 3;
    return { ...end, winner, reason: game.reason };
  }, [states, last, game]);

  useEffect(() => {
    if (!playing) return;
    if (step >= last) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setStep((s) => Math.min(s + 1, last)), speed.ms);
    return () => clearTimeout(id);
  }, [playing, step, last, speed]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setStep((s) => Math.min(s + 1, last));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0));
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [last]);

  if (error) {
    return (
      <Center py={16} flexDirection="column" gap={4}>
        <Heading size="md">{error}</Heading>
        <Button colorScheme="purple" variant="outline" onClick={() => navigate(localId ? "/game" : "/stats")}>
          Go back
        </Button>
      </Center>
    );
  }
  if (!game || !state) {
    return (
      <Center py={16}>
        <Spinner size="xl" />
      </Center>
    );
  }

  const names = { [RED]: game.red.username, [BLUE]: game.blue.username };
  // Show the player's own colour at the bottom: online by account, offline from the saved game.
  // (Pass & play is shown like the live game: blue at the bottom.)
  const iPlayedBlue = localId ? (game.mode === "ai" ? game.blue.username === "You" : true) : game.blue._id === user?._id;
  const backTo = localId ? (game.mode === "ai" ? "/game?mode=ai" : "/game?mode=local") : "/stats";
  const shown = step === last ? finalState : state;

  return (
    <Grid
      bg={bg}
      borderRadius={10}
      p={{ base: 3, md: 6 }}
      templateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 1fr) 250px" }}
      gap={4}
    >
      <GridItem gridColumn="1 / -1">
        <HStack justify="space-between" flexWrap="wrap">
          <Heading size="md">
            Replay:{" "}
            <Text as="span" color={PLAYER_COLORS[RED]}>
              {names[RED]}
            </Text>{" "}
            vs{" "}
            <Text as="span" color={PLAYER_COLORS[BLUE]}>
              {names[BLUE]}
            </Text>
          </Heading>
          <Button size="sm" variant="outline" colorScheme="purple" onClick={() => navigate(backTo)}>
            {localId ? "Back to the game" : "Back to stats"}
          </Button>
        </HStack>
      </GridItem>

      <GridItem>
        <Box display="flex" justifyContent="center">
          <GameBoard state={state} onAction={() => {}} canMove={false} flipped={!iPlayedBlue} />
        </Box>
        <VStack mt={4} spacing={3}>
          <Slider
            aria-label="Move"
            min={0}
            max={last}
            value={step}
            onChange={(v) => {
              setPlaying(false);
              setStep(v);
            }}
            colorScheme="purple"
            maxW="420px"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <HStack>
            <IconButton aria-label="First move" icon={<FaBackward />} onClick={() => setStep(0)} isDisabled={step === 0} />
            <IconButton aria-label="Previous move" icon={<FaStepBackward />} onClick={() => setStep((s) => Math.max(s - 1, 0))} isDisabled={step === 0} />
            <IconButton
              aria-label={playing ? "Pause" : "Play"}
              icon={playing ? <FaPause /> : <FaPlay />}
              colorScheme="purple"
              onClick={() => {
                if (step >= last) setStep(0);
                setPlaying((p) => !p);
              }}
            />
            <IconButton aria-label="Next move" icon={<FaStepForward />} onClick={() => setStep((s) => Math.min(s + 1, last))} isDisabled={step >= last} />
            <IconButton aria-label="Last move" icon={<FaForward />} onClick={() => setStep(last)} isDisabled={step >= last} />
          </HStack>
          <ButtonGroup size="xs" isAttached variant="outline" colorScheme="purple">
            {SPEEDS.map((s) => (
              <Button key={s.label} variant={speed === s ? "solid" : "outline"} onClick={() => setSpeed(s)}>
                {s.label}
              </Button>
            ))}
          </ButtonGroup>
          <Text fontSize="sm">
            Move {step} of {last} · use ← → and space
          </Text>
        </VStack>
      </GridItem>

      <GridItem>
        <VStack spacing={4}>
          <Box w="full">
            <ScoreCard state={state} names={names} />
          </Box>
          <PanelCard>
            <Text fontWeight="bold" textAlign="center">
              RESULT
            </Text>
            <Text textAlign="center">{finalState ? describeResult(finalState) : ""}</Text>
            {game.ratingChanges && (
              <HStack justify="center" spacing={3}>
                {[RED, BLUE].map((p) => {
                  const change = game.ratingChanges[p === RED ? "red" : "blue"];
                  return (
                    <Badge key={p} colorScheme={change >= 0 ? "green" : "red"}>
                      {names[p]} {change >= 0 ? "+" : ""}
                      {change}
                    </Badge>
                  );
                })}
              </HStack>
            )}
          </PanelCard>
          {shown?.winner !== null && step === last && (
            <Text fontSize="sm" textAlign="center">
              End of game
            </Text>
          )}
        </VStack>
      </GridItem>
    </Grid>
  );
}
