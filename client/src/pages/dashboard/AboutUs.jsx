import { Box, Button, Card, CardBody, Heading, HStack, Link, ListItem, OrderedList, Text, useColorModeValue, useDisclosure, VStack } from "@chakra-ui/react";
import { FaBook, FaGithub, FaRobot } from "react-icons/fa";
import { MdOutlineFeedback } from "react-icons/md";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { HowToPlayModal } from "../../components/game/GamePanels";

export default function AboutUs() {
  const navigate = useNavigate();
  const rules = useDisclosure();
  const cardBg = useColorModeValue("white", "gray.700");

  return (
    <VStack spacing={6} align="stretch" maxW="800px" mx="auto" py={{ base: 2, md: 6 }}>
      <Box>
        <Heading size="xl" mb={2}>
          About 32 Beads
        </Heading>
        <Text fontSize="lg" color="gray.500">
          A traditional strategy game from eastern India, now playable online.
        </Text>
      </Box>

      <Card bg={cardBg}>
        <CardBody>
          <VStack align="stretch" spacing={3}>
            <Heading size="md">The game</Heading>
            <Text>
              32 Beads, also known as Sholo Guti (&ldquo;sixteen soldiers&rdquo;), is a traditional game from eastern
              India and Bangladesh, often played on a board drawn on the ground with pebbles or seeds as pieces. Two
              players each command 16 beads on a board of 37 points: a square of 25 points with a triangle on either
              side.
            </Text>
            <Text>
              The rules fit in a sentence, but the game rewards planning: move along the lines, jump over enemy beads to
              capture them, chain captures together, and either take all of your opponent&apos;s beads or leave them
              with nowhere to move.
            </Text>
            <HStack flexWrap="wrap">
              <Button leftIcon={<FaBook />} colorScheme="purple" variant="outline" onClick={rules.onOpen}>
                Read the rules
              </Button>
              <Button leftIcon={<FaRobot />} colorScheme="purple" onClick={() => navigate("/game?mode=ai")}>
                Practise against the computer
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      <Card bg={cardBg}>
        <CardBody>
          <VStack align="stretch" spacing={3}>
            <Heading size="md">What you can do here</Heading>
            <OrderedList spacing={1} pl={2}>
              <ListItem>Play the computer on three difficulty levels.</ListItem>
              <ListItem>Pass the device back and forth with a friend sitting next to you.</ListItem>
              <ListItem>Play online with a share code, challenge your allies, or get matched with a random opponent.</ListItem>
              <ListItem>Track your record, streaks and head-to-head results on the Stats page.</ListItem>
            </OrderedList>
          </VStack>
        </CardBody>
      </Card>

      <Card bg={cardBg}>
        <CardBody>
          <VStack align="stretch" spacing={3}>
            <Heading size="md">The project</Heading>
            <Text>
              32 Beads is an independent, open-source project built with React, Node.js, Socket.IO and MongoDB. Ideas,
              bug reports and contributions are very welcome.
            </Text>
            <HStack flexWrap="wrap">
              <Button as={RouterLink} to="/feedback" leftIcon={<MdOutlineFeedback />} colorScheme="purple" variant="outline">
                Send feedback
              </Button>
              <Button as={Link} href="https://github.com/Aniket-git-hub/32si" isExternal leftIcon={<FaGithub />} variant="outline" _hover={{ textDecoration: "none" }}>
                Source on GitHub
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      <HowToPlayModal isOpen={rules.isOpen} onClose={rules.onClose} />
    </VStack>
  );
}
