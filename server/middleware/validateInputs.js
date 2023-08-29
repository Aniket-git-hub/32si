import { body, validationResult } from 'express-validator'
import createError from '../utils/createError.js'

// Common validation rules
const commonRules = {
    name: [
        body('name')
            .isString().withMessage("Oops! The name should be a string.")
            .notEmpty().withMessage("Oh no! You forgot to enter your name.")
            .isLength({ max: 12 }).withMessage("Hold on! Your name should be no more than 12 characters.")
            .trim(),
    ],
    email: [
        body('email')
            .isEmail().withMessage("Hmm... That doesn't look like a valid email.")
            .normalizeEmail()
            .trim(),
    ],
    password: [
        body('password')
            .isString().withMessage("Uh-oh! Your password should be a string.")
            .trim(),
    ],
}

/**
 * @type {Array}
 * Validation rules array for validation of register inputs filed.
 * - rules set for Email filed
 * - rules set for Password filed
 */

export const userRegistrationInputsValidationRules = [
    ...commonRules.name,
    body('username')
        .notEmpty().withMessage("Oops! You forgot to enter your username.")
        .isLength({ max: 10 }).withMessage("Hold on! Your username should be no more than 15 characters.")
        .isAlphanumeric().withMessage("Hmm... Your username should only contain letters and numbers.")
        .trim(),
    ...commonRules.email,
    ...commonRules.password,
    body('password')
        .isLength({ max: 15, min: 8 }).withMessage("Uh-oh! Your password should be between 8 and 15 characters."),
]

/**
 * @type {Array}
 * Validation rules array for validation of login inputs filed.
 * - rules set for Email filed
 * - rules set for Password filed
 */

export const userLoginInputsValidationRules = [
    ...commonRules.email,
    ...commonRules.password,
    body('password')
        .notEmpty().withMessage("Oops! You forgot to enter your password."),
]


export const forgotPasswordEmailValidationRules = [
    ...commonRules.email
]

export const forgotPasswordOtpValidationRules = [
    ...commonRules.email,
    body('otp')
        .isNumeric().withMessage('OTP should only contain numbers')
        .isLength({ min: 6, max: 6 }).withMessage('OTP should be 6 digits long')
        
]

export const resetPasswordValidationRules = [
    ...commonRules.email,
    ...commonRules.password
]


/**
 * @description Checks if validation result has any error and if so then returns status 400 error to the client for 
 * bad request as the data sent to the server failed validation. else next() middleware is called
 * @param {Request} req Express.js Request Object
 * @param {Response} res Express.js Response Object
 * @param {Function} next Next Middleware Function
 * @returns {Response} Response to client 
 */

export function inputValidation(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let err = createError("ValidationError", "Validation Error")
        err.errors = errors.array().map(obj => obj.msg)
        next(err)
    }
    next()
}
