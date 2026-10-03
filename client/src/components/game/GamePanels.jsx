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
import { BLUE, DRAW, DRAW_TURNS, PIECES_PER_PLAYER, RED, capturedBy, describeResult } from "../../game/engine";

export const PLAYER_COLORS = { [RED]: "red.500", [BLUE]: "blue.500", [DRAW]: "gray.500" };
export const PLAYER_LABELS = { [RED]: "RED", [BLUE]: "BLUE" };

export const useGameGradient = () =>
    useColorModeValue(
        "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    );

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
            <HStack justify="space-between" fontSize="xs" color="blackAlpha.700">
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

/** Whose turn it is, plus the "stop capturing" control during a capture chain. */
export const TurnCard = ({ state, label, thinking = false, canEndChain = false, onEndChain }) => (
    <PanelCard>
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
                    p={2}
                    borderRadius="md"
                    fontWeight="bold"
                >
                    {label ?? PLAYER_LABELS[state.turn]}
                </Text>
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
                        After a capture, the same bead may keep jumping and capturing in the same turn. Click the bead
                        again or press <b>End turn</b> to stop.
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
            <ModalFooter>
                <Button colorScheme="purple" onClick={onClose}>
                    Got it
                </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
);
