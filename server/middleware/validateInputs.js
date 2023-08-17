import { body, validationResult } from 'express-validator'
/**
 * @type {Array}
 * Validation rules array for validation of register inputs filed.
 * - rules set for Email filed
 * - rules set for Password filed
 */
export const userRegistrationInputsValidationRules = [
    body('name').notEmpty().withMessage("Name is required")
    .isLength({max:10, min:3}).withMessage("Name should be in between 10 and 3 characters").trim() ,
    body('username').notEmpty().withMessage("Username is required")
        .isLength({ max: 10, min: 3 }).withMessage("Username should be in between 10 and 3 characters")
        .isAlphanumeric().withMessage("Username should be alphanumeric").trim(),
    body('email').isEmail().withMessage("Invalid Email").normalizeEmail().trim() ,
    body('password').isLength({max:15, min:8}).withMessage("Password should be atleast 8 characters and less than 15").trim() ,
]

/**
 * @type {Array}
 * Validation rules array for validation of login inputs filed.
 * - rules set for Email filed
 * - rules set for Password filed
 */
export const userLoginInputsValidationRules = [
    body('email').isEmail().withMessage("Invalid Email").normalizeEmail().trim(),
    body('password').notEmpty().withMessage("Password is required").trim()
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
        return res.status(400).json({
            errors:errors.array()
        })
    }
    next()
}
