import express from "express"
const router = express.Router()
import {
    inputValidation,
    userRegistrationInputsValidationRules as uRIV,
    userLoginInputsValidationRules as uLIV
} from '../middleware/validateInputs.js'
import register from "../controllers/auth/userRegistration.js"
import login from "../controllers/auth/userLogin.js"
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

export default router