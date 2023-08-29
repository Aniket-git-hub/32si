import { verifyOtp } from "../api/auth"
import { useFormValidation } from "../hooks/useFormValidation"
import { useNavigate } from 'react-router-dom'

export default function VerifyOtp({email}) {
    const initialState = { otp: '' }
    const navigate = useNavigate()
    
    const submit = async () => {
        try {
            const response = await verifyOtp({ ...values, email })
            console.log(response)
            navigate("/reset-password", { state: { email }, replace: true })
        } catch (error) {
            console.log(error)
        }
    }
    
    const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, submit)

    return (
        <section>
            <h3>Verify OTP</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="otp">OTP
                    <input type="number" name="otp" value={values.otp} onChange={handleChange} id="otp" />
                </label>
                {errors.otp && <p>{errors.otp}</p>}
                <br></br>
                <button type="submit" disabled={isSubmitting}>Verify OTP</button>
            </form>
        </section>
    )
}