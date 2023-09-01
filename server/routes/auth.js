import express from "express"
const router = express.Router()
import {
    inputValidation,
    userRegistrationInputsValidationRules as uRIV,
    userLoginInputsValidationRules as uLIV,
    forgotPasswordEmailValidationRules as fPEV,
    forgotPasswordOtpValidationRules as fPOV,
    resetPasswordValidationRules as rPV
} from '../middleware/validateInputs.js'
import register from "../controllers/auth/userRegistration.js"
import login from "../controllers/auth/userLogin.js"
import verifyJWT from "../middleware/verifyJWT.js"
import refreshToken from "../controllers/auth/refreshToken.js"
import forgotPassword from "../controllers/auth/forgotPassword.js"
import forgotPasswordVerifyOtp from "../controllers/auth/forgotPasswordVerifyOtp.js"
import resetPassword from "../controllers/auth/resetPassword.js"
/**
 * Defining /register route 
 * Handles POST request to create new user or register as in the route
 */
const registerRoute = process.env.NODE_ENV === 'production' ? process.env.REGISTER_USER_ROUTE : "/register" 
router.post(registerRoute, uRIV, inputValidation, register)
/**
 * Defining /login route 
 * Handles POST request to login the user 
 */
const loginRoute = process.env.NODE_ENV === 'production' ? process.env.LOGIN_USER_ROUTE : "/login" 
router.post(loginRoute, uLIV, inputValidation, login)

const refreshTokenRoute = process.env.NODE_ENV === 'production' ? process.env.REFRESH_TOKEN_ROUTE : "/token/refresh" 
router.post(refreshTokenRoute, verifyJWT, refreshToken)

const forgotPasswordRoute = process.env.NODE_ENV === 'production' ? process.env.FORGOT_PASSWORD_ROUTE : "/forgot-password" 
router.post(forgotPasswordRoute, fPEV, inputValidation, forgotPassword)

const verifyOTPRoute = process.env.NODE_ENV === 'production' ? process.env.VERIFY_OTP_ROUTE : "/forgot-password/verify-otp" 
router.post(verifyOTPRoute, fPOV, inputValidation, forgotPasswordVerifyOtp)

const resetPasswordRoute = process.env.NODE_ENV === 'production' ? process.env.RESET_PASSWORD_ROUTE : "/reset-password" 
router.post(resetPasswordRoute, rPV, inputValidation, resetPassword)

export default router