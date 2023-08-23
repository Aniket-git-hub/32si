import './App.css'
import { Routes, Route, useRoutes, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Error404Page from './pages/Error404Page'
import ProtectedRoute from './components/ProtectedRoute'
function App() {
  // just for testing
  const isLoggedIn = false

  const routes = useRoutes([
    {
      path: '/',
      element: isLoggedIn ? <ProtectedRoute isSignedIn={isLoggedIn} /> : <Navigate to="/login" />,
      children: [
        { path: '/', element: <HomePage /> },
      ]
    },
    {
      path: '/login',
      element: !isLoggedIn ? <LoginPage/> : <Navigate to="/" /> ,
    }, 
    {
      path: '/register',
      element: !isLoggedIn ? <RegisterPage/> : <Navigate to="/" /> ,
    }, 
    {
      path: '*',
      element: <Error404Page /> ,
    }, 
  ])

  return routes
}

export default App
