import { useFormValidation } from "../hooks/useFormValidation";

export default function ResetPasswordPage() {
    const initialState = { password: '', cpassword: '' }

    const savePassword = async () => {
        try {
            console.log(values)
        } catch (error) {
            console.log(error)
        }
    }

    const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormValidation(initialState, savePassword)

    return (
        <>
            <section>
                <h2>Set New Password</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="password"> New Password:
                        <input type="text" name="password" value={values.password} onChange={handleChange} id="password" />
                    </label>
                    {errors.password && <p>{errors.password}</p>}
                    <br></br>
                    <label htmlFor="cpassword">Confirm Password:
                        <input type="text" name="cpassword" value={values.cpassword} onChange={handleChange} id="cpassword" />
                    </label>
                    {errors.cpassword && <p>{errors.cpassword}</p>}
                    <br></br>
                    <button type="submit" disabled={isSubmitting}>Save Password</button>
                </form>
            </section>
        </>
    )
}