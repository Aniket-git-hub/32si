import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { useAllData } from './hooks/useAllData';
import { useAuth } from './hooks/useAuth';
import useSocket from './hooks/useSocket';
import RequireAuth, { RedirectIfAuthenticated } from './components/auth/RequireAuth';
import GuestLayout from './layouts/GuestLayout';
import RootLayout from './layouts/RootLayout';
import LandingPage from './pages/LandingPage';
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
import Leaderboard from './pages/dashboard/Leaderboard';
import ReplayPage from './pages/dashboard/ReplayPage';
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
      <Route path="/" element={isAuthenticated ? <RootLayout /> : <GuestLayout />}>
        {/* Open to everyone: offline play, the tutorial and the about page. */}
        <Route index element={isAuthenticated ? <HomePage /> : <LandingPage />} />
        <Route path="game" element={<GamePage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="about-us" element={<AboutUs />} />
        {/* Members only. */}
        <Route path="game/online/:code" element={<RequireAuth><OnlineGamePage /></RequireAuth>} />
        <Route path="leaderboard" element={<RequireAuth><Leaderboard /></RequireAuth>} />
        <Route path="replay/:gameId" element={<RequireAuth><ReplayPage /></RequireAuth>} />
        <Route path="settings" element={<RequireAuth><Settings /></RequireAuth>} />
        <Route path="stats" element={<RequireAuth><Stats /></RequireAuth>} />
        <Route path="feedback" element={<RequireAuth><Feedback /></RequireAuth>} />
        <Route path="rivals" element={<RequireAuth><Rivals /></RequireAuth>} />
        <Route path="profile/:username" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="chat/:username" element={<RequireAuth><ChatPage /></RequireAuth>} />
        <Route path="*" element={<Error404Page />} />
      </Route>
      <Route path="/login" element={<RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>} />
      <Route path="/register" element={<RedirectIfAuthenticated><RegisterPage /></RedirectIfAuthenticated>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage verifyOTP={verifyOTP} />} />
      <Route path="/reset-password" element={verifyOTP ? <ResetPasswordPage /> : <Error404Page />} />
      <Route path="/delete-account/:deletionToken" element={!user ? <DeleteAccountConfirmationPage /> : <Error404Page />} />
      <Route path="/cancel-delete-account/:deletionToken" element={<CancelDeleteAccountRequestPage />} />
      <Route path="*" element={<Error404Page />} />
    </Routes>
  )
}

export default App;

