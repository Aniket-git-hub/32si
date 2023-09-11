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
import { Button } from '@chakra-ui/react';
import { acceptConnection } from './api/user';

function App() {
  const { user, setUser, isAuthenticated, verifyOTP } = useAuth()
  const { notifications, setNotifications } = useAllData()

  const handleAcceptConnection = async (userId, notificationKey) => {
    try {
      const response = await acceptConnection(userId)
      setNotifications(prev => prev.filter(notification => notification.key !== notificationKey));
      setUser(response.data.user)
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    if (user && user.connectionRequests.length !== 0) {
      user.connectionRequests.forEach((item) => {
        const notificationExists = notifications.some(notification => notification.key === `connectionRequest-${item}`);

        if (!notificationExists) {
          setNotifications(prev => [
            ...prev,
            {
              key: `connectionRequest-${item}`,
              message: `${item} wants to connect with you`,
              button: <Button colorScheme="purple" variant={"outline"} onClick={ (event) => handleAcceptConnection(item, `connectionRequest-${item}`)}  >Accept</Button>
            }
          ]);
        }
      });
    }
  }, [user])


  return (
    <Routes>
      <Route path="/" exact element={isAuthenticated ? <RootLayout /> : <Navigate replace to="/login" />}>
        <Route index element={ <HomePage />} />
        <Route path="settings" element={ <Settings />} />
        <Route path="stats" element={ <Stats />} />
        <Route path="feedback" element={ <Feedback />} />
        <Route path="about-us" element={ <AboutUs />} />
        <Route path="rivals" element={ <Rivals />} />
        <Route path="profile/:username" element={ <Profile />} />
        <Route path="*" element={ <Error404Page />} />
      </Route>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate replace to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate replace to="/" />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage verifyOTP={verifyOTP} />} />
      <Route path="/reset-password" element={verifyOTP ? <ResetPasswordPage /> : <Error404Page />} />
      <Route path="*" element={ <Error404Page />} />
    </Routes>
  )
}

export default App;

