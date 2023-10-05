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
import uploadProfilePicture from '../middleware/uploadProfilePicture';
import deleteProfilePicture from '../controllers/user/deleteProfilePicture';
import streamProfilePicture from '../controllers/user/streamProfilePIcture';
import uploadProfilePictureController from '../controllers/user/uploadProfilePicture';
import { getRoute } from '../utils/Helper';
import StreamProfilePictureSmall from '../controllers/user/StreamProfilePictureSmall';
import { feedbackValidationRules, inputValidation } from '../middleware/validateInputs';
import postApplicationFeedback from '../controllers/user/applicationFeedback';
import searchUsers from '../controllers/user/searchUsers';
import deleteUserRequest from '../controllers/user/deleteUserRequest';
import cancelAccountDeletion from '../controllers/user/cancelDeletionRequest';

const router: Router = express.Router();

router.get(getRoute('GET_USER_BY_USERNAME_ROUTE', '/by-username/:username'), verifyJWT, getAUser);
router.get(getRoute('GET_USER_BY_USER_ID_ROUTE', '/by-id/:userId'), verifyJWT, getAUserById);
router.put(getRoute('UPDATE_USER_ROUTE', '/'), verifyJWT, updateUser);
router.delete(getRoute('DELETE_USER_REQUEST_ROUTE', '/'), verifyJWT, deleteUserRequest);
router.post(`${getRoute('DELETE_USER_ROUTE', '/delete-user/')}:token`, deleteUser)
router.post(`${getRoute('CANCEL_DELETE_USER_ROUTE', '/cancel-delete-user/')}:token`, cancelAccountDeletion)
router.get(getRoute('GET_ALL_USER_ROUTE', '/users'), verifyJWT, getAllUser);
router.post(getRoute('CONNECT_USER_ROUTE', '/:username/connect'), verifyJWT, connectUser);
router.post(getRoute('ACCEPT_USER_ROUTE', '/:userId/accept'), verifyJWT, acceptConnection);
router.delete(getRoute('DISCONNECT_USER_ROUTE', '/:userId/disconnect'), verifyJWT, disconnectUser);
router.post(
  getRoute('UPLOAD_PROFILE_PICTURE_ROUTE', '/upload-profile-picture'),
  verifyJWT,
  uploadProfilePicture,
  uploadProfilePictureController,
);
router.delete(
  getRoute('DELETE_PROFILE_PICTURE_ROUTE', '/delete-profile-picture/:filename'),
  verifyJWT,
  deleteProfilePicture,
);
router.get(getRoute('GET_PROFILE_PICTURE_ROUTE', '/get-profile-picture/:filename'), streamProfilePicture);
router.get(
  getRoute('GET_PROFILE_PICTURE_ROUTE_SMALL', '/get-profile-picture-small/:filename'),
  StreamProfilePictureSmall,
);
//feedback
router.post(
  getRoute('APP_FEEDBACK_ROUTE', '/feedback'),
  verifyJWT,
  feedbackValidationRules,
  inputValidation,
  postApplicationFeedback,
);

router.get('/users/search', verifyJWT, searchUsers);

export default router;
