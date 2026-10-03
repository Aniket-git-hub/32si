import { Box, Button, HStack, Text, useToast } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUnreadCounts } from "../../api/user";
import { useAllData } from "../../hooks/useAllData";
import { useAuth } from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";

/** Keeps unread chat counts up to date anywhere in the app and announces new messages. */
export default function ChatListener() {
    const { socket } = useSocket();
    const { user } = useAuth();
    const { setUnreadMessages, openChatWith } = useAllData();
    const toast = useToast();
    const navigate = useNavigate();
    const openChat = useRef(openChatWith);
    openChat.current = openChatWith;

    useEffect(() => {
        const controller = new AbortController();
        getUnreadCounts(controller.signal)
            .then((res) => setUnreadMessages(res.data.unread ?? {}))
            .catch(() => {});
        return () => controller.abort();
    }, [setUnreadMessages]);

    useEffect(() => {
        if (!socket || !user) return;
        const onMessage = (message) => {
            const from = String(message.from);
            if (from === user._id || from === openChat.current) return;
            setUnreadMessages((prev) => ({ ...prev, [from]: (prev[from] ?? 0) + 1 }));
            const friend = user.friends?.find((f) => f._id === from);
            if (!friend) return;
            const id = `chat-${from}`;
            if (toast.isActive(id)) toast.close(id);
            toast({
                id,
                position: "top-right",
                duration: 5000,
                render: ({ onClose }) => (
                    <Box bg="purple.600" color="white" p={3} borderRadius="lg" boxShadow="xl" maxW="320px">
                        <Text fontWeight="bold">{friend.username}</Text>
                        <Text fontSize="sm" noOfLines={2}>
                            {message.text}
                        </Text>
                        <HStack justify="flex-end" mt={2}>
                            <Button size="xs" variant="ghost" color="white" _hover={{ bg: "whiteAlpha.300" }} onClick={onClose}>
                                Dismiss
                            </Button>
                            <Button
                                size="xs"
                                bg="white"
                                color="purple.700"
                                onClick={() => {
                                    onClose();
                                    navigate(`/chat/${friend.username}`);
                                }}
                            >
                                Open chat
                            </Button>
                        </HStack>
                    </Box>
                ),
            });
        };
        socket.on("chat:message", onMessage);
        return () => socket.off("chat:message", onMessage);
    }, [socket, user, setUnreadMessages, toast, navigate]);

    return null;
}
