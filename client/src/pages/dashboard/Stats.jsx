import {
  Alert,
  AlertIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Skeleton,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaGlobe, FaPlay, FaRobot } from "react-icons/fa";
import { GiCrossedSwords } from "react-icons/gi";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { getGameStats } from "../../api/game";
import { getSmallProfilePicture } from "../../api/user";
import { DIFFICULTIES } from "../../game/ai";
import { loadAiRecord, loadLocalReplays } from "../../game/localRecord";
import useChallenge from "../../hooks/useChallenge";

const OUTCOME = {
  win: { label: "Win", color: "green" },
  loss: { label: "Loss", color: "red" },
  draw: { label: "Draw", color: "gray" },
};

const REASON = {
  "captured-all": "Captured every bead",
  blocked: "No moves left",
  "no-captures": "50 turns without a capture",
  resigned: "Resigned",
  abandoned: "Left the game",
  timeout: "Ran out of time",
};

const describeReason = (row) => {
  const text = REASON[row.reason] ?? "";
  if (row.reason === "resigned" || row.reason === "abandoned" || row.reason === "timeout") {
    return row.outcome === "win" ? `Opponent ${text.toLowerCase()}` : `You ${text.toLowerCase()}`;
  }
  return text;
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

const StatTile = ({ label, value, help }) => {
  const bg = useColorModeValue("white", "gray.700");
  return (
    <Card bg={bg} boxShadow="md" borderRadius="xl">
      <CardBody py={4}>
        <Stat>
          <StatLabel color="gray.500">{label}</StatLabel>
          <StatNumber fontSize="2xl">{value}</StatNumber>
          {help && <StatHelpText mb={0}>{help}</StatHelpText>}
        </Stat>
      </CardBody>
    </Card>
  );
};

/** Wins / draws / losses as one segmented bar, labelled in text so colour is never the only cue. */
const ResultsBar = ({ wins, draws, losses }) => {
  const total = wins + draws + losses;
  const surface = useColorModeValue("white", "gray.800");
  if (!total) return null;
  const parts = [
    { key: "win", label: wins === 1 ? "win" : "wins", value: wins, color: "green.500" },
    { key: "draw", label: draws === 1 ? "draw" : "draws", value: draws, color: "gray.400" },
    { key: "loss", label: losses === 1 ? "loss" : "losses", value: losses, color: "red.500" },
  ].filter((p) => p.value > 0);
  return (
    <Box>
      <Flex h="14px" borderRadius="full" overflow="hidden" gap="2px" bg={surface} role="img" aria-label={`${wins} wins, ${draws} draws, ${losses} losses`}>
        {parts.map((p) => (
          <Tooltip key={p.key} label={`${p.value} ${p.label} (${Math.round((p.value / total) * 100)}%)`} hasArrow>
            <Box flexGrow={p.value} bg={p.color} />
          </Tooltip>
        ))}
      </Flex>
      <HStack spacing={4} mt={2} fontSize="sm" color="gray.500" flexWrap="wrap">
        {parts.map((p) => (
          <HStack key={p.key} spacing={1}>
            <Box w="10px" h="10px" borderRadius="sm" bg={p.color} />
            <Text>
              {p.value} {p.label}
            </Text>
          </HStack>
        ))}
      </HStack>
    </Box>
  );
};

const Section = ({ title, icon, children, action }) => {
  const bg = useColorModeValue("white", "gray.700");
  return (
    <Card bg={bg} boxShadow="md" borderRadius="xl" w="full">
      <CardBody>
        <Flex justify="space-between" align="center" mb={4} gap={2} flexWrap="wrap">
          <Heading size="md" display="flex" alignItems="center" gap={2}>
            {icon}
            {title}
          </Heading>
          {action}
        </Flex>
        {children}
      </CardBody>
    </Card>
  );
};

const OpponentCell = ({ opponent }) =>
  opponent?.username && opponent.username !== "Deleted player" ? (
    <HStack>
      <Avatar size="xs" name={opponent.username} src={opponent.profilePhoto ? getSmallProfilePicture(opponent.profilePhoto) : undefined} />
      <Link as={RouterLink} to={`/profile/@${opponent.username}`} fontWeight="medium">
        {opponent.username}
      </Link>
    </HStack>
  ) : (
    <Text color="gray.500">{opponent?.username ?? "Unknown"}</Text>
  );

export default function Stats() {
  const navigate = useNavigate();
  const { challenge, pendingId } = useChallenge();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [aiRecord] = useState(loadAiRecord);
  const [localReplays] = useState(loadLocalReplays);

  useEffect(() => {
    const controller = new AbortController();
    getGameStats({ limit: 20 }, controller.signal)
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.code !== "ERR_CANCELED") setError("Couldn't load your online stats. Please try again later.");
      });
    return () => controller.abort();
  }, []);

  const stats = data?.stats;
  const rating = data?.rating;
  const history = data?.history ?? [];
  const streak = stats?.currentStreak;
  const aiLevels = Object.keys(DIFFICULTIES).filter((level) => aiRecord[level]);

  return (
    <VStack spacing={6} align="stretch" p={{ base: 2, md: 4 }}>
      <Heading size="lg">Your stats</Heading>

      <Section title="Online games" icon={<FaGlobe />}>
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}
        {!error && !stats && (
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} h="90px" borderRadius="xl" />
            ))}
          </SimpleGrid>
        )}
        {stats && stats.played === 0 && (
          <VStack py={6} spacing={3}>
            <Text>You haven&apos;t finished an online game yet.</Text>
            <Text fontSize="sm" color="gray.500">
              Wins, losses and your record against each rival will show up here.
            </Text>
            <Button colorScheme="purple" onClick={() => navigate("/")}>
              Play online
            </Button>
          </VStack>
        )}
        {stats && stats.played > 0 && (
          <VStack spacing={5} align="stretch">
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              {rating && (
                <StatTile
                  label="Rating"
                  value={rating.rating}
                  help={rating.ratedGames ? `Peak ${rating.peakRating}` : "Unrated"}
                />
              )}
              <StatTile label="Games played" value={stats.played} help={`~${stats.averageMoves} moves per game`} />
              <StatTile label="Win rate" value={`${stats.winRate}%`} help={`${stats.wins} W · ${stats.draws} D · ${stats.losses} L`} />
              <StatTile
                label="Current streak"
                value={streak.length}
                help={streak.outcome ? `${OUTCOME[streak.outcome].label}${streak.length === 1 ? "" : streak.outcome === "loss" ? "es" : "s"}` : "—"}
              />
              <StatTile label="Best win streak" value={stats.bestWinStreak} />
              <StatTile label="Beads captured" value={stats.beadsCaptured} help={`${stats.beadsLost} lost`} />
              <StatTile label="Wipeouts" value={stats.wipeouts} help="Won by capturing all 16" />
            </SimpleGrid>
            <ResultsBar wins={stats.wins} draws={stats.draws} losses={stats.losses} />
          </VStack>
        )}
      </Section>

      {history.length > 0 && (
        <Section title="Recent games">
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Opponent</Th>
                  <Th>You played</Th>
                  <Th>Result</Th>
                  <Th isNumeric>Captured</Th>
                  <Th isNumeric>Rating</Th>
                  <Th>How it ended</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {history.map((row) => (
                  <Tr key={row.id}>
                    <Td>{formatDate(row.endTime)}</Td>
                    <Td>
                      <OpponentCell opponent={row.opponent} />
                    </Td>
                    <Td>
                      <Badge colorScheme={row.color === "red" ? "red" : "blue"} variant="outline">
                        {row.color}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={OUTCOME[row.outcome].color}>{OUTCOME[row.outcome].label}</Badge>
                    </Td>
                    <Td isNumeric>
                      {row.captured} – {row.lost}
                    </Td>
                    <Td isNumeric color={row.ratingChange > 0 ? "green.500" : row.ratingChange < 0 ? "red.500" : "gray.500"}>
                      {row.ratingChange === null ? "–" : `${row.ratingChange > 0 ? "+" : ""}${row.ratingChange}`}
                    </Td>
                    <Td color="gray.500">{describeReason(row)}</Td>
                    <Td>
                      {row.hasReplay && (
                        <Button size="xs" variant="ghost" colorScheme="purple" leftIcon={<FaPlay />} onClick={() => navigate(`/replay/${row.id}`)}>
                          Watch
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Section>
      )}

      {stats?.opponents.length > 0 && (
        <Section title="Head to head" icon={<GiCrossedSwords />}>
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Rival</Th>
                  <Th isNumeric>Played</Th>
                  <Th isNumeric>Won</Th>
                  <Th isNumeric>Drawn</Th>
                  <Th isNumeric>Lost</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {stats.opponents.map((h) => (
                  <Tr key={h.opponent._id}>
                    <Td>
                      <OpponentCell opponent={h.opponent} />
                    </Td>
                    <Td isNumeric>{h.played}</Td>
                    <Td isNumeric>{h.wins}</Td>
                    <Td isNumeric>{h.draws}</Td>
                    <Td isNumeric>{h.losses}</Td>
                    <Td textAlign="right">
                      {h.opponent.username !== "Deleted player" && (
                        <Button
                          size="xs"
                          colorScheme="purple"
                          variant="outline"
                          leftIcon={<GiCrossedSwords />}
                          isLoading={pendingId === h.opponent._id}
                          onClick={() => challenge(h.opponent._id)}
                        >
                          Rematch
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Section>
      )}

      <Section
        title="vs Computer"
        icon={<FaRobot />}
        action={
          <Button size="sm" colorScheme="purple" variant="outline" onClick={() => navigate("/game?mode=ai")}>
            Play the computer
          </Button>
        }
      >
        {aiLevels.length === 0 ? (
          <Text color="gray.500">No games against the computer yet (games are remembered on this device).</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {aiLevels.map((level) => {
              const r = aiRecord[level];
              return (
                <Box key={level}>
                  <Text fontWeight="bold" mb={2}>
                    {DIFFICULTIES[level].label}
                  </Text>
                  <ResultsBar wins={r.wins} draws={r.draws} losses={r.losses} />
                </Box>
              );
            })}
          </SimpleGrid>
        )}
        {localReplays.length > 0 && (
          <Box mt={5}>
            <Text fontWeight="bold" mb={2}>
              Replays on this device
            </Text>
            <VStack align="stretch" spacing={1}>
              {localReplays.slice(0, 8).map((r) => (
                <HStack key={r.id} justify="space-between">
                  <Text fontSize="sm">
                    {formatDate(r.at)} · {r.mode === "ai" ? `vs ${DIFFICULTIES[r.level]?.label ?? ""} computer` : "Pass & play"} ·{" "}
                    {r.result === "draw" ? "Draw" : `${(r.result === "red" ? r.red : r.blue).username} won`}
                  </Text>
                  <Button size="xs" variant="ghost" colorScheme="purple" leftIcon={<FaPlay />} onClick={() => navigate(`/replay/local/${r.id}`)}>
                    Watch
                  </Button>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}
      </Section>
    </VStack>
  );
}
