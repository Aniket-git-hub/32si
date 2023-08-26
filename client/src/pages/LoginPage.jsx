import { useState } from "react";
import { loginUser } from "../api/auth";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {save, user:authenticatedUser, isAuthenticated} = useAuth()

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log({ email, password })
    try {
      const { user, accessToken, message } = await loginUser({ email, password })
      save(user, accessToken)
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      <div>
        
        <h2>{isAuthenticated}</h2>
        <h3>
          {authenticatedUser?.email}

        </h3>
        <form onSubmit={handleLogin} >
          <label htmlFor="email">Email
            <input type="email" onChange={(e) => setEmail(e.target.value)} id="email" />
          </label>
          <br></br>
          <label htmlFor="password">Password
            <input type="password" onChange={(e) => setPassword(e.target.value)} id="password" />
          </label>
          <br></br>
          <button type="submit" >Login</button>
        </form>
      </div>
    </>
  );
}