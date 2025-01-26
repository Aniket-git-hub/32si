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
    VStack
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import {
    FaGamepad,
    FaHistory,
    FaPlus,
    FaRandom,
    FaTrophy,
    FaUserFriends
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const HomePage = () => {
    const navigate = useNavigate();
    const [gameCode, setGameCode] = useState('');
    const [username, setUsername] = useState('');
    const [isSearching, setIsSearching] = useState(false);

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

    // Mock statistics data
    const stats = {
        totalGames: 156,
        onlinePlayers: 24,
        activeGames: 8
    };

    // Mock recent players
    const recentPlayers = [
        { id: 1, name: 'Player 1', avatar: '' },
        { id: 2, name: 'Player 2', avatar: '' },
        { id: 3, name: 'Player 3', avatar: '' }
    ];

    // Game Creation Handler
    const handleCreateGame = () => {
        // Implement game creation logic
        createGameModal.onClose();
        navigate('/game');
    };

    // Join Game Handler
    const handleJoinGame = () => {
        // Implement game joining logic
        joinGameModal.onClose();
        navigate('/game');
    };

    // Random Match Handler
    const handleRandomMatch = () => {
        setIsSearching(true);
        // Simulate searching for opponent
        setTimeout(() => {
            setIsSearching(false);
            randomMatchModal.onClose();
            navigate('/game');
        }, 2000);
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
        <Container maxW="container.xl" h="100vh" py={10}>
            <MotionFlex
                direction="column"
                align="center"
                justify="center"
                h="full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Stats Section */}
                <Grid
                    templateColumns="repeat(3, 1fr)"
                    gap={6}
                    w="full"
                    mb={10}
                >
                    <MotionBox
                        p={6}
                        bg={statsBg}
                        borderRadius="xl"
                        boxShadow="xl"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Stat>
                            <StatLabel>Total Games</StatLabel>
                            <StatNumber>{stats.totalGames}</StatNumber>
                        </Stat>
                    </MotionBox>
                    <MotionBox
                        p={6}
                        bg={statsBg}
                        borderRadius="xl"
                        boxShadow="xl"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Stat>
                            <StatLabel>Online Players</StatLabel>
                            <StatNumber>{stats.onlinePlayers}</StatNumber>
                        </Stat>
                    </MotionBox>
                    <MotionBox
                        p={6}
                        bg={statsBg}
                        borderRadius="xl"
                        boxShadow="xl"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Stat>
                            <StatLabel>Active Games</StatLabel>
                            <StatNumber>{stats.activeGames}</StatNumber>
                        </Stat>
                    </MotionBox>
                </Grid>

                {/* Main Game Options */}
                <MotionBox
                    p={10}
                    bg="whiteAlpha.900"
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
                            size="2xl"
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
                                icon={<FaPlus />}
                                onClick={createGameModal.onOpen}
                            >
                                Create Game
                            </GameButton>

                            <GameButton
                                icon={<FaGamepad />}
                                onClick={joinGameModal.onOpen}
                            >
                                Join Game
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
                    bg="whiteAlpha.900"
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
                    <HStack spacing={4} overflowX="auto" py={2}>
                        {recentPlayers.map((player) => (
                            <MotionBox
                                key={player.id}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <VStack>
                                    <Avatar name={player.name} src={player.avatar} />
                                    <Text fontSize="sm">{player.name}</Text>
                                </VStack>
                            </MotionBox>
                        ))}
                    </HStack>
                </MotionBox>
            </MotionFlex>

            {/* Enhanced Modals */}
            <AnimatePresence>
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
                                <FormControl>
                                    <FormLabel>Username</FormLabel>
                                    <Input
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </FormControl>
                                <Button
                                    colorScheme="purple"
                                    onClick={handleCreateGame}
                                    isDisabled={!username}
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
                                        placeholder="Enter game code"
                                        value={gameCode}
                                        onChange={(e) => setGameCode(e.target.value)}
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
                            <VStack spacing={4} align="center">
                                <FaUserFriends size="48px" />
                                <Text>Rival challenge system coming soon!</Text>
                                <Text fontSize="sm" color="gray.500">
                                    Challenge your friends and track your rivalry stats
                                </Text>
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>

                {/* Random Match Modal */}
                <Modal
                    isOpen={randomMatchModal.isOpen}
                    onClose={randomMatchModal.onClose}
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
            </AnimatePresence>
        </Container>
    );
};

export default HomePage;