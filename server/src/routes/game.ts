import express, { Router } from 'express';
import createGame from '../controllers/game/createGame';
import verifyJWT from '../middleware/verifyJWT';

const router: Router = express.Router();

router.post("/create-game", verifyJWT, createGame);
router.delete("/delete-game/:gameLobbyId", verifyJWT, createGame);

export default router;
