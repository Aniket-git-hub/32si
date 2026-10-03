import { Box, Button, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FaLightbulb } from "react-icons/fa";
import { capturingBeads, endangeredBeads } from "../../game/hints";

const SEEN_KEY = "32beads.coachSeen";
const OFF_KEY = "32beads.coachOff";

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

// Highest priority first. Each tip is shown once, the first time its situation comes up.
const TIPS = [
  {
    id: "chain",
    when: ({ state }) => state.chain !== null,
    text: "Nice capture! If a gold dot is still showing you can jump again with the same bead, or press End turn to stop.",
  },
  {
    id: "capture",
    when: ({ state }) => state.chain === null && capturingBeads(state).size > 0,
    text: "A bead with a gold ring can capture! Tap it, then tap the gold dot behind the enemy bead.",
  },
  {
    id: "danger",
    when: ({ state }) => state.chain === null && endangeredBeads(state).size > 0,
    text: "A red dashed ring means that bead can be captured next turn. Move it away, or cover the point behind it.",
  },
  {
    id: "first-move",
    when: ({ state }) => state.moveNumber < 2,
    text: "Your beads with a ring can move. Tap one, then tap a green dot to move it along a line.",
  },
  {
    id: "quiet",
    when: ({ state }) => state.quietTurns >= 30,
    text: "No captures for a while. After 50 turns in a row without one, the game is a draw.",
  },
];

/** Context-sensitive tips for a player's first offline games. Shown only on the player's own turn. */
export default function Coach({ state, myTurn }) {
  const [seen, setSeen] = useState(() => read(SEEN_KEY, []));
  const [off, setOff] = useState(() => read(OFF_KEY, false));
  const bg = useColorModeValue("white", "gray.800");

  const tip = useMemo(() => {
    if (off || !myTurn || state.winner !== null) return null;
    return TIPS.find((t) => !seen.includes(t.id) && t.when({ state })) ?? null;
  }, [off, myTurn, state, seen]);

  const dismiss = () => {
    const next = [...seen, tip.id];
    setSeen(next);
    write(SEEN_KEY, next);
  };
  const turnOff = () => {
    setOff(true);
    write(OFF_KEY, true);
  };

  return (
    <AnimatePresence mode="wait">
      {tip && (
        <Box
          as={motion.div}
          key={tip.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.2, ease: [0.3, 0, 1, 1] } }}
          bg={bg}
          borderRadius="lg"
          boxShadow="md"
          borderLeftWidth="4px"
          borderLeftColor="yellow.400"
          p={3}
          mb={3}
          role="status"
        >
          <HStack align="flex-start" spacing={3}>
            <Box color="yellow.500" pt="2px">
              <FaLightbulb />
            </Box>
            <Box flex={1}>
              <Text fontSize="sm">{tip.text}</Text>
              <HStack justify="flex-end" mt={2} spacing={1}>
                <Button size="xs" variant="ghost" onClick={turnOff}>
                  Hide tips
                </Button>
                <Button size="xs" colorScheme="purple" onClick={dismiss}>
                  Got it
                </Button>
              </HStack>
            </Box>
          </HStack>
        </Box>
      )}
    </AnimatePresence>
  );
}
