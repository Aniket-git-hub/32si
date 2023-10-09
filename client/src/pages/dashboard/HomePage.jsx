import { Box, Button, Card, CardBody, Grid, GridItem, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import Confetti from "react-confetti";
import GameBoard from "../../components/game/GameBoard";
import { useAuth } from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";

export default function HomePage() {
  const { user } = useAuth()
  const { socket } = useSocket()

  useEffect(() => {
    if (user && socket) {
      const handleNewChallenge = (data) => {
        console.log(data)
      }

      socket.on("newChallenge", handleNewChallenge)

      return () => socket.off("newChallenge", handleNewChallenge)
    }
  }, [user, socket])

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [playerOneScore, setPlayerOneScore] = useState(16)
  const [playerTwoScore, setPlayerTwoScore] = useState(16)
  const [playerOneColor, setPlayerOneColor] = useState("red")
  const [playerTwoColor, setPlayerTwoColor] = useState("blue")
  const [playerOneName, setPlayerOneName] = useState("RED")
  const [playerTwoName, setPlayerTwoName] = useState("BLUE")
  const [playerTurn, setPlayerTurn] = useState(playerOneName)
  const [confetti, setConfetti] = useState(false)
  const [previousGames, setPreviousGames] = useState([
    {
      playerOne: 12,
      playerTwo: 0,
      winner: "BLUE"
    },
    {
      playerOne: 7,
      playerTwo: 0,
      winner: "BLUE"
    },
    {
      playerOne: 2,
      playerTwo: 0,
      winner: "RED"
    },
  ])

  const [newGame, setNewGame] = useState(false)
  const newGameHander = () => {
    setNewGame(prev => !prev)
  }

  const AIHandler = () => {

  }

  const handleBoardUpdate = (currentPlayer, redScore, blueScore) => {
    setPlayerOneScore(redScore)
    setPlayerTwoScore(blueScore)
    setPlayerTurn(currentPlayer == 1 ? playerOneName : playerTwoName)
    setConfetti(prev => !prev)
  }


  return (
    <Grid bg="bodyColor" borderRadius={10} p={6} templateColumns={"repeat(10, 1fr)"} >

      <GridItem colSpan={2} >
        <Box display={"flex"} justifyContent={"center"}>
          <VStack >
            <Card w={"100%"} boxShadow={"lg"} >
              <CardBody>
                <VStack>
                  <Heading size={"md"}>SCORE</Heading>
                  <Text color={"red.500"} borderWidth={3} borderColor={"red.500"} p={2} borderRadius={4} fontWeight={"bold"}>
                    {playerOneName} - {playerOneScore}
                  </Text>
                  <Text color={"blue.500"} borderWidth={3} borderColor={"blue.500"} p={2} borderRadius={4} fontWeight={"bold"}>
                    {playerTwoName} - {playerTwoScore}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            <Card w={"100%"} boxShadow={"lg"}>
              <CardBody>
                <VStack>
                  <Heading size={"md"}>Previous Games</Heading>
                  {previousGames.map((g, i) => (
                    <Text key={i}> {g.playerOne} - {g.playerTwo} | {g.winner}  </Text>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Box>
      </GridItem>

      <GridItem colSpan={6}>
        <Box display={"flex"} justifyContent={"center"}>
          {confetti && <Confetti numberOfPieces={300} width={windowDimensions.width} height={windowDimensions.height} />}
          <GameBoard boardUpdate={handleBoardUpdate} setNewGame={newGame} />
        </Box>
      </GridItem>

      <GridItem colSpan={2} >
        <Box display={"flex"} justifyContent={"center"}>
          <VStack >
            <Box w={"100%"}>
              <VStack>
                <HStack bg={"white"} p={1} pl={3} borderRadius={4} boxShadow={"lg"}>
                  <Heading size={"md"} mx={2}> TURN </Heading>
                  {playerTurn === playerOneName ? (
                    <Text color={"red.500"} borderWidth={3} borderColor={"red.500"} p={2} borderRadius={4} fontWeight={"bold"}>
                      {playerTurn}
                    </Text>
                  ) : (
                    <Text color={"blue.500"} borderWidth={3} borderColor={"blue.500"} p={2} borderRadius={4} fontWeight={"bold"}>
                      {playerTurn}
                    </Text>
                  )}
                </HStack>
              </VStack>
            </Box>
            <Box w={"100%"}>
              <VStack>
                <HStack bg={"white"} p={1} borderRadius={4} boxShadow={"lg"}>
                  <Button variant={"outline"} colorScheme="purple" onClick={newGameHander}> NEW GAME</Button>
                  <Button variant={"outline"} colorScheme="purple" onClick={AIHandler}>AI</Button>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </GridItem >

    </Grid >
  )
}
