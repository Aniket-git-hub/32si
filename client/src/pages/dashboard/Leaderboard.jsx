import {
  Alert,
  AlertIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  Link,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { getLeaderboard } from "../../api/game";
import { getSmallProfilePicture } from "../../api/user";
import { useAuth } from "../../hooks/useAuth";

const MEDALS = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function Leaderboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const cardBg = useColorModeValue("white", "gray.700");
  const meBg = useColorModeValue("purple.50", "whiteAlpha.100");

  useEffect(() => {
    const controller = new AbortController();
    getLeaderboard(controller.signal)
      .then((res) => setData(res.data))
      .catch((err) => err.code !== "ERR_CANCELED" && setError(true));
    return () => controller.abort();
  }, []);

  const me = data?.me;
  const meInTop = data?.players.some((p) => p._id === user?._id);

  return (
    <VStack spacing={5} align="stretch" maxW="800px" mx="auto" py={{ base: 2, md: 4 }}>
      <Box>
        <Heading size="lg">Leaderboard</Heading>
        <Text color="gray.500">
          Ratings go up when you win online games and down when you lose. Beating a stronger player earns more.
        </Text>
      </Box>

      {me && (
        <Card bg={cardBg}>
          <CardBody>
            <HStack justify="space-between" flexWrap="wrap" gap={3}>
              <VStack align="start" spacing={0}>
                <Text color="gray.500" fontSize="sm">
                  Your rating
                </Text>
                <Heading size="xl">{me.rating ?? 1200}</Heading>
                <Text fontSize="sm" color="gray.500">
                  {me.ratedGames ? `Peak ${me.peakRating} · ${me.ratedGames} rated games` : "Play a rated online game to get ranked."}
                </Text>
              </VStack>
              {me.rank ? (
                <VStack spacing={0}>
                  <Text color="gray.500" fontSize="sm">
                    Rank
                  </Text>
                  <Heading size="xl">#{me.rank}</Heading>
                </VStack>
              ) : (
                <Button colorScheme="purple" onClick={() => navigate("/")}>
                  Play online
                </Button>
              )}
            </HStack>
          </CardBody>
        </Card>
      )}

      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          Couldn&apos;t load the leaderboard.
        </Alert>
      )}
      {!error && !data && <Skeleton h="300px" borderRadius="xl" />}
      {data && data.players.length === 0 && (
        <Text color="gray.500" textAlign="center" py={8}>
          No rated games yet. Win one to top the board!
        </Text>
      )}
      {data && data.players.length > 0 && (
        <Card bg={cardBg}>
          <CardBody px={{ base: 1, md: 5 }}>
            <TableContainer>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th isNumeric w="60px">
                      #
                    </Th>
                    <Th>Player</Th>
                    <Th isNumeric>Rating</Th>
                    <Th isNumeric display={{ base: "none", sm: "table-cell" }}>
                      Games
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.players.map((p) => (
                    <Tr key={p._id} bg={p._id === user?._id ? meBg : undefined}>
                      <Td isNumeric fontWeight="bold">
                        {MEDALS[p.rank] ?? p.rank}
                      </Td>
                      <Td>
                        <HStack>
                          <Avatar
                            size="xs"
                            name={p.username}
                            src={p.profilePhoto ? getSmallProfilePicture(p.profilePhoto) : undefined}
                          />
                          <Link as={RouterLink} to={`/profile/@${p.username}`} fontWeight="medium">
                            {p.username}
                          </Link>
                          {p._id === user?._id && <Badge colorScheme="purple">you</Badge>}
                        </HStack>
                      </Td>
                      <Td isNumeric fontWeight="bold">
                        {p.rating}
                      </Td>
                      <Td isNumeric display={{ base: "none", sm: "table-cell" }}>
                        {p.ratedGames}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            {me?.rank && !meInTop && (
              <Text textAlign="center" fontSize="sm" color="gray.500" mt={3}>
                You are #{me.rank} with {me.rating}.
              </Text>
            )}
          </CardBody>
        </Card>
      )}
    </VStack>
  );
}
