import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Spacer,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import CustomModal from '../../components/utils/CustomModal';
import { useAuth } from '../../hooks/useAuth';
import useSocket from '../../hooks/useSocket';
import GamePage from './GamePage';

export default function HomePage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [showGame, setShowGame] = useState(false);
  const [gameLobbyId, setGameLobbyId] = useState('');
  const [createGameName, setCreateGameName] = useState('');
  const [joinGameLobbyId, setJoinGameLobbyId] = useState('');
  const [joinRequestUser, setJoinRequestuser] = useState(null);
  const [waitingToJoin, setWaitingToJoin] = useState(false);
  const alert = useToast();
  const joiningRequestModalRef = useRef();
  const [playerTwo, setPlayerTwo] = useState('');
  const [countdown, setCountdown] = useState(120);
  const [creator, setCreator] = useState('');

  useEffect(() => {
    let countdownInterval;
    let deleteTimeout;
    if (waitingToJoin) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    if (countdown < 0) {
      alert({
        title: 'Game Deleted',
        description: 'No players joined in time. The game lobby has been deleted.',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setWaitingToJoin(false);
      exitGame();
      clearInterval(countdownInterval);
      setCountdown(120);
    }
    return () => {
      clearInterval(countdownInterval);
      clearTimeout(deleteTimeout);
    };
  }, [waitingToJoin, countdown]);

  const createGameHandler = async (onClose) => {
    try {
      // const response = await createAGame(createGameName);
      // socket.emit("createGame", { userId: user._id, gameLobbyId: response.data.user.gameLobbyId });
      // const response = await createAGame(createGameName);
      socket.emit('createGame', { userId: user._id, gameLobbyId: 'test' });
    } catch (error) {
      console.log(error);
      setShowGame(false);
      setGameLobbyId('');
    } finally {
      onClose();
    }
  };

  const joinGameHandler = (onClose) => {
    if (!joinGameLobbyId && joinGameLobbyId === '') return;
    socket.emit('joinGame', { userId: user._id, gameLobbyId: joinGameLobbyId });
    onClose();
  };

  const joinRandomGameHandler = () => {
    console.log('join random game');
  };

  const challengeAlliesHandler = () => {
    console.log('challengeAllies');
  };

  const allowJoining = (onClose) => {
    socket.emit('allowJoin', { userId: joinRequestUser.userId, gameLobbyId: joinRequestUser.gameLobbyId });
    onClose();
  };

  const exitGame = () => {
    socket.emit('leaveGame', { userId: user._id, gameLobbyId: gameLobbyId });
    setShowGame(false);
  };

  const handleCopyGameId = async () => {
    try {
      await navigator.clipboard.writeText(gameLobbyId);
      alert({
        title: 'Copied Game Id',
        description: `${gameLobbyId} copied to clipboard.`,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.log('Failed to copy text: ', err);
    }
  };

  const gameStateChanged = () => {
    if (socket) {
      socket.emit('gameChange', { gameLobbyId, userId: user._id, someData: { HelloWord: 'hi' } });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('gameCreated', ({ gameLobbyId }) => {
        alert({
          title: 'Game Created',
          description: `${gameLobbyId} created and now waiting.`,
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setGameLobbyId(gameLobbyId);
        setWaitingToJoin(true);
        setCreator(user.username)
      });

      socket.on('userJoined', ({ username }) => {
        alert({
          title: 'User Joined',
          description: `${username} Joined In`,
          position: 'top',
          status: 'info',
          duration: 1000,
          isClosable: true,
        });
        setPlayerTwo(username)
        setShowGame(true)
      });

      socket.on('gameJoined', ({ gameLobbyId, creator }) => {
        alert({
          title: 'Joined Game',
          description: `Joining ${gameLobbyId}`,
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setGameLobbyId(gameLobbyId);
        setShowGame(true);
        setWaitingToJoin(false);
        setCreator(creator)
      });

      socket.on('requestJoin', ({ userId, gameLobbyId }) => {
        setJoinRequestuser({
          userId,
          gameLobbyId,
        });
        setWaitingToJoin(false);
        joiningRequestModalRef.current.openModal();
      });

      socket.on('lobbyDoesNotExist', ({ gameLobbyId }) => {
        alert({
          title: 'Join Request',
          description: `${gameLobbyId} doesn't exit`,
          position: 'top',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
      });

      socket.on('requestSubmitted', ({ gameLobbyId }) => {
        setWaitingToJoin(true);
        alert({
          title: 'Joining Requested',
          description: `Asking creator to let us join ${gameLobbyId}`,
          position: 'top',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      });

      socket.on('userLeft', ({ username }) => {
        alert({
          title: 'User Left',
          description: `${username} has left the game`,
          position: 'top',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });

      socket.on('roomFull', ({ gameLobbyId }) => {
        alert({
          title: 'Room Full',
          description: `${gameLobbyId} is full. Find another or create your own.`,
          position: 'top',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
      });

      socket.on('gameChanged', (data) => {
        console.log(data);
        alert({
          title: 'Game State Changed',
          description: `Game State changed`,
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      });

    }
    return () => {
      if (socket) {
        socket.emit('leaveGame', { userId: user._id, gameLobbyId: 'test' });
        socket.off('gameCreated');
        socket.off('UserJoined');
        socket.off('gameJoined');
        socket.off('requestJoin');
        socket.off('lobbyDoesNotExist');
        socket.off('requestSubmitted');
        socket.off('userLeft');
        socket.off('leaveGame');
        socket.off('gameChanged');
      }
    };
  }, [socket]);

  return (
    <>
      <CustomModal
        ref={joiningRequestModalRef}
        variant="warning"
        title="New Join Request"
        closable={false}
        footer={(onClose) => (
          <Flex justifyContent={'space-between '} alignItems="center">
            <Button flex={2} onClick={onClose}>
              Cancel
            </Button>
            <Spacer flex={1}></Spacer>
            <Button flex={2} onClick={(e) => allowJoining(onClose)} colorScheme="purple">
              Allow
            </Button>
          </Flex>
        )}
      >
        <Alert status="warning" rounded={'lg'} variant={'left-accent'}>
          <AlertIcon />
          {joinRequestUser && joinRequestUser.userId} want to join the game?
        </Alert>
      </CustomModal>
      {!showGame && (
        <>
          {waitingToJoin && (
            <Alert status="warning" m={3} rounded={'lg'} variant={'left-accent'}>
              <AlertIcon />
              {gameLobbyId != '' ? (
                <>
                  <Text>
                    Waiting for rivals to join. Share the Game Id to join. You can create another
                    game in {countdown} seconds.
                  </Text>
                  <Spacer />
                  <Button mr={2} onClick={handleCopyGameId}>
                    Copy Game Id
                  </Button>
                </>
              ) : (
                <Text>
                  Requested the game creator to lets us join. Please wait. You will automatically be redirect to the game once request is accepted.
                </Text>
              )}
            </Alert>
          )}
          <Flex m={10} py={3} borderRadius={'xl'} border={'2px dashed gray'} justifyContent={'space-evenly'}>
            <CustomModal
              trigger={(onOpen) => {
                return (
                  <>
                    <Button colorScheme="purple" onClick={onOpen} isDisabled={waitingToJoin}>
                      Create Game
                    </Button>
                  </>
                );
              }}
              title=" Create A Game"
              footer={(onClose) => {
                return (
                  <>
                    <Button onClick={onClose}>Close</Button>
                    <Spacer />
                    <Button colorScheme="purple" onClick={(e) => createGameHandler(onClose)}>
                      Create Game
                    </Button>
                  </>
                );
              }}
            >
              <FormControl isRequired>
                <FormLabel>Game Name</FormLabel>
                <InputGroup>
                  <Input type={'text'} onChange={(e) => setCreateGameName(e.target.value)} />
                </InputGroup>
              </FormControl>
            </CustomModal>

            <CustomModal
              trigger={(onOpen) => {
                return (
                  <>
                    <Button colorScheme="purple" onClick={onOpen} isDisabled={waitingToJoin}>
                      Join Game
                    </Button>
                  </>
                );
              }}
              title="Join A Game"
              footer={(onClose) => {
                return (
                  <>
                    <Button onClick={onClose}>Close</Button>
                    <Spacer />
                    <Button colorScheme="purple" onClick={(_) => joinGameHandler(onClose)}>
                      Join Game
                    </Button>
                  </>
                );
              }}
            >
              <FormControl isRequired>
                <FormLabel>Game Id</FormLabel>
                <InputGroup>
                  <Input type={'text'} onChange={(e) => setJoinGameLobbyId(e.target.value)} />
                </InputGroup>
              </FormControl>
            </CustomModal>

            <Button colorScheme="purple" isDisabled={waitingToJoin} onClick={joinRandomGameHandler}>
              Join Random
            </Button>
            <Button colorScheme="purple" isDisabled={waitingToJoin} onClick={challengeAlliesHandler}>
              Challenge Allies
            </Button>
          </Flex>
        </>
      )}

      {showGame &&
        <GamePage
          onExit={exitGame}
          onStateChange={gameStateChanged}
          playerOne={user}
          playerTwo={creator === user.username ? playerTwo : user.username}
          gameLobbyId={gameLobbyId}
          creator={creator}
        />
      }
    </>
  );
}
