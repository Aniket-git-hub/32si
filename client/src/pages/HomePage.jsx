import TopNavBar from "../components/TopNavBar";
import GameBoard from "../components/GameBoard";
import { Grid, GridItem, Center } from "@chakra-ui/react";

export default function HomePage() {
  return (
    <>
      <Grid templateColumns="repeat(10, 1fr)" bg="gray.50">
        <GridItem as="aside" colSpan={2} bg="purple.400" minHeight="100vh">
          <span>hello</span>
        </GridItem>
        <GridItem as="main" colSpan={8}>
          <TopNavBar />
          <Grid templateColumns="repeat(4, 1fr)">
            <GridItem colSpan={3} bg="bodyColor" p={6}>
              <Center>
                <GameBoard />
              </Center>
            </GridItem>
            <GridItem as="aside" colSpan={1} bg="purple.400" minHeight="100vh">
              <span>hello</span>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
}
