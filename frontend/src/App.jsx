import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Dashboard from './pages/Dashboard'

function Navbar() {
    const { user, logout, isAdmin } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    if (!user) return null

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="brand-icon">🛒</span>
                <span>ShopManager</span>
            </div>
            <div className="navbar-links">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/products" className="nav-link">Prodotti</Link>
                <Link to="/orders" className="nav-link">I miei ordini</Link>
            </div>
            <div className="navbar-user">
                <span className="user-badge">
                    {isAdmin() ? '👑' : '👤'} {user.username}
                </span>
                <button onClick={handleLogout} className="btn btn-ghost">Logout</button>
            </div>
        </nav>
    )
}

function PrivateRoute({ children }) {
    const { user, loading } = useAuth()
    if (loading) return <div className="loading">Caricamento...</div>
    return user ? children : <Navigate to="/login" />
}

function App() {
    return (
        <AuthProvider>
            <div className="app">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
                        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </main>
            </div>
        </AuthProvider>
    )
}

export default App
