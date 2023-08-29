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
router.post("/register", uRIV, inputValidation, register)
/**
 * Defining /login route 
 * Handles POST request to login the user 
 */
router.post("/login", uLIV, inputValidation, login)

router.post("/token/refresh", verifyJWT, refreshToken)

router.post("/forgot-password", fPEV, inputValidation, forgotPassword)

router.post("/forgot-password/verify-otp", fPOV, inputValidation, forgotPasswordVerifyOtp)

router.post("/reset-password", rPV, inputValidation, resetPassword)

export default router