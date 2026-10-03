import { Box, Button, Flex, Heading, HStack, Link, Text, useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink, NavLink, Outlet } from "react-router-dom";
import ThemeToggleButton from "../components/utils/ThemeToggleButton";

const LINKS = [
    { label: "Play", to: "/game?mode=ai" },
    { label: "Learn", to: "/learn" },
    { label: "About", to: "/about-us" },
];

/** Shell for visitors who aren't signed in: offline play, the tutorial and the about page. */
export default function GuestLayout() {
    const border = useColorModeValue("gray.100", "gray.700");
    return (
        <Flex direction="column" minH="100vh">
            <Flex as="nav" px={{ base: 3, md: 6 }} py={3} align="center" justify="space-between" borderBottomWidth="1px" borderColor={border} gap={2}>
                <HStack spacing={{ base: 3, md: 6 }}>
                    <Link as={RouterLink} to="/" _hover={{}}>
                        <Heading size="md">32 Beads</Heading>
                    </Link>
                    <HStack spacing={4} display={{ base: "none", md: "flex" }}>
                        {LINKS.map((l) => (
                            <Link key={l.to} as={NavLink} to={l.to} _activeLink={{ fontWeight: "bold" }}>
                                {l.label}
                            </Link>
                        ))}
                    </HStack>
                </HStack>
                <HStack spacing={2}>
                    <ThemeToggleButton />
                    <Button as={RouterLink} to="/login" variant="ghost" size="sm">
                        Log in
                    </Button>
                    <Button as={RouterLink} to="/register" colorScheme="purple" size="sm">
                        Sign up
                    </Button>
                </HStack>
            </Flex>
            <HStack spacing={5} justify="center" py={2} display={{ base: "flex", md: "none" }} borderBottomWidth="1px" borderColor={border}>
                {LINKS.map((l) => (
                    <Link key={l.to} as={NavLink} to={l.to} fontSize="sm" _activeLink={{ fontWeight: "bold" }}>
                        {l.label}
                    </Link>
                ))}
            </HStack>
            <Box as="main" flex="1" px={{ base: 2, md: 6 }} py={{ base: 3, md: 6 }}>
                <Outlet />
            </Box>
            <Text as="footer" textAlign="center" fontSize="xs" color="gray.500" py={4}>
                32 Beads · a traditional game from eastern India and Bangladesh
            </Text>
        </Flex>
    );
}
