import express, { Router } from 'express';
import verifyJWT from '../middleware/verifyJWT';
import getAUser from '../controllers/user/getAUser';
import updateUser from '../controllers/user/updateUser';
import deleteUser from '../controllers/user/deleteUser';
import getAllUser from '../controllers/user/getAllUser';
import connectUser from '../controllers/user/connectUser';
import disconnectUser from '../controllers/user/disconnectUser';
import acceptConnection from '../controllers/user/acceptConnection';
import getAUserById from '../controllers/user/getAUserById';

const router: Router = express.Router();

const getRoute = (productionRoute: string, developmentRoute: string): string =>
  process.env.NODE_ENV === 'production' ? process.env[productionRoute]! : developmentRoute;

router.get(getRoute('GET_USER_ROUTE', '/by-username/:username'), verifyJWT, getAUser);
router.get(getRoute('GET_USER_ROUTE', '/by-id/:userId'), verifyJWT, getAUserById);
router.put(getRoute('UPDATE_USER_ROUTE', '/'), verifyJWT, updateUser);
router.delete(getRoute('DELETE_USER_ROUTE', '/'), verifyJWT, deleteUser);
router.get(getRoute('GET_ALL_USER_ROUTE', '/users'), verifyJWT, getAllUser);
router.post(getRoute('CONNECT_USER_ROUTE', '/:username/connect'), verifyJWT, connectUser);
router.post(getRoute('ACCEPT_USER_ROUTE', '/:userId/accept'), verifyJWT, acceptConnection);
router.delete(getRoute('DISCONNECT_USER_ROUTE', '/:userId/disconnect'), verifyJWT, disconnectUser);

export default router;
