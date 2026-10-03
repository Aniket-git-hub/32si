import {
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    Heading,
    HStack,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    UnorderedList,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaTrophy, FaUser } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { BLUE, DRAW, DRAW_TURNS, PIECES_PER_PLAYER, RED, capturedBy, describeResult, movesForPlayer } from "../../game/engine";

export const PLAYER_COLORS = { [RED]: "player.red", [BLUE]: "player.blue", [DRAW]: "player.draw" };
export const PLAYER_LABELS = { [RED]: "RED", [BLUE]: "BLUE" };

export const useGameGradient = () =>
    useColorModeValue(
        "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "linear-gradient(135deg, #2b2870 0%, #3a2f74 100%)"
    );

/** Background of the whole game screen. */
export const useGameBackground = () =>
    useColorModeValue("linear-gradient(to right, #f6d365, #fda085)", "linear-gradient(135deg, #14122f 0%, #221a45 100%)");

export const PanelCard = ({ children, ...rest }) => {
    const bg = useGameGradient();
    return (
        <Card as={motion.div} w="100%" boxShadow="xl" background={bg} borderRadius="xl" {...rest}>
            <CardBody>
                <VStack spacing={3} align="stretch">
                    {children}
                </VStack>
            </CardBody>
        </Card>
    );
};

const PanelHeading = ({ icon, children }) => (
    <Heading size="sm" display="flex" alignItems="center" justifyContent="center" gap={2} textTransform="uppercase">
        {icon}
        {children}
    </Heading>
);

const PlayerRow = ({ player, state, name, isTurn, extra }) => {
    const left = PIECES_PER_PLAYER - capturedBy(state, player === RED ? BLUE : RED);
    return (
        <Box
            borderWidth={3}
            borderColor={PLAYER_COLORS[player]}
            bg={isTurn ? "whiteAlpha.600" : "whiteAlpha.300"}
            _dark={{ bg: isTurn ? "whiteAlpha.200" : "whiteAlpha.50" }}
            borderRadius="md"
            px={3}
            py={2}
        >
            <HStack justify="space-between">
                <Text fontWeight="bold" color={PLAYER_COLORS[player]} noOfLines={1}>
                    {name ?? PLAYER_LABELS[player]}
                </Text>
                <Text fontWeight="bold" color={PLAYER_COLORS[player]}>
                    {left}
                </Text>
            </HStack>
            <HStack justify="space-between" fontSize="xs" color="blackAlpha.700" _dark={{ color: "whiteAlpha.700" }}>
                <Text>{PLAYER_LABELS[player]} · captured {capturedBy(state, player)}</Text>
                {extra}
            </HStack>
        </Box>
    );
};

/** Beads left for each side. `names` / `extras` are optional per-colour labels. */
export const ScoreCard = ({ state, names = {}, extras = {} }) => (
    <PanelCard>
        <PanelHeading icon={<FaTrophy />}>Beads left</PanelHeading>
        {[RED, BLUE].map((player) => (
            <PlayerRow
                key={player}
                player={player}
                state={state}
                name={names[player]}
                extra={extras[player]}
                isTurn={state.winner === null && state.turn === player}
            />
        ))}
    </PanelCard>
);

/** "You can capture" hint for the player to move (pass the captureHints setting as `enabled`). */
export const captureHint = (state, isMyTurn, enabled) => {
    if (!enabled || !isMyTurn || state.winner !== null || state.chain !== null) return null;
    return movesForPlayer(state.board, state.turn).some((m) => m.over !== null) ? "You can capture a bead!" : null;
};

const CLOCK_WARNING = 15;

/** Seconds left for the current turn; turns red and pulses in the last 15 seconds. */
export const TurnClock = ({ seconds, ...rest }) => {
    if (seconds === null || seconds === undefined) return null;
    const urgent = seconds <= CLOCK_WARNING;
    return (
        <Text
            as={motion.span}
            animate={urgent ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={urgent ? { repeat: Infinity, duration: 1 } : undefined}
            display="inline-block"
            fontWeight="bold"
            fontVariantNumeric="tabular-nums"
            color={urgent ? "red.600" : undefined}
            aria-label={`${seconds} seconds left for this turn`}
            {...rest}
        >
            ⏱ {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
        </Text>
    );
};

/** Whose turn it is, plus the "stop capturing" control during a capture chain. */
const HintBadge = ({ children }) => (
    <Badge colorScheme="yellow" variant="solid" textAlign="center" whiteSpace="normal" py={1} borderRadius="md">
        {children}
    </Badge>
);

export const TurnCard = ({ state, label, thinking = false, canEndChain = false, onEndChain, clock = null, hint = null, ...rest }) => (
    <PanelCard {...rest}>
        <PanelHeading icon={<FaUser />}>Turn</PanelHeading>
        {state.winner !== null ? (
            <Text textAlign="center" fontWeight="bold">
                Game over
            </Text>
        ) : (
            <>
                <Text
                    textAlign="center"
                    color={PLAYER_COLORS[state.turn]}
                    borderWidth={3}
                    borderColor={PLAYER_COLORS[state.turn]}
                    bg="whiteAlpha.500"
                    _dark={{ bg: "whiteAlpha.100" }}
                    p={2}
                    borderRadius="md"
                    fontWeight="bold"
                >
                    {label ?? PLAYER_LABELS[state.turn]}
                </Text>
                {clock !== null && <TurnClock seconds={clock} textAlign="center" fontSize="lg" />}
                {hint && <HintBadge>{hint}</HintBadge>}
                {thinking && (
                    <HStack justify="center">
                        <Spinner size="sm" />
                        <Text fontSize="sm">Thinking…</Text>
                    </HStack>
                )}
                {state.chain !== null && canEndChain && (
                    <>
                        <Text fontSize="sm" textAlign="center">
                            You can keep capturing with the same bead, or stop here.
                        </Text>
                        <Button size="sm" colorScheme="purple" onClick={onEndChain}>
                            End turn
                        </Button>
                    </>
                )}
                {state.quietTurns >= DRAW_TURNS - 10 && (
                    <Badge colorScheme="orange" textAlign="center" whiteSpace="normal">
                        Draw in {DRAW_TURNS - state.quietTurns} turns without a capture
                    </Badge>
                )}
            </>
        )}
    </PanelCard>
);

/** One-line status for phones: beads left on each side, whose turn it is, and the stop-capturing button. */
export const CompactStatus = ({ state, names = {}, label, thinking = false, canEndChain = false, onEndChain, clock = null, hint = null, ...rest }) => {
    const bg = useColorModeValue("whiteAlpha.700", "blackAlpha.300");
    const side = (player) => (
        <VStack spacing={0} minW="72px">
            <Text fontSize="xs" fontWeight="bold" color={PLAYER_COLORS[player]} noOfLines={1} maxW="96px">
                {names[player] ?? PLAYER_LABELS[player]}
            </Text>
            <Text fontSize="xl" fontWeight="extrabold" color={PLAYER_COLORS[player]} lineHeight={1}>
                {PIECES_PER_PLAYER - capturedBy(state, player === RED ? BLUE : RED)}
            </Text>
        </VStack>
    );
    return (
        <VStack spacing={2} w="full" {...rest}>
            <HStack w="full" justify="space-between" bg={bg} borderRadius="lg" px={3} py={2}>
                {side(RED)}
                <VStack spacing={0} flex={1}>
                    {state.winner !== null ? (
                        <Text fontWeight="bold">Game over</Text>
                    ) : (
                        <>
                            <HStack spacing={1}>
                                {thinking && <Spinner size="xs" />}
                                <Text fontWeight="bold" color={PLAYER_COLORS[state.turn]} textAlign="center" noOfLines={1}>
                                    {thinking ? "Thinking…" : (label ?? PLAYER_LABELS[state.turn])}
                                </Text>
                            </HStack>
                            {clock !== null ? (
                                <TurnClock seconds={clock} fontSize="sm" />
                            ) : (
                                <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.300" }}>
                                    to move
                                </Text>
                            )}
                        </>
                    )}
                </VStack>
                {side(BLUE)}
            </HStack>
            {hint && <HintBadge>{hint}</HintBadge>}
            {state.chain !== null && canEndChain && state.winner === null && (
                <Button size="sm" colorScheme="purple" w="full" onClick={onEndChain}>
                    Stop capturing &amp; end turn
                </Button>
            )}
        </VStack>
    );
};

export const GameOverModal = ({ state, isOpen, onClose, title, children }) => {
    const bg = useGameGradient();
    const color = state.winner !== null ? PLAYER_COLORS[state.winner] : undefined;
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="scale">
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(6px)" />
            <ModalContent bg={bg} borderRadius="2xl" boxShadow="2xl">
                <ModalHeader textAlign="center" fontSize="2xl" fontWeight="extrabold">
                    GAME OVER
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} pb={4}>
                        <Text
                            as={motion.p}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            fontSize="3xl"
                            fontWeight="bold"
                            color={color}
                            textAlign="center"
                        >
                            {title}
                        </Text>
                        <Text textAlign="center">{describeResult(state)}</Text>
                        {children}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export const HowToPlayModal = ({ isOpen, onClose }) => (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>How to play 32 Beads</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <UnorderedList spacing={2}>
                    <ListItem>Each player has 16 beads. RED starts at the top and moves first.</ListItem>
                    <ListItem>
                        On your turn, move one bead along a line to a neighbouring empty point. Click a bead to see
                        where it can go (green dots), then click the destination.
                    </ListItem>
                    <ListItem>
                        <b>Capture</b> by jumping over an enemy bead that is right next to yours, in a straight line,
                        onto the empty point behind it (yellow dots). The jumped bead is removed.
                    </ListItem>
                    <ListItem>
                        After a capture, the same bead may keep jumping and capturing in the same turn. Press{" "}
                        <b>End turn</b> to stop early.
                    </ListItem>
                    <ListItem>Capturing is optional.</ListItem>
                    <ListItem>
                        <b>You win</b> by capturing all of your opponent&apos;s beads, or by leaving them with no legal
                        move.
                    </ListItem>
                    <ListItem>
                        After {DRAW_TURNS} turns in a row without any capture, the game is a draw.
                    </ListItem>
                </UnorderedList>
            </ModalBody>
            <ModalFooter gap={2}>
                <Button as={RouterLink} to="/learn" variant="outline" colorScheme="purple" onClick={onClose}>
                    Interactive tutorial
                </Button>
                <Button colorScheme="purple" onClick={onClose}>
                    Got it
                </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
);
