import {
    Box,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    Flex,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/dashboard/BottomNav";
import LeftSidePanel from "../components/dashboard/LeftSidePanel";
import RightSidePanel from "../components/dashboard/RightSidePanel";
import TopNavBar from "../components/dashboard/TopNavBar";
import ChallengeListener from "../components/game/ChallengeListener";

/**
 * App shell.
 *  - lg and up: menu sidebar on the left; the allies panel on the right from xl up.
 *  - below lg: the menu opens from a hamburger button and a tab bar sits at the bottom of the screen.
 *  - below xl: allies open in a drawer from the top bar / tab bar.
 */
export default function RootLayout() {
    const menu = useDisclosure();
    const allies = useDisclosure();
    const { pathname } = useLocation();
    const border = useColorModeValue("gray.100", "gray.700");
    const drawerBg = useColorModeValue("white", "gray.800");

    // Close drawers after navigating.
    useEffect(() => {
        menu.onClose();
        allies.onClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <>
            <ChallengeListener />
            <Flex minH="100vh">
                <Box
                    as="aside"
                    display={{ base: "none", lg: "block" }}
                    w="240px"
                    flexShrink={0}
                    position="sticky"
                    top={0}
                    h="100vh"
                    overflowY="auto"
                    borderRightWidth="1px"
                    borderColor={border}
                >
                    <LeftSidePanel />
                </Box>

                <Flex direction="column" flex="1" minW={0}>
                    <TopNavBar onOpenMenu={menu.onOpen} onOpenAllies={allies.onOpen} />
                    <Box as="main" flex="1" px={{ base: 2, md: 4 }} pb={{ base: "88px", lg: 6 }}>
                        <Outlet />
                    </Box>
                </Flex>

                <Box
                    as="aside"
                    display={{ base: "none", xl: "block" }}
                    w="280px"
                    flexShrink={0}
                    position="sticky"
                    top={0}
                    h="100vh"
                    overflowY="auto"
                    borderLeftWidth="1px"
                    borderColor={border}
                >
                    <RightSidePanel />
                </Box>
            </Flex>

            <BottomNav onOpenAllies={allies.onOpen} />

            <Drawer isOpen={menu.isOpen} onClose={menu.onClose} placement="left">
                <DrawerOverlay />
                <DrawerContent bg={drawerBg} maxW="280px">
                    <DrawerCloseButton />
                    <DrawerBody p={0}>
                        <LeftSidePanel />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            <Drawer isOpen={allies.isOpen} onClose={allies.onClose} placement="right">
                <DrawerOverlay />
                <DrawerContent bg={drawerBg} maxW="320px">
                    <DrawerCloseButton />
                    <DrawerBody p={0} pt={8}>
                        <RightSidePanel />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
