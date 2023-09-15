import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Error404Page from './pages/auth/Error404Page';
import { useAuth } from './hooks/useAuth';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import Settings from './pages/dashboard/Settings';
import Stats from './pages/dashboard/Stats';
import Feedback from './pages/dashboard/Feedback';
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/dashboard/HomePage';
import AboutUs from './pages/dashboard/AboutUs';
import Profile from './pages/dashboard/Profile';
import Rivals from './pages/dashboard/Rivals';
import { useAllData } from './hooks/useAllData';
import { useEffect } from 'react';
import useSocket from './hooks/useSocket'

function App() {
  const { user, isAuthenticated, verifyOTP } = useAuth()
  const { setOnlineFriends, setNotifications } = useAllData()
  const { socket } = useSocket()

  useEffect(() => {
    if (socket != null && user != null) {
      socket.emit("userConnected", user._id, user.friends.map(f => f._id))
      socket.on("friendsOnline", (data) => setOnlineFriends(data))
      socket.on("friendConnected", (data) => setOnlineFriends(prev => [...prev, data]))
      socket.on("friendDisconnected", (data) => setOnlineFriends(prev => prev.filter(f => f !== data)))
      socket.on("connectionRequest", ({ message, userFrom }) => {
        setNotifications(prev => [...prev, {
          key: userFrom.username,
          message,
        }])
      })
      socket.on("connectionRequestAccepted", ({ message, userFrom }) => {
        setNotifications(prev => [...prev, {
          key: userFrom.username,
          message,
        }])
        console.log(userFrom)
      })
    }
  }, [socket])


  return (
    <Routes>
      <Route path="/" exact element={isAuthenticated ? <RootLayout /> : <Navigate replace to="/login" />}>
        <Route index element={<HomePage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="stats" element={<Stats />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="rivals" element={<Rivals />} />
        <Route path="profile/:username" element={<Profile />} />
        <Route path="*" element={<Error404Page />} />
      </Route>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate replace to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate replace to="/" />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage verifyOTP={verifyOTP} />} />
      <Route path="/reset-password" element={verifyOTP ? <ResetPasswordPage /> : <Error404Page />} />
      <Route path="*" element={<Error404Page />} />
    </Routes>
  )
}

export default App;

