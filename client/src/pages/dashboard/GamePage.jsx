import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Card, CardBody, Grid, GridItem, HStack, Heading, Text, VStack, useToast } from "@chakra-ui/react";
import { useState } from 'react';
import Confetti from "react-confetti";
import GameBoard from "../../components/game/GameBoard";
import { useAuth } from "../../hooks/useAuth";

export default function GamePage({ onExit, onStateChange, gameLobbyId, playerTwo, creator }) {
      const { user } = useAuth()
      const alert = useToast()

      const [windowDimensions] = useState({
            width: window.innerWidth,
            height: window.innerHeight
      });
      const [playerOneScore, setPlayerOneScore] = useState(16)
      const [playerTwoScore, setPlayerTwoScore] = useState(16)
      const [playerOneColor, setPlayerOneColor] = useState("red")
      const [playerTwoColor, setPlayerTwoColor] = useState("blue")
      const [playerOneName, setPlayerOneName] = useState(creator)
      const [playerTwoName, setPlayerTwoName] = useState(playerTwo)
      const [playerTurn, setPlayerTurn] = useState(playerOneName)
      const [winner, setWinner] = useState(null)
      const [confetti, setConfetti] = useState(false)
      const [previousGames, setPreviousGames] = useState([])
      const [newGame, setNewGame] = useState(false)

      const newGameHander = () => {
            setNewGame(prev => !prev)
      }

      const AIHandler = () => {

      }

      const checkWinner = (playerWon) => {
            setWinner(playerWon === 1 ? playerOneName : playerWon === 2 ? playerTwoName : null)
            if (playerWon) {
                  setConfetti(prev => !prev)
                  setTimeout(() => {
                        setConfetti(prev => !prev)
                  }, 3000)
                  alert(
                        {
                              title: "We have a winner",
                              description: `${winner} has won the game. Congratulations`,
                              position: "top",
                              status: "success",
                              duration: 3000
                        }
                  )
            }
      }

      const handleBoardUpdate = (currentPlayer, redScore, blueScore, playerWon) => {
            setPlayerOneScore(redScore)
            setPlayerTwoScore(blueScore)
            setPlayerTurn(currentPlayer)
            checkWinner(playerWon)
            onStateChange()
      }

      return (
            <Grid bg="bodyColor" borderRadius={10} p={6} templateColumns={"repeat(10, 1fr)"} >

                  <GridItem colSpan={2} >
                        <Box display={"flex"} justifyContent={"center"}>
                              <VStack >
                                    <Card w={"100%"} boxShadow={"lg"} >
                                          <CardBody>
                                                <VStack>
                                                      <Heading size={"md"}> {gameLobbyId && gameLobbyId} </Heading>
                                                </VStack>
                                          </CardBody>
                                    </Card>
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
                              <GameBoard boardUpdate={handleBoardUpdate} setNewGame={newGame} user={user} creator={creator} />
                        </Box>
                  </GridItem>

                  <GridItem colSpan={2} >
                        <Box display={"flex"} justifyContent={"center"}>

                              <VStack >
                                    <Box w={"100%"}>
                                          <VStack>
                                                <Button variant={"outline"} rightIcon={<ArrowForwardIcon />} onClick={onExit}>
                                                      Exit
                                                </Button>
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
