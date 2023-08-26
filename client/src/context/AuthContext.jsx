import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true')

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('isAuthenticated', String(isAuthenticated))
    }, [user, isAuthenticated])

    const save = (user, token) => {
        setIsAuthenticated(true)
        setUser(user)
        localStorage.setItem('token', token)
    }

    const remove = () => {
        setIsAuthenticated(false)
        setUser(null)
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, save, remove }}>
            {children}
        </AuthContext.Provider>
    );
};
