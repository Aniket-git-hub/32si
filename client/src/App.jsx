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
import GamePage from './pages/dashboard/GamePage';
import LearnPage from './pages/dashboard/LearnPage';
import HomePage from './pages/dashboard/HomePage';
import OnlineGamePage from './pages/dashboard/OnlineGamePage';
import Profile from './pages/dashboard/Profile';
import Rivals from './pages/dashboard/Rivals';
import Settings from './pages/dashboard/Settings';
import Stats from './pages/dashboard/Stats';

function App() {
  const { user, setUser, isAuthenticated, verifyOTP } = useAuth()
  const { setOnlineFriends, setNotifications } = useAllData()
  const { socket } = useSocket()

  const friendIds = user?.friends?.map((f) => f._id).join(",") ?? ""

  // Presence and friend-request events. Re-announce ourselves after every reconnect, and whenever the
  // allies list changes, so the server's presence list stays right.
  useEffect(() => {
    if (!socket || !user) return
    const announce = () => socket.emit("userConnected", user._id, friendIds ? friendIds.split(",") : [], user.username)
    const addNotification = ({ message, userTo, userFrom }) => {
      setNotifications((prev) =>
        prev.some((n) => n.key === userFrom.username && n.message === message)
          ? prev
          : [...prev, { key: userFrom.username, message, action: { redirect: userFrom.username } }]
      )
      setUser(userTo)
    }
    const onFriendsOnline = (data) => setOnlineFriends(data)
    const onFriendConnected = (id) => setOnlineFriends((prev) => (prev.includes(id) ? prev : [...prev, id]))
    const onFriendDisconnected = (id) => setOnlineFriends((prev) => prev.filter((f) => f !== id))

    if (socket.connected) announce()
    socket.on("connect", announce)
    socket.on("friendsOnline", onFriendsOnline)
    socket.on("friendConnected", onFriendConnected)
    socket.on("friendDisconnected", onFriendDisconnected)
    socket.on("connectionRequest", addNotification)
    socket.on("connectionRequestAccepted", addNotification)
    return () => {
      socket.off("connect", announce)
      socket.off("friendsOnline", onFriendsOnline)
      socket.off("friendConnected", onFriendConnected)
      socket.off("friendDisconnected", onFriendDisconnected)
      socket.off("connectionRequest", addNotification)
      socket.off("connectionRequestAccepted", addNotification)
    }
    // user is read for its id/username only; friendIds covers allies changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user?._id, friendIds, setOnlineFriends, setNotifications, setUser])


  return (
    <Routes>
      <Route path="/" exact element={isAuthenticated ? <RootLayout /> : <Navigate replace to="/login" />}>
        <Route index element={<HomePage />} />
        <Route path="game" element={<GamePage />} />
        <Route path="game/online/:code" element={<OnlineGamePage />} />
        <Route path="learn" element={<LearnPage />} />
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

