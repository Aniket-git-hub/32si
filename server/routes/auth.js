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
import logout from "../controllers/auth/userLogout.js"

const getRoute = (productionRoute, developmentRoute) => process.env.NODE_ENV === 'production' ? process.env[productionRoute] : developmentRoute

router.post(getRoute('REGISTER_USER_ROUTE', '/register'), uRIV, inputValidation, register)
router.post(getRoute('LOGIN_USER_ROUTE', '/login'), uLIV, inputValidation, login)
router.post(getRoute('LOGOUT_USER_ROUTE', '/logout'), verifyJWT, logout)
router.post(getRoute('REFRESH_TOKEN_ROUTE', '/token/refresh'), verifyJWT, refreshToken)
router.post(getRoute('FORGOT_PASSWORD_ROUTE', '/forgot-password'), fPEV, inputValidation, forgotPassword)
router.post(getRoute('VERIFY_OTP_ROUTE', '/forgot-password/verify-otp'), fPOV, inputValidation, forgotPasswordVerifyOtp)
router.post(getRoute('RESET_PASSWORD_ROUTE', '/reset-password'), rPV, inputValidation, resetPassword)

export default router
