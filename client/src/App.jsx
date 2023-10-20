import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { useAllData } from './hooks/useAllData';
import { useAuth } from './hooks/useAuth';
import useSocket from './hooks/useSocket';
import RootLayout from './layouts/RootLayout';
import CancelDeleteAccountRequestPage from './pages/auth/CancelDeleteAccountRequestPage';
import DeleteAccountConfirmationPage from './pages/auth/DeleteAccountConfirmationPage';
import Error404Page from './pages/auth/Error404Page';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import AboutUs from './pages/dashboard/AboutUs';
import ChatPage from './pages/dashboard/ChatPage';
import Feedback from './pages/dashboard/Feedback';
import HomePage from './pages/dashboard/HomePage';
import Profile from './pages/dashboard/Profile';
import Rivals from './pages/dashboard/Rivals';
import Settings from './pages/dashboard/Settings';
import Stats from './pages/dashboard/Stats';

function App() {
  const { user, setUser, isAuthenticated, verifyOTP } = useAuth()
  const { setOnlineFriends, setNotifications } = useAllData()
  const { socket } = useSocket()

  useEffect(() => {
    if (socket && user != null) {
      socket.emit("userConnected", user._id, user.friends.map(f => f._id), user.username)
      socket.on("friendsOnline", (data) => setOnlineFriends(data))
      socket.on("friendConnected", (data) => setOnlineFriends(prev => [...prev, data]))
      socket.on("friendDisconnected", (data) => setOnlineFriends(prev => prev.filter(f => f !== data)))
      socket.on("connectionRequest", ({ message, userTo, userFrom }) => {
        setNotifications(prev => [...prev, {
          key: userFrom.username,
          message,
          action: { redirect: userFrom.username },
        }])
        setUser(userTo)
      })
      socket.on("connectionRequestAccepted", ({ message, userTo, userFrom }) => {
        setNotifications(prev => [...prev, {
          key: userFrom.username,
          message,
          action: { redirect: userFrom.username },
        }])
        setUser(userTo)
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
        <Route path="chat/:username" element={<ChatPage />} />
        <Route path="*" element={<Error404Page />} />
      </Route>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate replace to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate replace to="/" />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage verifyOTP={verifyOTP} />} />
      <Route path="/reset-password" element={verifyOTP ? <ResetPasswordPage /> : <Error404Page />} />
      <Route path="/delete-account/:deletionToken" element={!user ? <DeleteAccountConfirmationPage /> : <Error404Page />} />
      <Route path="/cancel-delete-account/:deletionToken" element={<CancelDeleteAccountRequestPage />} />
      <Route path="*" element={<Error404Page />} />
    </Routes>
  )
}

export default App;

