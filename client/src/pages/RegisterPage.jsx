import { useState } from "react";
import { registerUser } from "../api/auth";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {save} = useAuth()

  const handleRegistration = async (event) => {
    event.preventDefault()
    

    try {
      const { user, accessToken, message } = await registerUser({ name, username, email, password })
      alert(message)
      save(user, accessToken)
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegistration} >
        <label htmlFor="name">Name:
          <input type="text" onChange={(e) => setName(e.target.value)} id="name" />
        </label>
        <br></br>
        <label htmlFor="username">Username:
          <input type="text" onChange={(e) => setUsername(e.target.value)} id="username" />
        </label>
        <br></br>
        <label htmlFor="email">Email
          <input type="email" onChange={(e) => setEmail(e.target.value)} id="email" />
        </label>
        <br></br>
        <label htmlFor="password">Password
          <input type="password" onChange={(e) => setPassword(e.target.value)} id="password" />
        </label>
        <br></br>
        <button type="submit" >Register</button>
      </form>
    </div>
  );
}