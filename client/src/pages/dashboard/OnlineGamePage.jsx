import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spinner,
  Text,
  useClipboard,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaBook, FaCopy, FaFlag, FaHome, FaLink, FaRedo } from "react-icons/fa";
import { MdMusicNote, MdMusicOff } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import GameBoard from "../../components/game/GameBoard";
import CustomAlertDialog from "../../components/utils/CustomAlertDialog";
import {
  GameOverModal,
  HowToPlayModal,
  PanelCard,
  useGameBackground,
  PLAYER_LABELS,
  CompactStatus,
  ScoreCard,
  TurnCard,
  captureHint,
} from "../../components/game/GamePanels";
import { BLUE, DRAW, RED, opponent } from "../../game/engine";
import { useAuth } from "../../hooks/useAuth";
import { useGameSettings } from "../../context/GameSettingsContext";
import useGameSounds from "../../hooks/useGameSounds";
import useSocket from "../../hooks/useSocket";

const useNow = (active) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
};

export default function OnlineGamePage() {
  const { code: rawCode } = useParams();
  const code = rawCode.toUpperCase();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { play, toggleMusic, isMusicPlaying } = useGameSounds();
  const rules = useDisclosure();
  const gameOver = useDisclosure();

  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [closedReason, setClosedReason] = useState(null);
  const [pending, setPending] = useState(false);
  // Rating changes and saved game id, sent by the server once a finished game is stored.
  const [rated, setRated] = useState(null);
  const lastMoveNumber = useRef(null);
  const leaveTimer = useRef(null);

  const shareLink = `${window.location.origin}/game/online/${code}`;
  const { onCopy: copyCode, hasCopied: codeCopied } = useClipboard(code);
  const { onCopy: copyLink, hasCopied: linkCopied } = useClipboard(shareLink);

  const showError = useCallback(
    (message) => toast({ title: message, status: "error", duration: 3000, isClosable: true, position: "top" }),
    [toast]
  );

  // Join the room, and join again after every reconnect (the server keeps the game for a while).
  useEffect(() => {
    if (!socket) return;
    // A leave scheduled by the previous cleanup is cancelled when the effect runs again right away
    // (React StrictMode mounts effects twice in development; leaving a waiting game would close it).
    clearTimeout(leaveTimer.current);
    const join = () =>
      socket.emit("game:join", { code }, (res) => {
        if (res?.ok) {
          setRoom({ ...res.room, receivedAt: Date.now() });
          setError(null);
        } else {
          setError(res?.error ?? "Could not join the game.");
        }
      });
    const onState = (view) => view.code === code && setRoom({ ...view, receivedAt: Date.now() });
    const onClosed = (data) => data.code === code && setClosedReason(data.reason);
    const onRated = (data) => data.code === code && setRated(data);

    if (socket.connected) join();
    socket.on("connect", join);
    socket.on("game:state", onState);
    socket.on("game:closed", onClosed);
    socket.on("game:rated", onRated);
    return () => {
      socket.off("connect", join);
      socket.off("game:state", onState);
      socket.off("game:closed", onClosed);
      socket.off("game:rated", onRated);
      leaveTimer.current = setTimeout(() => socket.emit("game:leave", { code }), 250);
    };
  }, [socket, code]);

  const state = room?.state;
  const myColor = room ? (room.players[RED]?.userId === user?._id ? RED : room.players[BLUE]?.userId === user?._id ? BLUE : null) : null;
  const opponentColor = myColor ? opponent(myColor) : null;
  const opponentSeat = room && opponentColor ? room.players[opponentColor] : null;

  // Sounds and game over.
  useEffect(() => {
    if (!state) return;
    if (lastMoveNumber.current !== null && state.moveNumber !== lastMoveNumber.current) {
      if (state.winner !== null) {
        play(state.winner === myColor ? "win" : state.winner === DRAW ? "move" : "lose");
      } else if (state.moveNumber === 0) {
        play("newGame");
      } else {
        play(state.lastMove?.captured.length ? "kill" : "move");
      }
    }
    lastMoveNumber.current = state.moveNumber;
  }, [state, myColor, play]);

  useEffect(() => {
    if (room?.status === "playing") setRated(null); // a rematch started
    if (room?.status === "finished") gameOver.onOpen();
    else gameOver.onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.status]);

  const send = (event, payload = {}) =>
    new Promise((resolve) => {
      setPending(true);
      socket.emit(event, { code, ...payload }, (res) => {
        setPending(false);
        if (!res?.ok) showError(res?.error ?? "Something went wrong.");
        resolve(res);
      });
    });

  const now = useNow(Boolean(opponentSeat?.abandonDeadline) || room?.turnRemainingMs != null);
  // Turn clock: the server sends the time left; count down from when the update arrived.
  const clock =
    room?.status === "playing" && room.turnRemainingMs != null
      ? Math.max(0, Math.ceil((room.receivedAt + room.turnRemainingMs - now) / 1000))
      : null;
  const bg = useGameBackground();
  const { settings } = useGameSettings();

  if (closedReason || error) {
    return (
      <VStack p={10} spacing={6}>
        <Heading size="lg">{closedReason ? "Game closed" : "Can't open this game"}</Heading>
        <Text>{closedReason ?? error}</Text>
        <Button colorScheme="purple" leftIcon={<FaHome />} onClick={() => navigate("/")}>
          Back to home
        </Button>
      </VStack>
    );
  }

  if (!room || !state) {
    return (
      <VStack p={10} spacing={4}>
        <Spinner size="xl" />
        <Text>{socket?.connected ? "Joining game…" : "Connecting to the server…"}</Text>
      </VStack>
    );
  }

  const waiting = room.status === "waiting";
  const myTurn = room.status === "playing" && state.turn === myColor;
  const hint = captureHint(state, myTurn, settings.captureHints);
  const names = {
    [RED]: room.players[RED] ? `${room.players[RED].username}${myColor === RED ? " (you)" : ""}` : "Waiting…",
    [BLUE]: room.players[BLUE]
      ? `${room.players[BLUE].username}${myColor === BLUE ? " (you)" : ""}`
      : room.invited
        ? `${room.invited.username}?`
        : "Waiting…",
  };
  const presence = (color) => {
    const seat = room.players[color];
    if (!seat || seat.connected) return null;
    return <Text color="orange.700">offline</Text>;
  };

  const iRequestedRematch = room.rematch.includes(user?._id);
  const opponentRequestedRematch = opponentSeat && room.rematch.includes(opponentSeat.userId);
  const winnerTitle =
    state.winner === DRAW ? "It's a draw" : state.winner === myColor ? "You win!" : `${names[state.winner] ?? PLAYER_LABELS[state.winner]} wins`;

  return (
    <Grid
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      bg={bg}
      borderRadius={10}
      p={{ base: 3, md: 6 }}
      templateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 1fr) 250px" }}
      gap={4}
    >
      <GridItem gridColumn="1 / -1" display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <HStack>
          <Text fontWeight="bold">Online game</Text>
          <Button size="sm" variant="outline" colorScheme="purple" leftIcon={<FaCopy />} onClick={copyCode}>
            {codeCopied ? "Copied!" : code}
          </Button>
        </HStack>
        <ButtonGroup size="sm">
          <Button leftIcon={<FaBook />} colorScheme="purple" variant="outline" onClick={rules.onOpen}>
            How to play
          </Button>
          <Button onClick={toggleMusic} colorScheme="purple" leftIcon={isMusicPlaying ? <MdMusicNote /> : <MdMusicOff />}>
            {isMusicPlaying ? "Pause Music" : "Play Music"}
          </Button>
        </ButtonGroup>
      </GridItem>

      {opponentSeat?.abandonDeadline && room.status === "playing" && (
        <GridItem gridColumn="1 / -1">
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            <AlertDescription>
              {opponentSeat.username} lost connection. They forfeit in{" "}
              {Math.max(0, Math.ceil((opponentSeat.abandonDeadline - now) / 1000))}s unless they come back.
            </AlertDescription>
          </Alert>
        </GridItem>
      )}

      <GridItem>
        <CompactStatus
          display={{ base: "flex", md: "none" }}
          mb={3}
          state={state}
          names={names}
          label={waiting ? "Waiting…" : myTurn ? "Your turn" : names[state.turn]}
          canEndChain={myTurn}
          onEndChain={() => send("game:action", { action: { type: "endChain" } })}
          clock={clock}
          hint={hint}
        />
        <Box display="flex" justifyContent="center" position="relative">
          <GameBoard
            state={state}
            onAction={(action) => !pending && send("game:action", { action })}
            canMove={myTurn && !pending}
            flipped={myColor === RED}
          />
          {waiting && (
            <VStack
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="whiteAlpha.900"
              color="gray.800"
              p={6}
              borderRadius="xl"
              boxShadow="2xl"
              spacing={3}
              maxW="90%"
            >
              <Spinner />
              {room.invited ? (
                <>
                  <Text fontWeight="bold" textAlign="center">
                    Waiting for {room.invited.username} to accept your challenge
                  </Text>
                  <Text fontSize="sm" textAlign="center">
                    The challenge expires after 2 minutes.
                  </Text>
                </>
              ) : (
                <>
                  <Text fontWeight="bold">Waiting for an opponent</Text>
                  <Text fontSize="sm" textAlign="center">
                    Share this code with a friend:
                  </Text>
                  <Heading letterSpacing="0.3em" size="xl">
                    {code}
                  </Heading>
                  <HStack>
                    <Button size="sm" leftIcon={<FaCopy />} onClick={copyCode}>
                      {codeCopied ? "Copied!" : "Copy code"}
                    </Button>
                    <Button size="sm" leftIcon={<FaLink />} onClick={copyLink}>
                      {linkCopied ? "Copied!" : "Copy link"}
                    </Button>
                  </HStack>
                </>
              )}
            </VStack>
          )}
        </Box>
      </GridItem>

      <GridItem>
        <VStack spacing={4}>
          <Box display={{ base: "none", md: "block" }} w="full">
            <ScoreCard state={state} names={names} extras={{ [RED]: presence(RED), [BLUE]: presence(BLUE) }} />
          </Box>
          <TurnCard
            display={{ base: "none", md: "flex" }}
            state={state}
            label={waiting ? "Waiting…" : myTurn ? "Your turn" : `${names[state.turn]}'s turn`}
            canEndChain={myTurn}
            onEndChain={() => send("game:action", { action: { type: "endChain" } })}
            clock={clock}
            hint={hint}
          />
          <PanelCard>
            <Text fontSize="sm" textAlign="center">
              You play{" "}
              <Text as="span" fontWeight="bold" color={myColor === RED ? "player.red" : "player.blue"}>
                {myColor ? PLAYER_LABELS[myColor] : "—"}
              </Text>
            </Text>
            {room.status === "playing" && (
              <CustomAlertDialog
                title="Resign this game?"
                trigger={(open) => (
                  <Button colorScheme="red" variant="outline" leftIcon={<FaFlag />} onClick={open} w="full">
                    Resign
                  </Button>
                )}
                footer={(close) => (
                  <ButtonGroup>
                    <Button onClick={close}>Keep playing</Button>
                    <Button
                      colorScheme="red"
                      onClick={() => {
                        close();
                        send("game:resign");
                      }}
                    >
                      Resign
                    </Button>
                  </ButtonGroup>
                )}
              >
                Your opponent will be declared the winner.
              </CustomAlertDialog>
            )}
            {room.status === "finished" && (
              <Button colorScheme="purple" leftIcon={<FaRedo />} onClick={gameOver.onOpen}>
                Result &amp; rematch
              </Button>
            )}
            <Button variant="outline" colorScheme="purple" leftIcon={<FaHome />} onClick={() => navigate("/")}>
              {waiting ? "Cancel game" : "Leave"}
            </Button>
          </PanelCard>
        </VStack>
      </GridItem>

      <GameOverModal
        state={state}
        isOpen={gameOver.isOpen && room.status === "finished"}
        onClose={gameOver.onClose}
        title={winnerTitle}
        celebrate={state.winner === myColor}
      >
        {rated?.changes?.[user?._id] && (
          <Text fontWeight="bold">
            Rating: {rated.changes[user._id].rating}{" "}
            <Text as="span" color={rated.changes[user._id].change >= 0 ? "green.600" : "red.600"}>
              ({rated.changes[user._id].change >= 0 ? "+" : ""}
              {rated.changes[user._id].change})
            </Text>
          </Text>
        )}
        {opponentRequestedRematch && !iRequestedRematch && (
          <Text fontWeight="bold">{opponentSeat.username} wants a rematch!</Text>
        )}
        <Button
          colorScheme="purple"
          size="lg"
          leftIcon={<FaRedo />}
          onClick={() => send("game:rematch")}
          isDisabled={iRequestedRematch || !opponentSeat?.connected}
        >
          {iRequestedRematch ? "Waiting for opponent…" : "Rematch"}
        </Button>
        {!opponentSeat?.connected && <Text fontSize="sm">Your opponent has left.</Text>}
        {rated?.gameId && (
          <Button variant="outline" colorScheme="purple" onClick={() => navigate(`/replay/${rated.gameId}`)}>
            Watch replay
          </Button>
        )}
        <Button variant="ghost" leftIcon={<FaHome />} onClick={() => navigate("/")}>
          Back to home
        </Button>
      </GameOverModal>
      <HowToPlayModal isOpen={rules.isOpen} onClose={rules.onClose} />
    </Grid>
  );
}
