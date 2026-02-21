import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const user = await login(form.email, form.password)
            navigate(user.role === 'ADMIN' ? '/dashboard' : '/products')
        } catch (err) {
            setError(err.response?.data?.error || 'Email o password non validi')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-icon">🔐</span>
                    <h1>Accedi</h1>
                    <p>Bentornato su ShopManager</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="mario@example.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Accesso in corso...' : 'Accedi'}
                    </button>
                </form>

                <div className="auth-hints">
                    <p className="hint-title">🔑 Credenziali demo:</p>
                    <code>admin@portfolio.com / admin123</code>
                    <code>mario@example.com / mario123</code>
                </div>

                <p className="auth-footer">
                    Non hai un account? <Link to="/register">Registrati</Link>
                </p>
            </div>
        </div>
    )
}
