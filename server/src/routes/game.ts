import express, { Router } from 'express';
import createGame from '../controllers/game/createGame';
import deleteGame from '../controllers/game/deleteGame';
import getLeaderboard from '../controllers/game/getLeaderboard';
import getOverview from '../controllers/game/getOverview';
import getReplay from '../controllers/game/getReplay';
import getStats from '../controllers/game/getStats';
import verifyJWT from '../middleware/verifyJWT';

const router: Router = express.Router();

router.post('/create-game', verifyJWT, createGame);
router.delete('/delete-game/:gameLobbyId', verifyJWT, deleteGame);
router.get('/stats', verifyJWT, getStats);
router.get('/overview', verifyJWT, getOverview);
router.get('/leaderboard', verifyJWT, getLeaderboard);
router.get('/replay/:gameId', verifyJWT, getReplay);

export default router;
