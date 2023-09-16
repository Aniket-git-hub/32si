import { Center } from "@chakra-ui/react";
import GameBoard from "../../components/game/GameBoard";
import { useAuth } from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";
import { useEffect } from 'react';

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
    <Center bg="bodyColor" borderRadius={10} p={6}>
      <GameBoard />
    </Center>
  )
}
