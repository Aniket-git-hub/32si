import express, { Router, RequestHandler } from 'express';
const router: Router = express.Router();
import { getRoute } from '../utils/Helper';

import {
  inputValidation,
  userRegistrationInputsValidationRules as uRIV,
  userLoginInputsValidationRules as uLIV,
  forgotPasswordEmailValidationRules as fPEV,
  forgotPasswordOtpValidationRules as fPOV,
  resetPasswordValidationRules as rPV,
} from './../middleware/validateInputs';

import register from './../controllers/auth/userRegistration';
import login from './../controllers/auth/userLogin';
import verifyJWT from './../middleware/verifyJWT';
import refreshToken from './../controllers/auth/refreshToken';
import forgotPassword from './../controllers/auth/forgotPassword';
import forgotPasswordVerifyOtp from './../controllers/auth/forgotPasswordVerifyOtp';
import resetPassword from './../controllers/auth/resetPassword';
import logout from './../controllers/auth/userLogout';

router.post(getRoute('REGISTER_USER_ROUTE', '/register'), uRIV as RequestHandler[], inputValidation, register);
router.post(getRoute('LOGIN_USER_ROUTE', '/login'), uLIV as RequestHandler[], inputValidation, login);
router.post(getRoute('LOGOUT_USER_ROUTE', '/logout'), verifyJWT, logout);
router.post(getRoute('REFRESH_TOKEN_ROUTE', '/token/refresh'), verifyJWT, refreshToken);
router.post(
  getRoute('FORGOT_PASSWORD_ROUTE', '/forgot-password'),
  fPEV as RequestHandler[],
  inputValidation,
  forgotPassword,
);
router.post(
  getRoute('VERIFY_OTP_ROUTE', '/forgot-password/verify-otp'),
  fPOV as RequestHandler[],
  inputValidation,
  forgotPasswordVerifyOtp,
);
router.post(
  getRoute('RESET_PASSWORD_ROUTE', '/reset-password'),
  rPV as RequestHandler[],
  inputValidation,
  resetPassword,
);

export default router;
