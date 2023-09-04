import TopNavBar from "../components/TopNavBar";
import { Grid, GridItem, Center } from "@chakra-ui/react";
import LeftSidePanel from "../components/LeftSidePanel";
import RightSidePanel from "../components/RightSidePanel";
import { Outlet } from "react-router-dom"

export default function RootLayout() {
    return (
        <>
            <Grid templateColumns="repeat(10, 1fr)">
                <GridItem as="aside" colSpan={2} >
                    <LeftSidePanel />
                </GridItem>
                <GridItem as="main" colSpan={8}>
                    <TopNavBar />
                    <Grid templateColumns="repeat(4, 1fr)">
                        <GridItem colSpan={3} >
                            <Outlet />
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