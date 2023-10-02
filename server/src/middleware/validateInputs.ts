import { body, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import CustomError from '../utils/createError';

// Common validation rules
const commonRules = {
  name: [
    body('name')
      .isString()
      .withMessage('Oops! The name should be a string.')
      .notEmpty()
      .withMessage('Oh no! You forgot to enter your name.')
      .isLength({ max: 25 })
      .withMessage('Hold on! Your name should be no more than 12 characters.')
      .trim(),
  ],
  email: [body('email').isEmail().withMessage("Hmm... That doesn't look like a valid email.").normalizeEmail().trim()],
  password: [body('password').isString().withMessage('Uh-oh! Your password should be a string.').trim()],
};

export const userRegistrationInputsValidationRules = [
  ...commonRules.name,
  body('username')
    .notEmpty()
    .withMessage('Oops! You forgot to enter your username.')
    .isLength({ max: 25 })
    .withMessage('Hold on! Your username should be no more than 25 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Hmm... Your username should only contain letters, numbers, and underscores.')
    .trim(),
  ...commonRules.email,
  ...commonRules.password,
  body('password')
    .isLength({ max: 15, min: 8 })
    .withMessage('Uh-oh! Your password should be between 8 and 15 characters.'),
];

export const userLoginInputsValidationRules = [
  ...commonRules.email,
  ...commonRules.password,
  body('password').notEmpty().withMessage('Oops! You forgot to enter your password.'),
];

export const forgotPasswordEmailValidationRules = [...commonRules.email];

export const forgotPasswordOtpValidationRules = [
  ...commonRules.email,
  body('otp')
    .isString()
    .withMessage('OTP should be string')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP should be 6 digits long'),
];

export const resetPasswordValidationRules = [...commonRules.email, ...commonRules.password];

export const feedbackValidationRules = [
  ...commonRules.email,
  ...commonRules.name,
  body('message').isLength({ min: 5 }).withMessage('Message must be at least 5 characters long'),
];

/**
 * @description Checks if validation result has any error and if so then returns status 400 error to the client for
 * bad request as the data sent to the server failed validation. else next() middleware is called
 * @param {Request} req Express.js Request Object
 * @param {Response} res Express.js Response Object
 * @param {NextFunction} next Next Middleware Function
 */

export function inputValidation(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new CustomError('ValidationError', 'Validation Error');
    err.errors = errors.array().map((obj) => obj.msg);
    next(err);
  }
  next();
}
