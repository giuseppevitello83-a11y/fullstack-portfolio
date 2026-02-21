import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        if (stored && token) {
            setUser(JSON.parse(stored))
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password })
        const { token, ...userData } = res.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(userData)
        return userData
    }

    const register = async (username, email, password) => {
        const res = await api.post('/auth/register', { username, email, password })
        const { token, ...userData } = res.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(userData)
        return userData
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete api.defaults.headers.common['Authorization']
        setUser(null)
    }

    const isAdmin = () => user?.role === 'ADMIN'

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
