import { Alert, AlertIcon, Button, Card, CardBody, Flex, FormControl, FormLabel, Input, InputGroup, Spacer, useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import CustomModal from "../../components/utils/CustomModal";
import { useAuth } from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";
import GamePage from "./GamePage";

export default function HomePage() {
  const { user } = useAuth()
  const { socket } = useSocket()
  const [showGame, setShowGame] = useState(false)
  const [GamelobbyId, setGameLobbyId] = useState('')
  const [createGameName, setCreateGameName] = useState('')
  const [joinGameLobbyId, setJoinGameLobbyId] = useState('')
  const [joinRequestUser, setJoinRequestuser] = useState(null)
  const [waitingToJoin, setWaitingToJoin] = useState(false)
  const alert = useToast()
  const joiningRequestModalRef = useRef()

  const greetings = [
    "Welcome! Challenge a friend, join a random game, or create your own board game adventure!",
    "Greetings, player! Engage in a strategic showdown. Create, join, or let fate decide your opponent!",
    "Greetings, strategist! Forge your path to victory. Create a game, join a friend, or take on a random foe!",
    "Greetings, challenger! The game awaits. Craft your own match or join the fray with a random opponent!",
    "Hello, gamer! Dive into the action. Create a game, challenge a friend, or let destiny choose your rival!"
  ];

  const createGameHandler = async () => {
    try {
      // const response = await createAGame(createGameName);
      // socket.emit("createGame", { userId: user._id, gameLobbyId: response.data.user.gameLobbyId });
      // const response = await createAGame(createGameName);
      socket.emit("createGame", { userId: user._id, gameLobbyId: "test" });
    } catch (error) {
      console.log(error);
      setShowGame(false);
      setGameLobbyId('');
    }
  };

  const joinGameHandler = (onClose) => {
    if (!joinGameLobbyId && joinGameLobbyId === '') return
    socket.emit("joinGame", { userId: user._id, gameLobbyId: joinGameLobbyId })
    onClose()
  }

  const joinRandomGameHandler = () => {
    console.log("join random game")
  }

  const challengeAlliesHandler = () => {
    console.log("challengeAllies")
  }
  const allowJoining = () => {
    socket.emit("allowJoin", { userId: joinRequestUser.userId, gameLobbyId: joinRequestUser.gameLobbyId })
  }

  useEffect(() => {
    if (socket) {

      socket.on("gameCreated", ({ gameLobbyId }) => {
        alert({
          title: "Game Created",
          description: `${gameLobbyId} created and joined.`,
          position: "top",
          status: "success",
          duration: 4000,
          isClosable: true,
        })
        setGameLobbyId(gameLobbyId);
        setShowGame(true);
      });

      socket.on("userJoined", ({ userId }) => {
        alert({
          title: "User Joined",
          description: `${userId} Joined In`,
          position: "top",
          status: "info",
          duration: 3000,
          isClosable: true,
        })
      });

      socket.on("gameJoined", ({ gameLobbyId }) => {
        alert({
          title: "Joined Game",
          description: `Joining ${gameLobbyId}`,
          position: "top",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        setGameLobbyId(gameLobbyId);
        setShowGame(true);
        setWaitingToJoin(false)
      });

      socket.on("requestJoin", ({ userId, gameLobbyId }) => {
        setJoinRequestuser({
          userId,
          gameLobbyId
        })
        alert({
          title: "Join Request",
          description: `${userId} want to join ${gameLobbyId}`,
          position: "top",
          status: "info",
          duration: 3000,
          isClosable: true,
        })
        joiningRequestModalRef.current.openModal()
        console.log(userId, " has requested to join ", gameLobbyId)
      })

      socket.on("lobbyDoesNotExist", ({ gameLobbyId }) => {
        alert({
          title: "Join Request",
          description: `${gameLobbyId} doesn't exit`,
          position: "top",
          status: "warning",
          duration: 3000,
          isClosable: true,
        })
      })

      socket.on("requestSubmitted", ({ gameLobbyId }) => {
        setWaitingToJoin(true)
        alert({
          title: "Joining Requested",
          description: `Asking creator to let us join ${gameLobbyId}`,
          position: "top",
          status: "info",
          duration: 3000,
          isClosable: true,
        })
      })
    }
    // Clean up the event listener when the component unmounts
    return () => {
      if (socket) {
        socket.emit("leaveGame", { userId: user._id, gameLobbyId: 'test' })
        setShowGame(false)
        socket.off('gameCreated');
        socket.off('UserJoined');
        socket.off('gameJoined');
        socket.off('requestJoin');
        socket.off('lobbyDoesNotExist')
        socket.off('requestSubmitted')
      }
    };
  }, [socket]);

  return (
    <>
      {/* <Flex m={10} justifyContent={"space-evenly"}>
        <Card maxW={450} shadow={"none"}>
          <CardBody>
            <CardHeader>
              <Heading size={"lg"}>{greetings[Math.floor(Math.random() * greetings.length)]}</Heading>
            </CardHeader>
          </CardBody>
        </Card>
        <Spacer flex={1}></Spacer>
        <Card minW={350} shadow={"lg"} borderBottom="4px" borderBottomColor="purple.500">
          <CardBody>
            <Heading mb={3} size={"md"}>Leaderboard</Heading>
            <List>
              {
                leaderBoard.map((player, index) => (
                  <ListItem>{index + 1} {player.username} - {player.points} </ListItem>
                ))
              }
            </List>
          </CardBody>
        </Card>
      </Flex> */}

      {/* <Button onClick={allowJoining}> Allow Joing </Button> */}
      <CustomModal
        ref={joiningRequestModalRef}
        variant="warning"
        title="New Join Request"
        closable={false}
        footer={
          (onClose) => <Flex justifyContent={"space-between "} alignItems="center">
            <Button flex={2} onClick={onClose}>Cancel</Button>
            <Spacer flex={1}></Spacer>
            <Button flex={2} onClick={allowJoining} colorScheme="purple">Allow</Button>
          </Flex>
        }
      >
        <Alert status='warning' rounded={"lg"}>
          <AlertIcon />
          {joinRequestUser && joinRequestUser.userId} want to join the game?
        </Alert>
      </CustomModal>
      {
        !showGame && <>
          {
            waitingToJoin &&
            <Alert status='warning' m={3}>
              <AlertIcon />
              Requested the game creator to lets us join. Please wait. You will automatically be redirect to the game once request is accepted.
            </Alert>
          }
          <Flex m={10} py={3} borderRadius={"xl"} border={"2px dashed gray"} justifyContent={"space-evenly"}>
            <Card m={5} w={"fit-content"} shadow={"xl"}>
              <CardBody>
                <CustomModal
                  trigger={(onOpen) => {
                    return <>
                      <Button colorScheme="purple" onClick={onOpen} isDisabled={waitingToJoin}>Create Game</Button>
                    </>
                  }}
                  title=" Create A Game"
                  footer={(onClose) => {
                    return <>
                      <Button onClick={onClose}>Close</Button>
                      <Spacer />
                      <Button colorScheme="purple" onClick={createGameHandler}>Create Game</Button>
                    </>
                  }}
                >
                  <FormControl isRequired>
                    <FormLabel>Game Name</FormLabel>
                    <InputGroup>
                      <Input type={"text"} onChange={(e) => setCreateGameName(e.target.value)} />
                    </InputGroup>
                  </FormControl>
                </CustomModal>
              </CardBody>
            </Card>
            <Card m={5} w={"fit-content"} shadow={"xl"}>
              <CardBody>
                <CustomModal
                  trigger={(onOpen) => {
                    return <>
                      <Button colorScheme="purple" onClick={onOpen} isDisabled={waitingToJoin}>Join Game</Button>
                    </>
                  }}
                  title="Join A Game"
                  footer={(onClose) => {
                    return <>
                      <Button onClick={onClose}>Close</Button>
                      <Spacer />
                      <Button colorScheme="purple" onClick={_ => joinGameHandler(onClose)}>Join Game</Button>
                    </>
                  }}
                >
                  <FormControl isRequired>
                    <FormLabel>Game Id</FormLabel>
                    <InputGroup>
                      <Input type={"text"} onChange={(e) => setJoinGameLobbyId(e.target.value)} />
                    </InputGroup>
                  </FormControl>
                </CustomModal>
              </CardBody>
            </Card>

            <Card m={5} w={"fit-content"} shadow={"xl"}>
              <CardBody>
                <Button colorScheme="purple" isDisabled={waitingToJoin} onClick={joinRandomGameHandler}>Join Random</Button>
              </CardBody>
            </Card>
            <Card m={5} w={"fit-content"} shadow={"xl"}>
              <CardBody>
                <Button colorScheme="purple" isDisabled={waitingToJoin} onClick={challengeAlliesHandler}>Challenge Allies</Button>
              </CardBody>
            </Card>
          </Flex>
        </>
      }

      {
        showGame && <GamePage />
      }
    </>
  )
}
