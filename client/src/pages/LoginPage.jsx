import { loginUser } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { useFormValidation } from "../hooks/useFormValidation";
import { Link } from 'react-router-dom'
import { useSanitizeValues } from "../hooks/useSanitizedValues";

export default function LoginPage() {
  const initialState = { email: '', password: '' }
  
  const { save } = useAuth()
  const login = async () => {
    try {
      const sanitizedValues = useSanitizeValues(values) 
      const { user, accessToken } = await loginUser(sanitizedValues)
      save(user, accessToken)
    } catch (error) {
      console.log(error)
    }
  }

  const {values, errors, handleChange, handleSubmit, isSubmitting} = useFormValidation(initialState, login)
  
  return (
    <>
      <section>
        <h2>32 Beads Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email
            <input type="email" name="email" value={values.email} onChange={handleChange} id="email" />
          </label>
          {errors.email && <p>{errors.email}</p>}
          <br></br>
          <label htmlFor="password">Password
            <input type="password" name="password" value={values.password} onChange={handleChange} id="password" />
          </label>
          {errors.password && <p>{errors.password}</p>}
          <br></br>
          <button type="submit" disabled={isSubmitting}>Login</button>
        </form>
        <Link to="/register">Register</Link>
      </section>
    </>
  );
}