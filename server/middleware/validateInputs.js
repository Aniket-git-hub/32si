import { body, validationResult } from 'express-validator'
/**
 * @type {Array}
 * Validation rules array for validation of register inputs filed.
 * - rules set for Email filed
 * - rules set for Password filed
 */
export const userRegistrationInputsValidationRules = [
    body('name')
        .isString().withMessage("name filed value should be string")
        .notEmpty().withMessage("Name is required")
        .isLength({ max: 12 }).withMessage("name filed max length is 12 characters")
        .trim(),
    
    body('username')
        .notEmpty().withMessage("Username is required")
        .isLength({ max: 10 }).withMessage("username filed max length is 15 characters")
        .isAlphanumeric().withMessage("Username should be alphanumeric")
        .trim(),
    
    body('email')
        .isEmail().withMessage("Invalid Email")
        .normalizeEmail()
        .trim(),
    
    body('password')
        .isString().withMessage("password must be string")
        .isLength({ max: 15, min: 8 }).withMessage("Password length must be >= 8 and <= 15 characters")
        .trim(),
]

/**
 * @type {Array}
 * Validation rules array for validation of login inputs filed.
 * - rules set for Email filed
 * - rules set for Password filed
 */
export const userLoginInputsValidationRules = [
    body('email')
        .isEmail().withMessage("Invalid Email")
        .normalizeEmail()
        .trim(),
    
    body('password')
        .isString().withMessage("password must be string")
        .notEmpty().withMessage("Password is required")
        .trim()
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
        let err = new Error("Validation Error")
        err.name = "ValidationError"
        err.errors = errors.array().map(obj => obj.msg)
        next(err)
    }
    next()
}
