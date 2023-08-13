import express from "express"
const router = express.Router()
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import User from "../models/user.js"
router.post("/register", async (req, res) => {
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
        
        const { password, ...rest} = savedUser._doc
        res.status(201).json({
            message: "New User Created Successfully",
            token,
            user: rest
        })
    } catch (error) {
        console.log(error.message)
    }
})


export default router