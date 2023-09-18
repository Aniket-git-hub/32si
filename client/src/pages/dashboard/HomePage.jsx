import { Center, Card, CardHeader, CardBody, Text, Heading, VStack, Button, HStack, SimpleGrid, Grid, GridItem, Box } from "@chakra-ui/react";
import GameBoard from "../../components/game/GameBoard";
import { useAuth } from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";
import { useEffect } from 'react';
import { color } from "framer-motion";

export default function HomePage() {
  const { user } = useAuth()
  const { socket } = useSocket()

  useEffect(() => {
    if (user && socket) {
      const handleNewChallenge = (data) => {
        console.log(data)
      }

      socket.on("newChallenge", handleNewChallenge)

      // Clean up the effect by removing the event listener
      return () => socket.off("newChallenge", handleNewChallenge)
    }
  }, [user, socket]) // Depend on 'user' and 'socket'

  return (
    <Grid bg="bodyColor" borderRadius={10} p={6} templateColumns={"repeat(10, 1fr)"} >

      <GridItem colSpan={2} >
        <Box display={"flex"} justifyContent={"center"}>
          <VStack >
            <Card w={"100%"}  >
              <CardBody>
                <VStack>
                  <Heading size={"md"}>Score</Heading>
                  <Text color={"red.500"} borderWidth={2} borderColor={"red.500"} p={2} borderRadius={4}> RED (YOU) - 13  </Text>
                  <Text color={"blue.500"} borderWidth={2} borderColor={"blue.500"} p={2} borderRadius={4}> BLUE - 12  </Text>
                </VStack>
              </CardBody>
            </Card>
            <Card w={"100%"}>
              <CardBody>
                <VStack>
                  <Heading size={"md"}>Previous Games</Heading>
                  <Text> 12 - 0 | BLUE </Text>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Box>
      </GridItem>

      <GridItem colSpan={6}>
        <Box display={"flex"} justifyContent={"center"}>
          <GameBoard />
        </Box>
      </GridItem>

      <GridItem colSpan={2} >
        <Box display={"flex"} justifyContent={"center"}>
          <VStack >
            <Box w={"100%"}>
              <VStack>
                <HStack bg={"white"} p={1} pl={3} borderRadius={4}>
                  <Heading size={"md"} mx={2}> Turn </Heading>
                  <Text color={"blue.500"} borderWidth={2} borderColor={"blue.500"} p={2} borderRadius={4}> Blue (You) </Text>
                </HStack>
              </VStack>
            </Box>
            <Box w={"100%"}>
              <VStack>
                <HStack bg={"white"} p={1} borderRadius={4}>
                  <Button variant={"outline"} colorScheme="purple"> New Game</Button>
                  <Button variant={"outline"} colorScheme="purple">AI</Button>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </GridItem >

    </Grid >
  )
}
