import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Error404Page from './pages/Error404Page';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated } = useAuth()
  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate replace to="/login" />} />
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate replace to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate replace to="/" />} />
      <Route path="*" element={ <Error404Page />} />
    </Routes>
  )
}

export default App;

