import express from "express"
import verifyJWT from "../middleware/verifyJWT"
import getAGame from "../controllers/game/getAGame"

const router = express.Router()

// get a game
const getAGameRoute = process.env.NODE_ENV === 'production' ? process.env.GET_A_GAME : "/"
router.get(getAGameRoute, verifyJWT, getAGame)



export default router