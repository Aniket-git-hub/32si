import { Center } from "@chakra-ui/react";
import GameBoard from "../../components/GameBoard";
export default function HomePage() {
  return (
    <Center bg="bodyColor" borderRadius={10} p={6}>
      <GameBoard />
    </Center>
  );
}
