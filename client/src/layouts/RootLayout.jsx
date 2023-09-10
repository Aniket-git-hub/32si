import TopNavBar from "../components/dashboard/TopNavBar";
import { Grid, GridItem, Center } from "@chakra-ui/react";
import LeftSidePanel from "../components/dashboard/LeftSidePanel";
import RightSidePanel from "../components/dashboard/RightSidePanel";
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
                        <GridItem colSpan={3} h={{ lg: "90vh" }} overflowY={"scroll"} sx={
                            {
                                '::-webkit-scrollbar': {
                                    display: 'none'
                                }
                            }
                        }>
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
