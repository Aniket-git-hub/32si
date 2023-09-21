import { Request, Response, NextFunction } from 'express';
import OTP from "../../models/otp.ts"
import bcrypt from "bcryptjs"

interface Otp {
    otp: string;
    email: string;
}

/**
 * @description  controller to verify the OTP for password reset.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function forgotPasswordVerifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
        const { otp, email }: Otp = req.body
        const savedOtp = await OTP.findOne({ email })
        if (!savedOtp || !bcrypt.compareSync(String(otp), savedOtp.otp)) {
            let err = new Error("Invalid Otp")
            err.name = "InvalidOTP"
            throw err
        }
        await OTP.deleteOne({ email })
        res.json({
            message: "OTP verified."
        })
    } catch (error) {
        next(error)
    }
}

export default forgotPasswordVerifyOtp
