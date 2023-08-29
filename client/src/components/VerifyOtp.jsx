import { useFormValidation } from "../hooks/useFormValidation"
import { useNavigate } from 'react-router-dom'
export default function VerifyOtp({email}) {
    const initialState = { otp: '' }
    const navigate = useNavigate()
    
    const submit = () => {
        console.log({ ...values, email })
        navigate("/reset-password")
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