import { Box, Button, HStack, Text, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { GiCrossedSwords } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import challengeSound from '../../assets/sounds/newGame.wav';
import useSocket from '../../hooks/useSocket';

/** Shows incoming challenges anywhere in the app, with Accept / Decline. */
export default function ChallengeListener() {
    const { socket } = useSocket();
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket) return;
        const onChallenged = ({ code, from }) => {
            if (toast.isActive(code)) return;
            new Audio(challengeSound).play().catch(() => {});
            toast({
                id: code,
                position: 'top-right',
                duration: null,
                render: ({ onClose }) => (
                    <Box bg="purple.600" color="white" p={4} borderRadius="lg" boxShadow="2xl">
                        <HStack mb={3}>
                            <GiCrossedSwords size={22} />
                            <Text fontWeight="bold">{from.username} challenged you to a game!</Text>
                        </HStack>
                        <HStack justify="flex-end">
                            <Button
                                size="sm"
                                variant="ghost"
                                color="white"
                                _hover={{ bg: 'whiteAlpha.300' }}
                                onClick={() => {
                                    socket.emit('game:declineChallenge', { code });
                                    onClose();
                                }}
                            >
                                Decline
                            </Button>
                            <Button
                                size="sm"
                                colorScheme="green"
                                onClick={() => {
                                    onClose();
                                    navigate(`/game/online/${code}`);
                                }}
                            >
                                Accept
                            </Button>
                        </HStack>
                    </Box>
                ),
            });
        };
        const onCancelled = ({ code, reason }) => {
            if (!toast.isActive(code)) return;
            toast.close(code);
            toast({ title: 'Challenge withdrawn', description: reason, status: 'info', position: 'top-right', duration: 4000 });
        };
        socket.on('game:challenged', onChallenged);
        socket.on('game:challengeCancelled', onCancelled);
        return () => {
            socket.off('game:challenged', onChallenged);
            socket.off('game:challengeCancelled', onCancelled);
        };
    }, [socket, toast, navigate]);

    return null;
}
