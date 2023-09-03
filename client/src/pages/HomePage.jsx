import TopNavBar from "../components/TopNavBar";
import GameBoard from "../components/GameBoard";
import { Grid, GridItem, Center } from "@chakra-ui/react";
import LeftSidePanel from "../components/LeftSidePanel";
import RightSidePanel from "../components/RightSidePanel";

export default function HomePage() {
  return (
    <>
      <Grid templateColumns="repeat(10, 1fr)">
        <GridItem as="aside" colSpan={2} >
          <LeftSidePanel />
        </GridItem>
        <GridItem as="main" colSpan={8}>
          <TopNavBar />
          <Grid templateColumns="repeat(4, 1fr)">
            <GridItem colSpan={3} borderRadius={10} bg="bodyColor" p={6}>
              <Center>
                <GameBoard />
              </Center>
            </GridItem>
            <GridItem as="aside" colSpan={1} >
              <RightSidePanel />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
}
