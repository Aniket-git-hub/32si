import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Heading,
  HStack,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { FaArrowRight, FaGlobe, FaRedo, FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GameBoard from "../../components/game/GameBoard";
import { PanelCard, useGameBackground } from "../../components/game/GamePanels";
import { RED, applyAction } from "../../game/engine";
import { LESSONS, lessonState } from "../../game/lessons";
import { markTutorialDone } from "../../game/localRecord";
import useGameSounds from "../../hooks/useGameSounds";

/** Interactive tutorial: short lessons on prepared boards. */
export default function LearnPage() {
  const navigate = useNavigate();
  const bg = useGameBackground();
  const { play } = useGameSounds();
  const [index, setIndex] = useState(0);
  const lesson = LESSONS[index];
  const [state, setState] = useState(() => lessonState(LESSONS[0].position));
  const [attempt, setAttempt] = useState(0);
  const finished = index >= LESSONS.length;

  const result = useMemo(() => (lesson ? lesson.check(state) : null), [lesson, state]);
  const solved = result === true;
  const mistake = typeof result === "string" ? result : null;

  useEffect(() => {
    if (solved) play("win");
    else if (mistake) play("lose");
  }, [solved, mistake, play]);

  useEffect(() => {
    if (finished) markTutorialDone();
  }, [finished]);

  const restart = () => {
    setState(lessonState(lesson.position));
    setAttempt((a) => a + 1);
  };

  const next = () => {
    const nextIndex = index + 1;
    setIndex(nextIndex);
    if (nextIndex < LESSONS.length) setState(lessonState(LESSONS[nextIndex].position));
  };

  const handleAction = (action) => {
    if (solved || mistake) return;
    setState((s) => applyAction(s, action));
    play(action.type === "move" ? "move" : "kill");
  };

  if (finished) {
    return (
      <VStack bg={bg} borderRadius={10} p={{ base: 6, md: 10 }} spacing={5} textAlign="center">
        <Heading size="lg">You&apos;re ready to play! 🎉</Heading>
        <Text maxW="480px">
          Move along the lines, jump to capture, chain your jumps, watch out for danger, and capture every bead (or
          block your opponent) to win.
        </Text>
        <HStack flexWrap="wrap" justify="center">
          <Button colorScheme="purple" leftIcon={<FaRobot />} onClick={() => navigate("/game?mode=ai&level=easy")}>
            Play the computer (easy)
          </Button>
          <Button colorScheme="purple" variant="outline" leftIcon={<FaGlobe />} onClick={() => navigate("/")}>
            Play online
          </Button>
        </HStack>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<FaRedo />}
          onClick={() => {
            setIndex(0);
            setState(lessonState(LESSONS[0].position));
          }}
        >
          Start the tutorial again
        </Button>
      </VStack>
    );
  }

  return (
    <Box bg={bg} borderRadius={10} p={{ base: 3, md: 6 }}>
      <VStack spacing={4} align="stretch" maxW="560px" mx="auto">
        <HStack justify="space-between">
          <Text fontWeight="bold">
            Lesson {index + 1} of {LESSONS.length}
          </Text>
          <Button size="sm" variant="ghost" onClick={() => navigate("/")}>
            Skip tutorial
          </Button>
        </HStack>
        <Progress value={(index / LESSONS.length) * 100} colorScheme="purple" borderRadius="full" size="sm" />
        <PanelCard>
          <Heading size="md">{lesson.title}</Heading>
          <Text>{lesson.text}</Text>
        </PanelCard>

        <Box display="flex" justifyContent="center">
          <GameBoard
            key={`${index}-${attempt}`}
            state={state}
            onAction={handleAction}
            canMove={!solved && !mistake && state.turn === RED}
            flipped
            hints={{ moveHints: true, captureHints: true, confirmMoves: false }}
          />
        </Box>

        {state.chain !== null && !solved && !mistake && (
          <Button colorScheme="purple" variant="outline" onClick={() => handleAction({ type: "endChain" })}>
            End turn
          </Button>
        )}

        {solved && (
          <Alert status="success" borderRadius="md" flexDirection={{ base: "column", sm: "row" }} gap={3}>
            <AlertIcon />
            <AlertDescription flex={1}>{lesson.success}</AlertDescription>
            <Button colorScheme="green" rightIcon={<FaArrowRight />} onClick={next} flexShrink={0}>
              {index + 1 === LESSONS.length ? "Finish" : "Next lesson"}
            </Button>
          </Alert>
        )}
        {mistake && (
          <Alert status="warning" borderRadius="md" flexDirection={{ base: "column", sm: "row" }} gap={3}>
            <AlertIcon />
            <AlertDescription flex={1}>{mistake}</AlertDescription>
            <Button colorScheme="orange" leftIcon={<FaRedo />} onClick={restart} flexShrink={0}>
              Try again
            </Button>
          </Alert>
        )}
      </VStack>
    </Box>
  );
}
