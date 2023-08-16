import { body, validationResult } from 'express-validator'
const inputValidationRules = [
    body('name').notEmpty().withMessage("Name is required").trim(),
    body('username').notEmpty().withMessage("username is required").
        isAlphanumeric().withMessage("username must be alphanumeric").trim(),
    body('email').notEmpty().withMessage("Email is required").isEmail().
        withMessage("Invalid Email").normalizeEmail().trim(),
    body('password').notEmpty().withMessage("Password is required").
        isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
]

function inputValidation(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next()
}

export default { inputValidationRules, inputValidation }