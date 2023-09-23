import { Card, CardBody, Text, Heading, VStack, Button, HStack, Grid, GridItem, Box } from "@chakra-ui/react";
import GameBoard from "../../components/game/GameBoard";
import { useAuth } from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";
import { useEffect, useState } from 'react';

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

  const [playerOneScore, setPlayerOneScore] = useState(16)
  const [playerTwoScore, setPlayerTwoScore] = useState(16)
  const [playerOneColor, setPlayerOneColor] = useState("red")
  const [playerTwoColor, setPlayerTwoColor] = useState("blue")
  const [playerOneName, setPlayerOneName] = useState("RED")
  const [playerTwoName, setPlayerTwoName] = useState("BLUE")
  const [playerTurn, setPlayerTurn] = useState(playerTwoName)
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

  const newGameHander = () => {
    setPlayerOneScore(16)
    setPlayerTwoScore(16)
  }
  const AIHandler = () => {

  }

  const handleSpotOnClick = (turn) => {
    turn ? setPlayerTurn(playerOneName) : setPlayerTurn(playerTwoName)
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
          <GameBoard spotOnClick={handleSpotOnClick} />
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
