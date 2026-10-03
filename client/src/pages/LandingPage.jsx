import { Box, Button, Card, CardBody, Heading, SimpleGrid, Stack, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { FaBook, FaGlobe, FaRobot, FaTrophy, FaUsers } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import GameBoard from "../components/game/GameBoard";
import { useGameBackground } from "../components/game/GamePanels";
import { createInitialState } from "../game/engine";

const START = createInitialState();

const FEATURES = [
    { icon: FaRobot, title: "Play the computer", text: "Three difficulty levels, from friendly to genuinely tough." },
    { icon: FaUsers, title: "Pass & play", text: "Share one phone or laptop with a friend sitting next to you." },
    { icon: FaGlobe, title: "Play online", text: "Invite friends with a code, challenge your allies, or get a random match." },
    { icon: FaTrophy, title: "Climb the ranks", text: "Rated games, a leaderboard, stats and replays of your online games." },
];

/** Home page for visitors who aren't signed in. */
export default function LandingPage() {
    const bg = useGameBackground();
    const cardBg = useColorModeValue("white", "gray.700");
    return (
        <VStack spacing={10} maxW="1100px" mx="auto">
            <Stack direction={{ base: "column", md: "row" }} align="center" spacing={{ base: 6, md: 12 }} bg={bg} borderRadius="2xl" p={{ base: 5, md: 10 }} w="full">
                <VStack align={{ base: "center", md: "start" }} textAlign={{ base: "center", md: "left" }} spacing={4} flex={1}>
                    <Heading size="2xl">32 Beads</Heading>
                    <Text fontSize="xl">
                        Sholo Guti, the classic strategy game: jump, capture and outwit your opponent.
                    </Text>
                    <Stack direction={{ base: "column", sm: "row" }} spacing={3} w={{ base: "full", sm: "auto" }}>
                        <Button as={RouterLink} to="/game?mode=ai" size="lg" colorScheme="purple" leftIcon={<FaRobot />}>
                            Play now, no sign-up
                        </Button>
                        <Button as={RouterLink} to="/learn" size="lg" variant="outline" colorScheme="purple" leftIcon={<FaBook />}>
                            Learn in 2 minutes
                        </Button>
                    </Stack>
                    <Text fontSize="sm">
                        Want to play friends online?{" "}
                        <Button as={RouterLink} to="/register" variant="link" colorScheme="purple">
                            Create a free account
                        </Button>
                    </Text>
                </VStack>
                <Box w={{ base: "70%", md: "320px" }} flexShrink={0} pointerEvents="none" aria-hidden>
                    <GameBoard state={START} onAction={() => {}} canMove={false} hints={{ moveHints: false, captureHints: false }} />
                </Box>
            </Stack>

            <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} w="full">
                {FEATURES.map(({ icon: Icon, title, text }) => (
                    <Card key={title} bg={cardBg}>
                        <CardBody>
                            <Icon size={24} />
                            <Heading size="sm" mt={3} mb={1}>
                                {title}
                            </Heading>
                            <Text fontSize="sm" color="gray.500">
                                {text}
                            </Text>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>
        </VStack>
    );
}
