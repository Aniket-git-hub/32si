import { useFormValidation } from "../hooks/useFormValidation"

export default function VerifyOtp({email}) {
    const initialState = { otp: '' }
    const submit = () => {
        console.log({...values, email})
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