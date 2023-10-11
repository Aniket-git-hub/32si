import { Button, Card, CardBody, CardHeader, Flex, Heading, List, ListItem, Spacer } from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";

export default function HomePage() {
  const { user } = useAuth()
  const greetings = [
    "Welcome! Challenge a friend, join a random game, or create your own board game adventure!",
    "Greetings, player! Engage in a strategic showdown. Create, join, or let fate decide your opponent!",
    "Greetings, strategist! Forge your path to victory. Create a game, join a friend, or take on a random foe!",
    "Greetings, challenger! The game awaits. Craft your own match or join the fray with a random opponent!",
    "Hello, gamer! Dive into the action. Create a game, challenge a friend, or let destiny choose your rival!"
  ];

  const createGameHandler = () => {
    console.log("creating game")
  }

  const joinGameHandler = () => {
    console.log("join game")
  }

  const joinRandomGameHandler = () => {
    console.log("join random game")
  }

  const challengeAlliesHandler = () => {
    console.log("challengeAllies")
  }

  return (
    <>
      <Flex m={10} justifyContent={"space-evenly"}>
        <Card maxW={450} shadow={"none"}>
          <CardBody>
            <CardHeader>
              <Heading size={"lg"}>{greetings[Math.floor(Math.random() * greetings.length)]}</Heading>
            </CardHeader>
          </CardBody>
        </Card>
        <Spacer flex={1}></Spacer>
        <Card minW={450} shadow={"lg"}>
          <CardBody>
            <Heading mb={3} size={"md"}>Leaderboard</Heading>
            <List>
              <ListItem>1. aniket singh - </ListItem>
              <ListItem>1. aniket singh - </ListItem>
              <ListItem>1. aniket singh - </ListItem>
              <ListItem>1. aniket singh - </ListItem>
              <ListItem>1. aniket singh - </ListItem>
              <ListItem>1. aniket singh - </ListItem>
              <ListItem>1. aniket singh - </ListItem>
              <ListItem>1. aniket singh - </ListItem>
              <ListItem>1. aniket singh - </ListItem>
              <ListItem>1. aniket singh - </ListItem>
            </List>
          </CardBody>
        </Card>
      </Flex>

      <Flex m={10} py={3} borderRadius={"xl"} border={"2px dashed gray"} justifyContent={"space-evenly"}>
        <Card m={5} w={"fit-content"} shadow={"xl"}>
          <CardBody>
            <Button colorScheme="purple" onClick={createGameHandler}>Create Game</Button>
          </CardBody>
        </Card>
        <Card m={5} w={"fit-content"} shadow={"xl"}>
          <CardBody>
            <Button colorScheme="purple" onClick={joinGameHandler}>Join</Button>
          </CardBody>
        </Card>
        <Card m={5} w={"fit-content"} shadow={"xl"}>
          <CardBody>
            <Button colorScheme="purple" onClick={joinRandomGameHandler}>Join Random</Button>
          </CardBody>
        </Card>
        <Card m={5} w={"fit-content"} shadow={"xl"}>
          <CardBody>
            <Button colorScheme="purple" onClick={challengeAlliesHandler}>Challenge Allies</Button>
          </CardBody>
        </Card>
      </Flex>

    </>
  )
}
