import {
    AvatarBadge,
    Box,
    Button,
    Center,
    Divider,
    Flex,
    HStack,
    IconButton,
    Input,
    Spinner,
    Text,
    useColorModeValue,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { GiCrossedSwords } from "react-icons/gi";
import { VscSend } from "react-icons/vsc";
import { useNavigate, useParams } from "react-router-dom";
import { getChatHistory, getProfilePicture, getSmallProfilePicture } from "../../api/user";
import AvatarWithPreview from "../../components/utils/AvatarWithPreview";
import { useAllData } from "../../hooks/useAllData";
import { useAuth } from "../../hooks/useAuth";
import useChallenge from "../../hooks/useChallenge";
import useSocket from "../../hooks/useSocket";

const MAX_LENGTH = 1000;

const dayLabel = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86_400_000);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};
const timeLabel = (date) => new Date(date).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

function ChatPage() {
    const { username } = useParams();
    const { user } = useAuth();
    const { socket } = useSocket();
    const navigate = useNavigate();
    const toast = useToast();
    const { onlineFriends, setUnreadMessages, setOpenChatWith } = useAllData();
    const { challenge, pendingId } = useChallenge();
    const friend = user.friends?.find((f) => f.username === username) ?? null;

    const [messages, setMessages] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const listRef = useRef(null);
    const stickToBottom = useRef(true);

    const mine = useColorModeValue("purple.500", "purple.400");
    const theirs = useColorModeValue("gray.100", "gray.700");
    const theirsText = useColorModeValue("gray.800", "gray.100");

    const friendId = friend?._id;

    const load = useCallback(
        async (before) => {
            if (!friendId) return;
            setLoading(true);
            setLoadError(false);
            try {
                const res = await getChatHistory({ userId: friendId, before });
                setHasMore(res.data.hasMore);
                setMessages((prev) => (before ? [...res.data.messages, ...prev] : res.data.messages));
                setUnreadMessages((prev) => ({ ...prev, [friendId]: 0 }));
            } catch {
                setLoadError(true);
            } finally {
                setLoading(false);
            }
        },
        [friendId, setUnreadMessages]
    );

    // Load the conversation and mark it as the open chat (its messages count as read).
    useEffect(() => {
        setMessages([]);
        stickToBottom.current = true;
        load();
        setOpenChatWith(friendId ?? null);
        return () => setOpenChatWith(null);
    }, [friendId, load, setOpenChatWith]);

    // Live messages for this conversation only.
    useEffect(() => {
        if (!socket || !friendId) return;
        const onMessage = (message) => {
            const from = String(message.from);
            const to = String(message.to);
            if (!((from === friendId && to === user._id) || (from === user._id && to === friendId))) return;
            setMessages((prev) => (prev.some((m) => m._id === message._id) ? prev : [...prev, message]));
            if (from === friendId) socket.emit("chat:read", { from: friendId });
        };
        socket.on("chat:message", onMessage);
        return () => socket.off("chat:message", onMessage);
    }, [socket, friendId, user._id]);

    // Keep the newest message in view unless the user scrolled up to read older ones.
    useLayoutEffect(() => {
        const el = listRef.current;
        if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
    }, [messages]);

    const send = () => {
        const body = text.trim();
        if (!body || sending || !socket) return;
        setSending(true);
        stickToBottom.current = true;
        socket.emit("chat:send", { to: friendId, text: body }, (res) => {
            setSending(false);
            if (res?.ok) {
                setText("");
                setMessages((prev) => (prev.some((m) => m._id === res.message._id) ? prev : [...prev, res.message]));
            } else {
                toast({ title: res?.error ?? "Message not sent.", status: "error", position: "top", duration: 3000 });
            }
        });
    };

    if (!friend) {
        return (
            <Center py={16}>
                <VStack spacing={3} textAlign="center" px={4}>
                    <Text fontWeight="bold">You can only chat with your allies.</Text>
                    <Text color="gray.500">Connect with @{username} from their profile first.</Text>
                    <Button colorScheme="purple" variant="outline" onClick={() => navigate(`/profile/@${username}`)}>
                        View profile
                    </Button>
                </VStack>
            </Center>
        );
    }

    let lastDay = null;
    return (
        <Flex direction="column" maxW="720px" mx="auto" h={{ base: "calc(100vh - 160px)", lg: "calc(100vh - 90px)" }} py={2}>
            <HStack justify="space-between" px={1}>
                <HStack cursor="pointer" onClick={() => navigate(`/profile/@${friend.username}`)}>
                    <AvatarWithPreview
                        size="sm"
                        name={friend.name ?? friend.username}
                        smallURL={getSmallProfilePicture(friend.profilePhoto)}
                        largeURL={getProfilePicture(friend.profilePhoto)}
                    >
                        {onlineFriends?.includes(friend._id) && (
                            <AvatarBadge boxSize="1.25em" bg="green.500" title={`${friend.username} is online`} />
                        )}
                    </AvatarWithPreview>
                    <VStack spacing={0} align="start">
                        <Text fontWeight="bold">{friend.username}</Text>
                        <Text fontSize="xs" color="gray.500">
                            {onlineFriends?.includes(friend._id) ? "Online" : "Offline. They'll see your messages later"}
                        </Text>
                    </VStack>
                </HStack>
                <Button
                    size="sm"
                    colorScheme="purple"
                    leftIcon={<GiCrossedSwords />}
                    isLoading={pendingId === friend._id}
                    isDisabled={!onlineFriends?.includes(friend._id)}
                    title={onlineFriends?.includes(friend._id) ? undefined : `${friend.username} is offline`}
                    onClick={() => challenge(friend._id)}
                >
                    Challenge
                </Button>
            </HStack>
            <Divider my={2} />

            <Box
                ref={listRef}
                flex={1}
                overflowY="auto"
                px={2}
                onScroll={(e) => {
                    const el = e.currentTarget;
                    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
                }}
            >
                {hasMore && (
                    <Center my={2}>
                        <Button
                            size="xs"
                            variant="ghost"
                            isLoading={loading}
                            onClick={() => {
                                stickToBottom.current = false;
                                load(messages[0]?.createdAt);
                            }}
                        >
                            Load earlier messages
                        </Button>
                    </Center>
                )}
                {loading && messages.length === 0 && (
                    <Center py={10}>
                        <Spinner />
                    </Center>
                )}
                {loadError && (
                    <Center py={6} flexDirection="column" gap={2}>
                        <Text>Couldn&apos;t load messages.</Text>
                        <Button size="sm" onClick={() => load()}>
                            Try again
                        </Button>
                    </Center>
                )}
                {!loading && !loadError && messages.length === 0 && (
                    <Center py={10}>
                        <Text color="gray.500">No messages yet. Say hi to {friend.username}!</Text>
                    </Center>
                )}
                {messages.map((m) => {
                    const fromMe = String(m.from) === user._id;
                    const day = dayLabel(m.createdAt);
                    const showDay = day !== lastDay;
                    lastDay = day;
                    return (
                        <Fragment key={m._id}>
                            {showDay && (
                                <Center my={3}>
                                    <Text fontSize="xs" color="gray.500">
                                        {day}
                                    </Text>
                                </Center>
                            )}
                            <Flex justify={fromMe ? "flex-end" : "flex-start"} my={1}>
                                <Box
                                    maxW="75%"
                                    bg={fromMe ? mine : theirs}
                                    color={fromMe ? "white" : theirsText}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    borderBottomRightRadius={fromMe ? "sm" : "lg"}
                                    borderBottomLeftRadius={fromMe ? "lg" : "sm"}
                                >
                                    <Text whiteSpace="pre-wrap" wordBreak="break-word">
                                        {m.text}
                                    </Text>
                                    <Text fontSize="10px" opacity={0.75} textAlign="right" mt={1}>
                                        {timeLabel(m.createdAt)}
                                    </Text>
                                </Box>
                            </Flex>
                        </Fragment>
                    );
                })}
            </Box>

            <HStack pt={2}>
                <Input
                    placeholder={`Message ${friend.username}`}
                    value={text}
                    maxLength={MAX_LENGTH}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            send();
                        }
                    }}
                />
                <IconButton
                    aria-label="Send"
                    icon={<VscSend />}
                    colorScheme="purple"
                    onClick={send}
                    isLoading={sending}
                    isDisabled={!text.trim()}
                />
            </HStack>
        </Flex>
    );
}

export default ChatPage;
