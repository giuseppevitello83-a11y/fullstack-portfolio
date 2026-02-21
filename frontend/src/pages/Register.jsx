import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await register(form.username, form.email, form.password)
            navigate('/products')
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.errors
            setError(typeof msg === 'object' ? Object.values(msg).join(', ') : msg || 'Registrazione fallita')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-icon">✨</span>
                    <h1>Registrati</h1>
                    <p>Crea il tuo account ShopManager</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="mario_rossi"
                            value={form.username}
                            onChange={e => setForm({ ...form, username: e.target.value })}
                            required minLength={3}
                        />
                    </div>
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
                            placeholder="Minimo 6 caratteri"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            required minLength={6}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Registrazione...' : 'Crea account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Hai già un account? <Link to="/login">Accedi</Link>
                </p>
            </div>
        </div>
    )
}
