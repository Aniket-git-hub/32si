import express from "express"
import verifyJWT from "../middleware/verifyJWT.js"
import getAUser from "../controllers/user/getAUser.js"
import updateUser from "../controllers/user/updateUser.js"
import deleteUser from "../controllers/user/deleteUser.js"
import getAllUser from "../controllers/user/getAllUser.js"
import connectUser from "../controllers/user/connectUser.js"
import disconnectUser from "../controllers/user/disconnectUser.js"
const router = express.Router()

// get a user
const getAUserRoute = process.env.NODE_ENV === 'production' ? process.env.GET_USER_ROUTE : "/a/:userId"
router.get(getAUserRoute, verifyJWT, getAUser)

// update a user
const updateUserRoute = process.env.NODE_ENV === 'production' ? process.env.UPDATE_USER_ROUTE : "/"
router.put(updateUserRoute, verifyJWT, updateUser)

// delete a user
const deleteUserRoute = process.env.NODE_ENV === 'production' ? process.env.DELETE_USER_ROUTE : "/"
router.delete(deleteUserRoute, verifyJWT, deleteUser)

// get all users
const getAllUserRoute = process.env.NODE_ENV === 'production' ? process.env.GET_ALL_USER_ROUTE : "/users"
router.get(getAllUserRoute, getAllUser)

// connect to a user
const connectUserRoute = process.env.NODE_ENV === 'production' ? process.env.CONNECT_USER_ROUTE : "/:id/connect"
router.post(connectUserRoute, verifyJWT, connectUser)

// connect to a user
const disconnectUserRoute = process.env.NODE_ENV === 'production' ? process.env.DISCONNECT_USER_ROUTE : "/:id/disconnect"
router.delete(disconnectUserRoute, verifyJWT, disconnectUser)


export default router