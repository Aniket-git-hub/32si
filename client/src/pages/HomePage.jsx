import { useAuth } from "../hooks/useAuth"

export default function HomePage() {
  const { user, isAuthenticated, remove } = useAuth()
  const {username, name, email} = user
  const handleLogout = () => {
    console.log(user, isAuthenticated)
    remove()
    console.log(user, isAuthenticated)

  }
  return (
    <>
      <h3>
    {isAuthenticated}

      </h3>
      <h2>{username}</h2>
      <h2>{name}</h2>
      <h2>{email}</h2>
      <button onClick={() => handleLogout()}>Logout</button>
      
    </>
  );
}