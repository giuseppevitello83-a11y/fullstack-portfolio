import { useState, useEffect } from 'react'
import { orderApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const STATUS_CONFIG = {
    PENDING: { label: 'In attesa', color: '#f59e0b', icon: '⏳' },
    CONFIRMED: { label: 'Confermato', color: '#6366f1', icon: '✅' },
    SHIPPED: { label: 'Spedito', color: '#3b82f6', icon: '🚚' },
    DELIVERED: { label: 'Consegnato', color: '#10b981', icon: '📦' },
    CANCELLED: { label: 'Annullato', color: '#ef4444', icon: '❌' },
}

export default function Orders() {
    const { isAdmin } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const loadOrders = async () => {
        try {
            const res = isAdmin() ? await orderApi.getAll() : await orderApi.getMyOrders()
            setOrders(res.data)
        } catch {
            console.error('Errore caricamento ordini')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadOrders() }, [])

    const handleStatus = async (id, status) => {
        try {
            await orderApi.updateStatus(id, status)
            loadOrders()
        } catch {
            alert('Errore aggiornamento stato')
        }
    }

    if (loading) return <div className="loading">Caricamento ordini...</div>

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>{isAdmin() ? 'Tutti gli Ordini' : 'I miei Ordini'}</h1>
                    <p className="page-subtitle">{orders.length} ordini totali</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📋</span>
                    <h3>Nessun ordine ancora</h3>
                    <p>Vai ai prodotti e fai il tuo primo ordine!</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => {
                        const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
                        return (
                            <div key={order.id} className="order-card">
                                <div className="order-id">Ordine #{order.id}</div>
                                <div className="order-info">
                                    <div className="order-product">
                                        <span className="order-label">Prodotto</span>
                                        <span className="order-value">{order.product?.name}</span>
                                    </div>
                                    <div className="order-qty">
                                        <span className="order-label">Quantità</span>
                                        <span className="order-value">{order.quantity}</span>
                                    </div>
                                    <div className="order-total">
                                        <span className="order-label">Totale</span>
                                        <span className="order-value order-price">€{parseFloat(order.totalPrice).toFixed(2)}</span>
                                    </div>
                                    <div className="order-date">
                                        <span className="order-label">Data</span>
                                        <span className="order-value">
                                            {new Date(order.createdAt).toLocaleDateString('it-IT')}
                                        </span>
                                    </div>
                                </div>
                                <div className="order-status-row">
                                    <span className="status-badge" style={{ background: cfg.color + '22', color: cfg.color, border: `1px solid ${cfg.color}` }}>
                                        {cfg.icon} {cfg.label}
                                    </span>
                                    {isAdmin() && (
                                        <select
                                            value={order.status}
                                            onChange={e => handleStatus(order.id, e.target.value)}
                                            className="status-select"
                                        >
                                            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                                                <option key={k} value={k}>{v.icon} {v.label}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
