import express from "express"
import verifyJWT from "../middleware/verifyJWT.js"
import getAUser from "../controllers/user/getAUser.js"
import updateUser from "../controllers/user/updateUser.js"
import deleteUser from "../controllers/user/deleteUser.js"
import getAllUser from "../controllers/user/getAllUser.js"
import connectUser from "../controllers/user/connectUser.js"
import disconnectUser from "../controllers/user/disconnectUser.js"
import acceptConnection from "../controllers/user/acceptConnection.js"

const router = express.Router()

const getRoute = (productionRoute, developmentRoute) => process.env.NODE_ENV === 'production' ? process.env[productionRoute] : developmentRoute

router.get(getRoute('GET_USER_ROUTE', '/a/:username'), verifyJWT, getAUser)
router.put(getRoute('UPDATE_USER_ROUTE', '/'), verifyJWT, updateUser)
router.delete(getRoute('DELETE_USER_ROUTE', '/'), verifyJWT, deleteUser)
router.get(getRoute('GET_ALL_USER_ROUTE', '/users'),verifyJWT, getAllUser)
router.post(getRoute('CONNECT_USER_ROUTE', '/:userId/connect'), verifyJWT, connectUser)
router.post(getRoute('ACCEPT_USER_ROUTE', '/:userId/accept'), verifyJWT, acceptConnection)
router.delete(getRoute('DISCONNECT_USER_ROUTE', '/:userId/disconnect'), verifyJWT, disconnectUser)

export default router
