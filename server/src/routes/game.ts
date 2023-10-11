import express, { Router } from 'express';
import getAGame from '../controllers/game/getAGame';
import verifyJWT from '../middleware/verifyJWT';

const router: Router = express.Router();

router.get("/", verifyJWT, getAGame);

export default router;
