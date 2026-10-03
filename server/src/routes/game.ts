import express, { Router } from 'express';
import createGame from '../controllers/game/createGame';
import deleteGame from '../controllers/game/deleteGame';
import verifyJWT from '../middleware/verifyJWT';

const router: Router = express.Router();

router.post("/create-game", verifyJWT, createGame);
router.delete("/delete-game/:gameLobbyId", verifyJWT, deleteGame);

export default router;
