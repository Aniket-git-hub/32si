import { useToast } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSocket from './useSocket';

/** Challenge another player to an online game. Opens the game page while waiting for them to accept. */
export default function useChallenge() {
    const { socket } = useSocket();
    const navigate = useNavigate();
    const toast = useToast();
    const [pendingId, setPendingId] = useState(null);

    const challenge = useCallback(
        (userId) => {
            if (!socket?.connected) {
                toast({ title: 'Not connected to the server yet.', status: 'error', position: 'top', duration: 3000 });
                return;
            }
            setPendingId(userId);
            socket.emit('game:challenge', { userId }, (res) => {
                setPendingId(null);
                if (res?.ok) navigate(`/game/online/${res.code}`);
                else toast({ title: res?.error ?? 'Could not send the challenge.', status: 'error', position: 'top', duration: 3000 });
            });
        },
        [socket, navigate, toast]
    );

    return { challenge, pendingId };
}
