import { useState, useEffect } from 'react'
import { productApi, orderApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

function StatCard({ icon, label, value, color }) {
    return (
        <div className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
            <div className="stat-icon" style={{ background: color + '22', color }}>{icon}</div>
            <div className="stat-info">
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
            </div>
        </div>
    )
}

export default function Dashboard() {
    const { user, isAdmin } = useAuth()
    const [stats, setStats] = useState({ products: 0, orders: 0, totalValue: 0, categories: 0 })
    const [recentOrders, setRecentOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const [prodRes, ordRes] = await Promise.all([
                    productApi.getAll(),
                    isAdmin() ? orderApi.getAll() : orderApi.getMyOrders()
                ])
                const products = prodRes.data
                const orders = ordRes.data
                const totalValue = orders.reduce((sum, o) => sum + parseFloat(o.totalPrice || 0), 0)
                const categories = new Set(products.map(p => p.category).filter(Boolean)).size
                setStats({ products: products.length, orders: orders.length, totalValue, categories })
                setRecentOrders(orders.slice(0, 5))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) return <div className="loading">Caricamento dashboard...</div>

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p className="page-subtitle">
                        Benvenuto, <strong>{user?.username}</strong>!
                        {isAdmin() ? ' 👑 Stai operando come Amministratore' : ''}
                    </p>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard icon="📦" label="Prodotti totali" value={stats.products} color="#6366f1" />
                <StatCard icon="🛒" label={isAdmin() ? 'Ordini totali' : 'Miei ordini'} value={stats.orders} color="#ec4899" />
                <StatCard icon="💶" label="Valore ordini" value={`€${stats.totalValue.toFixed(2)}`} color="#10b981" />
                <StatCard icon="🏷️" label="Categorie" value={stats.categories} color="#f59e0b" />
            </div>

            <div className="dashboard-lower">
                <div className="recent-orders">
                    <h2>Ultimi ordini</h2>
                    {recentOrders.length === 0 ? (
                        <p className="empty">Nessun ordine ancora.</p>
                    ) : (
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Prodotto</th>
                                    <th>Qty</th>
                                    <th>Totale</th>
                                    <th>Stato</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(o => (
                                    <tr key={o.id}>
                                        <td>#{o.id}</td>
                                        <td>{o.product?.name}</td>
                                        <td>{o.quantity}</td>
                                        <td>€{parseFloat(o.totalPrice).toFixed(2)}</td>
                                        <td>
                                            <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="tech-stack">
                    <h2>Stack tecnologico</h2>
                    <div className="tech-list">
                        {[
                            { icon: '☕', name: 'Java 17', desc: 'Backend language' },
                            { icon: '🍃', name: 'Spring Boot 3', desc: 'REST API framework' },
                            { icon: '🔒', name: 'JWT + Spring Security', desc: 'Auth & Authorization' },
                            { icon: '🐬', name: 'MySQL 8', desc: 'Relational database' },
                            { icon: '🗂️', name: 'Spring Data JPA', desc: 'ORM layer' },
                            { icon: '⚛️', name: 'React 18 + Vite', desc: 'Frontend framework' },
                            { icon: '🔄', name: 'Axios', desc: 'HTTP client' },
                            { icon: '🐳', name: 'Docker', desc: 'Containerization' },
                        ].map(t => (
                            <div key={t.name} className="tech-item">
                                <span className="tech-icon">{t.icon}</span>
                                <div>
                                    <strong>{t.name}</strong>
                                    <small>{t.desc}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
