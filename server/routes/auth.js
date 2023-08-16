import express from "express"
const router = express.Router()
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import User from "../models/user.js"
import validateInputs from "../middleware/validateInputs.js"

/**
 * Defining /register route 
 * Handles POST request to create new user or register as in the route
 */
router.post("/register", validateInputs.inputValidationRules, validateInputs.inputValidation, async (req, res, next) => {
    const { name, username, email, password } = req.body
    const newUser = new User({
        name,
        username,
        email,
        password: bcrypt.hashSync(password, 12)
    })
    try {
        const savedUser = await newUser.save()
        const token = jwt.sign({
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            username: savedUser.username
        }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' })
        
        const { password, ...rest } = savedUser._doc
        res.status(201).json({
            message: "New User Created Successfully",
            token,
            user: rest
        })
    } catch (error) {
        next(error)
    }
})


export default router