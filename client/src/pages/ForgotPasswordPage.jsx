import { useState, useEffect } from "react"
import { useFormValidation } from "../hooks/useFormValidation"
import VerifyOtp from "../components/VerifyOtp"
import { useAuth } from "../hooks/useAuth"
import { forgotPassword } from "../api/auth"

export default function ForgotPasswordPage() {
    const initialState = { email: '' }
    const { verifyOTP, setVerifyOTP } = useAuth()
    const [countdown, setCountdown] = useState(120)
    
    const submit = async () => {
        try {
            const response = await forgotPassword(values)
            setVerifyOTP(true)
            setCountdown(120)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
    const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, submit)

    useEffect(() => {
        if (verifyOTP && countdown > 0) {
            const timerId = setTimeout(() => {
                setCountdown(countdown - 1)
            }, 1000)
            return () => clearTimeout(timerId)
        } else if (countdown === 0) {
            setVerifyOTP(false)
        }
    }, [verifyOTP, countdown])

    return (
        <section>
            <h3>Password Reset</h3>
            <div className={verifyOTP ? 'disabled' : ''}>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email
                        <input type="email" name="email" value={values.email} onChange={handleChange} id="email" />
                    </label>
                    {errors.email && <p>{errors.email}</p>}
                    <br></br>
                    <button type="submit" disabled={isSubmitting}>{verifyOTP ? `Resend OTP (${countdown})` : 'Send OTP'}</button>
                </form>
            </div>
            {verifyOTP && <VerifyOtp email={values.email} />}
        </section>
    )
}
