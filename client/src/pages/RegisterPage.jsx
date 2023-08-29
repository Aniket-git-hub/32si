import { registerUser } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { useFormValidation } from "../hooks/useFormValidation";
import { Link } from "react-router-dom";
import { useSanitizeValues } from "../hooks/useSanitizedValues";

export default function RegisterPage() {
  const initialState = {name:'', username:'', email:'', password:''}
  
  const { save } = useAuth()
  const register = async (event) => {
    try {
      const sanitizedValues = useSanitizeValues(values)
      const { user, accessToken, message } = await registerUser(sanitizedValues)
      alert(message)
      save(user, accessToken)
    } catch (error) {
      console.log(error)
    }
  }

  const {values, errors, handleChange, handleSubmit, isSubmitting} = useFormValidation(initialState, register)

  return (
    <section>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} >
        <label htmlFor="name">Name:
          <input type="text" name="name" value={values.name} onChange={handleChange} id="name" />
        </label>
        {errors.name && <p>{errors.name}</p>}
        <br></br>
        <label htmlFor="username">Username:
          <input type="text" name="username" value={values.username} onChange={handleChange} id="username" />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <br></br>
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
        <button type="submit" disabled={isSubmitting} >Register</button>
      </form>
        <Link to="/login">Login</Link>
    </section>
  )
}