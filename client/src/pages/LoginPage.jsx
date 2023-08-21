import { useState } from "react";
import { loginUser } from "../api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log({ email, password })
    try {
      const user = await loginUser({ email, password })
      console.log(user)
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      <div>
        <h2>Login</h2>
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