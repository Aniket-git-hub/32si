import React, { useContext } from 'react';
import './App.css';
import { useRoutes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Error404Page from './pages/Error404Page';
import ProtectedRoute from './components/ProtectedRoute';
import { UserContext } from './context/UserContext';

function App() {
  const { user, setUser } = useContext(UserContext); 

  const isLoggedIn = Boolean(user)
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
      element: !isLoggedIn ? <LoginPage /> : <Navigate to="/" />,
    },
    {
      path: '/register',
      element: !isLoggedIn ? <RegisterPage /> : <Navigate to="/" />,
    },
    {
      path: '*',
      element: <Error404Page />,
    },
  ]);

  return routes;
}

export default App;

