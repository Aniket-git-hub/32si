import {
    Avatar,
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    Heading,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Stat,
    StatLabel,
    StatNumber,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
    VStack
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
    FaGamepad,
    FaHistory,
    FaPlus,
    FaRandom,
    FaRobot,
    FaTrophy,
    FaUserFriends,
    FaUsers
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { GiCrossedSwords } from 'react-icons/gi';
import { useAllData } from '../../hooks/useAllData';
import { useAuth } from '../../hooks/useAuth';
import useChallenge from '../../hooks/useChallenge';
import useSocket from '../../hooks/useSocket';
import { getGameOverview, getGameStats } from '../../api/game';
import { getSmallProfilePicture } from '../../api/user';
import { isTutorialDone } from '../../game/localRecord';

// Accepts a bare code or a pasted invite link (…/game/online/ABC123).
const parseGameCode = (input) => input.trim().split('/').filter(Boolean).pop()?.toUpperCase() ?? '';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const HomePage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { socket } = useSocket();
    const { user } = useAuth();
    const { onlineFriends } = useAllData();
    const { challenge, pendingId } = useChallenge();
    const friendsOnline = (user?.friends ?? []).filter((f) => onlineFriends?.includes(f._id));
    const [gameCode, setGameCode] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [showTutorialBanner, setShowTutorialBanner] = useState(() => !isTutorialDone());

    // Modal controls
    const createGameModal = useDisclosure();
    const joinGameModal = useDisclosure();
    const challengeRivalsModal = useDisclosure();
    const randomMatchModal = useDisclosure();

    // Background and color schemes
    const bgGradient = useColorModeValue(
        'linear(to-r, #f6d365, #fda085)',
        'linear(to-r, #667eea, #764ba2)'
    );
    const statsBg = useColorModeValue('whiteAlpha.900', 'whiteAlpha.200');
    const cardBg = useColorModeValue('white', 'gray.700');

    // Live site numbers, refreshed every 30 seconds.
    const [stats, setStats] = useState(null);
    useEffect(() => {
        let controller;
        const load = () => {
            controller?.abort();
            controller = new AbortController();
            getGameOverview(controller.signal)
                .then((res) => setStats(res.data))
                .catch(() => {});
        };
        load();
        const id = setInterval(load, 30_000);
        return () => {
            clearInterval(id);
            controller?.abort();
        };
    }, []);

    // People you played online most recently.
    const [recentPlayers, setRecentPlayers] = useState([]);
    useEffect(() => {
        const controller = new AbortController();
        getGameStats({ limit: 30 }, controller.signal)
            .then((res) => {
                const seen = new Map();
                for (const row of res.data.history) {
                    const o = row.opponent;
                    if (o?.username && o.username !== 'Deleted player' && !seen.has(o._id)) seen.set(o._id, o);
                }
                setRecentPlayers([...seen.values()].slice(0, 8));
            })
            .catch(() => {});
        return () => controller.abort();
    }, []);

    const showError = (title) => toast({ title, status: 'error', duration: 3000, isClosable: true, position: 'top' });

    // Online games are created on the server; the creator plays RED and shares the code.
    const handleCreateGame = () => {
        if (!socket?.connected) return showError('Not connected to the server yet. Try again in a moment.');
        setIsCreating(true);
        socket.emit('game:create', {}, (res) => {
            setIsCreating(false);
            if (!res?.ok) return showError(res?.error ?? 'Could not create the game.');
            createGameModal.onClose();
            navigate(`/game/online/${res.code}`);
        });
    };

    const handleJoinGame = () => {
        const code = parseGameCode(gameCode);
        if (!code) return;
        joinGameModal.onClose();
        navigate(`/game/online/${code}`);
    };

    // Random match: the server pairs us with the next player who is also looking.
    useEffect(() => {
        if (!socket) return;
        const onMatched = ({ code }) => {
            setIsSearching(false);
            randomMatchModal.onClose();
            navigate(`/game/online/${code}`);
        };
        socket.on('game:matched', onMatched);
        return () => socket.off('game:matched', onMatched);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, navigate]);

    const handleRandomMatch = () => {
        if (!socket?.connected) return showError('Not connected to the server yet. Try again in a moment.');
        setIsSearching(true);
        socket.emit('game:quickMatch', {}, (res) => {
            if (!res?.ok) {
                setIsSearching(false);
                showError(res?.error ?? 'Matchmaking failed.');
            }
            // When matched, the 'game:matched' event navigates to the game.
        });
    };

    const closeRandomMatch = () => {
        if (isSearching) socket?.emit('game:cancelQuickMatch', {});
        setIsSearching(false);
        randomMatchModal.onClose();
    };

    // Button with enhanced animations
    const GameButton = ({
        icon,
        children,
        onClick,
        colorScheme = 'purple'
    }) => (
        <Button
            as={motion.button}
            leftIcon={icon}
            size="lg"
            colorScheme={colorScheme}
            w="full"
            variant="solid"
            boxShadow="xl"
            whileHover={{
                scale: 1.05,
                boxShadow: "0px 5px 20px rgba(0,0,0,0.2)",
                transition: {
                    duration: 0.2,
                    type: "spring",
                    stiffness: 400
                }
            }}
            whileTap={{
                scale: 0.95,
                rotate: [-2, 0, 2, 0],
                transition: { duration: 0.2 }
            }}
            onClick={onClick}
        >
            {children}
        </Button>
    );

    return (
        <Container maxW="container.xl" py={{ base: 4, md: 10 }} px={{ base: 1, md: 4 }}>
            <MotionFlex
                direction="column"
                align="center"
                justify="center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Stats Section */}
                <Grid
                    templateColumns="repeat(3, 1fr)"
                    gap={{ base: 2, md: 6 }}
                    w="full"
                    mb={{ base: 5, md: 10 }}
                >
                    <MotionBox
                        p={{ base: 3, md: 6 }}
                        bg={statsBg}
                        borderRadius="xl"
                        boxShadow="xl"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Stat>
                            <StatLabel fontSize={{ base: "xs", md: "sm" }}>Total Games</StatLabel>
                            <StatNumber>{stats ? stats.totalGames : '–'}</StatNumber>
                        </Stat>
                    </MotionBox>
                    <MotionBox
                        p={{ base: 3, md: 6 }}
                        bg={statsBg}
                        borderRadius="xl"
                        boxShadow="xl"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Stat>
                            <StatLabel fontSize={{ base: "xs", md: "sm" }}>Online Players</StatLabel>
                            <StatNumber>{stats ? stats.onlinePlayers : '–'}</StatNumber>
                        </Stat>
                    </MotionBox>
                    <MotionBox
                        p={{ base: 3, md: 6 }}
                        bg={statsBg}
                        borderRadius="xl"
                        boxShadow="xl"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Stat>
                            <StatLabel fontSize={{ base: "xs", md: "sm" }}>Active Games</StatLabel>
                            <StatNumber>{stats ? stats.activeGames : '–'}</StatNumber>
                        </Stat>
                    </MotionBox>
                </Grid>

                {showTutorialBanner && (
                    <Flex
                        w="full"
                        maxW="600px"
                        mb={5}
                        p={4}
                        gap={3}
                        align="center"
                        borderRadius="xl"
                        bg="purple.600"
                        color="white"
                        boxShadow="lg"
                        direction={{ base: 'column', sm: 'row' }}
                    >
                        <Box flex={1}>
                            <Text fontWeight="bold">New to 32 Beads?</Text>
                            <Text fontSize="sm">Learn the rules in five quick, hands-on lessons.</Text>
                        </Box>
                        <HStack>
                            <Button colorScheme="whiteAlpha" variant="ghost" color="white" onClick={() => setShowTutorialBanner(false)}>
                                Not now
                            </Button>
                            <Button bg="white" color="purple.700" _hover={{ bg: 'purple.50' }} onClick={() => navigate('/learn')}>
                                Start tutorial
                            </Button>
                        </HStack>
                    </Flex>
                )}

                {/* Main Game Options */}
                <MotionBox
                    p={{ base: 5, md: 10 }}
                    bg={cardBg}
                    borderRadius="2xl"
                    boxShadow="2xl"
                    w="full"
                    maxW="600px"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <VStack spacing={8}>
                        <Heading
                            size={{ base: "xl", md: "2xl" }}
                            textAlign="center"
                            bgGradient={bgGradient}
                            bgClip="text"
                            as={motion.h1}
                            whileHover={{ scale: 1.05 }}
                        >
                            Battle Arena
                        </Heading>

                        <VStack spacing={4} w="full">
                            <GameButton
                                icon={<FaRobot />}
                                onClick={() => navigate('/game?mode=ai')}
                            >
                                Play vs Computer
                            </GameButton>

                            <GameButton
                                icon={<FaUsers />}
                                onClick={() => navigate('/game?mode=local')}
                            >
                                Pass &amp; Play
                            </GameButton>

                            <GameButton
                                icon={<FaPlus />}
                                onClick={createGameModal.onOpen}
                            >
                                Create Online Game
                            </GameButton>

                            <GameButton
                                icon={<FaGamepad />}
                                onClick={joinGameModal.onOpen}
                            >
                                Join Online Game
                            </GameButton>

                            <GameButton
                                icon={<FaTrophy />}
                                onClick={challengeRivalsModal.onOpen}
                            >
                                Challenge Rivals
                            </GameButton>

                            <GameButton
                                icon={<FaRandom />}
                                colorScheme="green"
                                onClick={randomMatchModal.onOpen}
                            >
                                Random Match
                            </GameButton>
                        </VStack>
                    </VStack>
                </MotionBox>

                {/* Recent Players */}
                <MotionBox
                    mt={10}
                    p={6}
                    bg={cardBg}
                    borderRadius="xl"
                    boxShadow="xl"
                    w="full"
                    maxW="600px"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Heading size="md" mb={4}>
                        <HStack>
                            <FaHistory />
                            <Text>Recent Players</Text>
                        </HStack>
                    </Heading>
                    {recentPlayers.length === 0 ? (
                        <Text color="gray.500" fontSize="sm">
                            Players you meet online will show up here, ready for a rematch.
                        </Text>
                    ) : (
                        <HStack spacing={4} overflowX="auto" py={2}>
                            {recentPlayers.map((player) => (
                                <MotionBox
                                    key={player._id}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    cursor="pointer"
                                    onClick={() => navigate(`/profile/@${player.username}`)}
                                >
                                    <VStack>
                                        <Avatar
                                            name={player.username}
                                            src={player.profilePhoto ? getSmallProfilePicture(player.profilePhoto) : undefined}
                                        />
                                        <Text fontSize="sm">{player.username}</Text>
                                    </VStack>
                                </MotionBox>
                            ))}
                        </HStack>
                    )}
                </MotionBox>
            </MotionFlex>

            {/* Modals (Chakra animates them itself) */}
            <>
                {/* Create Game Modal */}
                <Modal
                    isOpen={createGameModal.isOpen}
                    onClose={createGameModal.onClose}
                    isCentered
                >
                    <ModalOverlay />
                    <ModalContent
                        as={motion.div}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <ModalHeader>Create New Game</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={4} pb={6}>
                                <Text>
                                    You&apos;ll get a 6-letter code to share with a friend. You play RED and move first.
                                </Text>
                                <Button
                                    colorScheme="purple"
                                    onClick={handleCreateGame}
                                    isLoading={isCreating}
                                    w="full"
                                >
                                    Create Game
                                </Button>
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>

                {/* Join Game Modal */}
                <Modal
                    isOpen={joinGameModal.isOpen}
                    onClose={joinGameModal.onClose}
                    isCentered
                >
                    <ModalOverlay />
                    <ModalContent
                        as={motion.div}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <ModalHeader>Join Game</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={4} pb={6}>
                                <FormControl>
                                    <FormLabel>Game Code</FormLabel>
                                    <Input
                                        placeholder="e.g. K7QM2X, or paste the invite link"
                                        value={gameCode}
                                        onChange={(e) => setGameCode(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleJoinGame()}
                                        textTransform="uppercase"
                                    />
                                </FormControl>
                                <Button
                                    colorScheme="purple"
                                    onClick={handleJoinGame}
                                    isDisabled={!gameCode}
                                    w="full"
                                >
                                    Join Game
                                </Button>
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>

                {/* Challenge Rivals Modal */}
                <Modal
                    isOpen={challengeRivalsModal.isOpen}
                    onClose={challengeRivalsModal.onClose}
                    isCentered
                >
                    <ModalOverlay />
                    <ModalContent
                        as={motion.div}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <ModalHeader>Challenge Rivals</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <VStack spacing={3} align="stretch">
                                {friendsOnline.length === 0 ? (
                                    <VStack spacing={3} py={4}>
                                        <FaUserFriends size="40px" />
                                        <Text textAlign="center">None of your allies are online right now.</Text>
                                        <Button
                                            colorScheme="purple"
                                            variant="outline"
                                            onClick={() => {
                                                challengeRivalsModal.onClose();
                                                navigate('/rivals');
                                            }}
                                        >
                                            Find rivals to challenge
                                        </Button>
                                    </VStack>
                                ) : (
                                    <>
                                        <Text fontSize="sm" color="gray.500">
                                            Allies online now
                                        </Text>
                                        {friendsOnline.map((friend) => (
                                            <HStack key={friend._id} justify="space-between">
                                                <HStack>
                                                    <Avatar size="sm" name={friend.name ?? friend.username} />
                                                    <Text fontWeight="medium">{friend.username}</Text>
                                                </HStack>
                                                <Button
                                                    size="sm"
                                                    colorScheme="purple"
                                                    leftIcon={<GiCrossedSwords />}
                                                    isLoading={pendingId === friend._id}
                                                    onClick={() => challenge(friend._id)}
                                                >
                                                    Challenge
                                                </Button>
                                            </HStack>
                                        ))}
                                    </>
                                )}
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>

                {/* Random Match Modal */}
                <Modal
                    isOpen={randomMatchModal.isOpen}
                    onClose={closeRandomMatch}
                    isCentered
                >
                    <ModalOverlay />
                    <ModalContent
                        as={motion.div}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <ModalHeader>Random Match</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={6} pb={6}>
                                {isSearching ? (
                                    <>
                                        <Spinner size="xl" color="purple.500" />
                                        <Text>Finding an opponent...</Text>
                                        <Button variant="ghost" onClick={closeRandomMatch}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Text>Ready to find a random opponent?</Text>
                                        <Button
                                            colorScheme="purple"
                                            onClick={handleRandomMatch}
                                            w="full"
                                        >
                                            Start Matchmaking
                                        </Button>
                                    </>
                                )}
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </>
        </Container>
    );
};

export default HomePage;