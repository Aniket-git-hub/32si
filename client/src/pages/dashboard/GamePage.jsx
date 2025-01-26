import {
  Box,
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from 'react';
import {
  FaChessBoard,
  FaRedo,
  FaRobot,
  FaTrophy,
  FaUser
} from "react-icons/fa";
import { MdMusicNote, MdMusicOff } from "react-icons/md";
import GameBoard from "../../components/game/GameBoard";
import { useAuth } from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";

// Sound Effects
import backgroundMusic from '../../assets/sounds/background.mp3';
import killSound from '../../assets/sounds/kill.wav';
import loseSound from '../../assets/sounds/lose.wav';
import moveSound from '../../assets/sounds/move.wav';
import newGameSound from '../../assets/sounds/newGame.wav';
import winSound from '../../assets/sounds/win.wav';

export default function GamePage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [playerOneScore, setPlayerOneScore] = useState(16);
  const [playerTwoScore, setPlayerTwoScore] = useState(16);
  const [playerTurn, setPlayerTurn] = useState("RED");
  const [winner, setWinner] = useState(null);
  const [previousGames, setPreviousGames] = useState([
    { playerOne: 12, playerTwo: 0, winner: "BLUE" },
    { playerOne: 7, playerTwo: 0, winner: "BLUE" },
    { playerOne: 2, playerTwo: 0, winner: "RED" },
  ]);
  const [gameVersion, setGameVersion] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Audio Refs
  const moveAudioRef = useRef(new Audio(moveSound));
  const winAudioRef = useRef(new Audio(winSound));
  const backgroundMusicRef = useRef(new Audio(backgroundMusic));
  const killAudioRef = useRef(new Audio(killSound));
  const newGameAudioRef = useRef(new Audio(newGameSound));
  const loseAudioRef = useRef(new Audio(loseSound));

  // Color scheme with gradient backgrounds
  const cardBg = useColorModeValue(
    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  );
  const PLAYER_COLORS = {
    RED: "red.500",
    BLUE: "blue.500"
  };

  // Music Toggle
  const toggleMusic = () => {
    if (isMusicPlaying) {
      backgroundMusicRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = 0.02;
      backgroundMusicRef.current.play();
      setIsMusicPlaying(true);
    }
  };

  useEffect(() => {
    if (playerOneScore <= 0) {
      setWinner("BLUE");
      updatePreviousGames("BLUE");
      winAudioRef.current.play();
    } else if (playerTwoScore <= 0) {
      setWinner("RED");
      updatePreviousGames("RED");
      winAudioRef.current.play();
    }
  }, [playerOneScore, playerTwoScore]);

  const updatePreviousGames = (winner) => {
    setPreviousGames(prev => [
      {
        playerOne: 16 - playerOneScore,
        playerTwo: 16 - playerTwoScore,
        winner
      },
      ...prev.slice(0, 2)
    ]);
  };

  const newGameHandler = () => {
    setPlayerOneScore(16);
    setPlayerTwoScore(16);
    setPlayerTurn("RED");
    setWinner(null);
    setGameVersion(prev => prev + 1);
    newGameAudioRef.current.play();
  };

  const AIHandler = () => {
    onOpen();
  };

  const handleTurnChange = (newTurn) => {
    setPlayerTurn(newTurn);
    moveAudioRef.current.play();
  };

  const handleScoreChange = (scoreDelta) => {
    setPlayerOneScore(prev => Math.max(0, prev + (scoreDelta.red || 0)));
    setPlayerTwoScore(prev => Math.max(0, prev + (scoreDelta.blue || 0)));
    if (scoreDelta.red || scoreDelta.blue) {
      killAudioRef.current.play();
    }
  };

  // Variants for Framer Motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  return (
    <Grid
      as={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      bg={useColorModeValue(
        "linear-gradient(to right, #f6d365, #fda085)",
        "linear-gradient(to right, #667eea, #764ba2)"
      )}
      borderRadius={10}
      p={6}
      templateColumns="repeat(10, 1fr)"
      gap={4}
    >
      {/* Music Toggle Button */}
      <GridItem colSpan={10} display="flex" justifyContent="flex-end">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={toggleMusic}
            colorScheme="purple"
            leftIcon={isMusicPlaying ? <MdMusicNote /> : <MdMusicOff />}
          >
            {isMusicPlaying ? 'Pause Music' : 'Play Music'}
          </Button>
        </motion.div>
      </GridItem>

      {/* Left Sidebar */}
      <GridItem colSpan={2}>
        <VStack spacing={4}>
          <Card
            as={motion.div}
            variants={itemVariants}
            w="100%"
            boxShadow="2xl"
            background={cardBg}
            whileHover={{ scale: 1.05 }}
          >
            {/* Score Card Content - Similar to previous implementation */}
            <CardBody>
              <VStack spacing={3}>
                <Heading size="md" display="flex" alignItems="center">
                  <FaTrophy style={{ marginRight: '10px' }} /> SCORE
                </Heading>
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Text
                      color={PLAYER_COLORS.RED}
                      borderWidth={3}
                      borderColor={PLAYER_COLORS.RED}
                      p={2}
                      borderRadius={4}
                      fontWeight="bold"
                    >
                      RED - {playerOneScore}
                    </Text>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                  >
                    <Text
                      color={PLAYER_COLORS.BLUE}
                      borderWidth={3}
                      borderColor={PLAYER_COLORS.BLUE}
                      p={2}
                      borderRadius={4}
                      fontWeight="bold"
                    >
                      BLUE - {playerTwoScore}
                    </Text>
                  </motion.div>
                </AnimatePresence>
              </VStack>
            </CardBody>
          </Card>

          {/* Previous Games Card */}
          <Card
            as={motion.div}
            variants={itemVariants}
            w="100%"
            boxShadow="2xl"
            background={cardBg}
            whileHover={{ scale: 1.05 }}
          >
            <CardBody>
              <VStack spacing={3}>
                <Heading size="md" display="flex" alignItems="center">
                  <FaChessBoard style={{ marginRight: '10px' }} /> Previous Games
                </Heading>
                {previousGames.map((game, index) => (
                  <Text key={index} color={game.winner === "RED" ? PLAYER_COLORS.RED : PLAYER_COLORS.BLUE}>
                    {game.playerOne} - {game.playerTwo} | {game.winner}
                  </Text>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </GridItem>

      {/* Game Board */}
      <GridItem colSpan={6}>
        <Box display="flex" justifyContent="center">
          <GameBoard
            key={gameVersion}
            spotOnClick={handleTurnChange}
            onScoreChange={handleScoreChange}
          />
        </Box>
      </GridItem>

      {/* Right Sidebar */}
      <GridItem colSpan={2}>
        <VStack spacing={4}>
          {/* Current Turn Card */}
          <Card
            w="100%"
            boxShadow="lg"
            bg={cardBg}
            as={motion.div}
            whileHover={{ scale: 1.02 }}
          >
            <CardBody>
              <VStack spacing={3}>
                <Heading size="md" display="flex" alignItems="center">
                  <FaUser style={{ marginRight: '10px' }} /> TURN
                </Heading>
                <Text
                  color={PLAYER_COLORS[playerTurn]}
                  borderWidth={3}
                  borderColor={PLAYER_COLORS[playerTurn]}
                  p={2}
                  borderRadius={4}
                  fontWeight="bold"
                >
                  {playerTurn}
                </Text>
              </VStack>
            </CardBody>
          </Card>

          {/* Game Controls */}
          <Card
            w="100%"
            boxShadow="2xl"
            bg={useColorModeValue(
              "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            )}
            as={motion.div}
            whileHover={{
              scale: 1.05,
              transition: {
                duration: 0.3,
                type: "spring",
                stiffness: 300
              }
            }}
            borderRadius="xl"
          >
            <CardBody>
              <VStack spacing={4}>
                <Button
                  as={motion.button}
                  flex={1}
                  colorScheme="purple"
                  onClick={newGameHandler}
                  leftIcon={<FaRedo />}
                  w="full"
                  size="lg"
                  variant="solid"
                  boxShadow="md"
                  padding={4}
                  whileHover={{
                    scale: 1.05,
                    rotate: [0, -10, 10, 0],
                    transition: {
                      duration: 0.4,
                      type: "spring",
                      stiffness: 300
                    }
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: {
                      duration: 0.2
                    }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 300
                    }
                  }}
                >
                  New Game
                </Button>
                <Button
                  as={motion.button}
                  flex={1}
                  colorScheme="purple"
                  onClick={AIHandler}
                  leftIcon={<FaRobot />}
                  w="full"
                  size="lg"
                  padding={4}
                  variant="solid"
                  boxShadow="md"
                  whileHover={{
                    scale: 1.05,
                    rotate: [0, 10, -10, 0],
                    transition: {
                      duration: 0.4,
                      type: "spring",
                      stiffness: 300
                    }
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: {
                      duration: 0.2
                    }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      delay: 0.2
                    }
                  }}
                >
                  vs AI
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </GridItem>

      {/* Game Over Modal */}
      {winner && (
        <Modal
          isOpen={true}
          onClose={() => setWinner(null)}
          isCentered
          motionPreset="scale"
        >
          <ModalOverlay
            bg="blackAlpha.300"
            backdropFilter="blur(10px)"
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <ModalContent
            as={motion.div}
            initial={{
              opacity: 0,
              scale: 0.7,
              rotateY: 90
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateY: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
              }
            }}
            exit={{
              opacity: 0,
              scale: 0.7,
              rotateY: -90
            }}
            bg={useColorModeValue(
              "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            )}
            boxShadow="2xl"
            borderRadius="2xl"
          >
            <ModalHeader
              textAlign="center"
              fontSize="3xl"
              fontWeight="extrabold"
              color={PLAYER_COLORS[winner]}
            >
              GAME OVER!
            </ModalHeader>
            <ModalCloseButton
              as={motion.button}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
            <ModalBody>
              <VStack spacing={6}>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    rotate: [0, 10, -10, 0],
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      duration: 0.5
                    }
                  }}
                >
                  <Text
                    fontSize="4xl"
                    fontWeight="bold"
                    color={PLAYER_COLORS[winner]}
                    textShadow="0 4px 6px rgba(0,0,0,0.1)"
                  >
                    {winner} WINS!
                  </Text>
                </motion.div>
                <Button
                  as={motion.button}
                  colorScheme="purple"
                  size="lg"
                  onClick={newGameHandler}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  leftIcon={<FaRedo />}
                  variant="solid"
                  boxShadow="xl"
                >
                  Play Again
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* AI Not Ready Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>AI Mode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>AI mode is coming soon!</Text>
              <Button colorScheme="purple" onClick={onClose}>
                OK
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Grid>
  );
}