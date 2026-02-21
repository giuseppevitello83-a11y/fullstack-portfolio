import { useState, useEffect } from 'react'
import { productApi, orderApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

function ProductCard({ product, onOrder, onEdit, onDelete, isAdmin }) {
    const [qty, setQty] = useState(1)
    const [ordering, setOrdering] = useState(false)

    const handleOrder = async () => {
        setOrdering(true)
        await onOrder(product.id, qty)
        setOrdering(false)
        setQty(1)
    }

    const categoryColors = {
        Electronics: '#6366f1', Footwear: '#ec4899', 'Home Appliances': '#10b981',
        Toys: '#f59e0b', default: '#8b5cf6'
    }
    const catColor = categoryColors[product.category] || categoryColors.default

    return (
        <div className="product-card">
            <div className="product-category" style={{ background: catColor }}>
                {product.category || 'General'}
            </div>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-desc">{product.description}</p>
            <div className="product-meta">
                <span className="product-price">€{parseFloat(product.price).toFixed(2)}</span>
                <span className={`product-stock ${product.quantity === 0 ? 'out' : ''}`}>
                    {product.quantity > 0 ? `${product.quantity} disponibili` : 'Esaurito'}
                </span>
            </div>
            <div className="product-actions">
                {!isAdmin && product.quantity > 0 && (
                    <div className="order-row">
                        <input type="number" min="1" max={product.quantity} value={qty}
                            onChange={e => setQty(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
                            className="qty-input"
                        />
                        <button onClick={handleOrder} disabled={ordering} className="btn btn-primary btn-sm">
                            {ordering ? '...' : '🛒 Ordina'}
                        </button>
                    </div>
                )}
                {isAdmin && (
                    <div className="admin-actions">
                        <button onClick={() => onEdit(product)} className="btn btn-secondary btn-sm">✏️ Modifica</button>
                        <button onClick={() => onDelete(product.id)} className="btn btn-danger btn-sm">🗑️ Elimina</button>
                    </div>
                )}
            </div>
        </div>
    )
}

function ProductModal({ product, onSave, onClose }) {
    const [form, setForm] = useState(product || {
        name: '', description: '', price: '', quantity: 0, category: '', imageUrl: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        await onSave({ ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) })
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h2>{product?.id ? 'Modifica prodotto' : 'Nuovo prodotto'}</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Nome</label>
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Descrizione</label>
                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Prezzo (€)</label>
                            <input type="number" step="0.01" min="0" value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Quantità</label>
                            <input type="number" min="0" value={form.quantity}
                                onChange={e => setForm({ ...form, quantity: e.target.value })} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Categoria</label>
                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                            <option value="">Seleziona...</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Footwear">Footwear</option>
                            <option value="Home Appliances">Home Appliances</option>
                            <option value="Toys">Toys</option>
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn btn-ghost">Annulla</button>
                        <button type="submit" className="btn btn-primary">Salva</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function Products() {
    const { isAdmin } = useAuth()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [modal, setModal] = useState(null)  // null | 'new' | product
    const [toast, setToast] = useState(null)

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const loadProducts = async () => {
        try {
            const params = {}
            if (search) params.search = search
            if (category) params.category = category
            const res = await productApi.getAll(params)
            setProducts(res.data)
        } catch {
            showToast('Errore caricamento prodotti', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadProducts() }, [search, category])

    const handleOrder = async (productId, quantity) => {
        try {
            await orderApi.create(productId, quantity)
            showToast('✅ Ordine effettuato!')
            loadProducts()
        } catch (err) {
            showToast(err.response?.data?.error || 'Errore ordine', 'error')
        }
    }

    const handleSave = async (data) => {
        try {
            if (data.id) await productApi.update(data.id, data)
            else await productApi.create(data)
            showToast(data.id ? '✅ Prodotto aggiornato' : '✅ Prodotto creato')
            loadProducts()
        } catch (err) {
            showToast(err.response?.data?.error || 'Errore salvataggio', 'error')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Eliminare questo prodotto?')) return
        try {
            await productApi.delete(id)
            showToast('✅ Prodotto eliminato')
            loadProducts()
        } catch {
            showToast('Errore eliminazione', 'error')
        }
    }

    return (
        <div className="page">
            {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

            <div className="page-header">
                <div>
                    <h1>Prodotti</h1>
                    <p className="page-subtitle">{products.length} prodotti disponibili</p>
                </div>
                {isAdmin() && (
                    <button onClick={() => setModal('new')} className="btn btn-primary">
                        + Nuovo prodotto
                    </button>
                )}
            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder="🔍 Cerca prodotti..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="filter-input"
                />
                <select value={category} onChange={e => setCategory(e.target.value)} className="filter-select">
                    <option value="">Tutte le categorie</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Home Appliances">Home Appliances</option>
                    <option value="Toys">Toys</option>
                </select>
            </div>

            {loading ? (
                <div className="loading">Caricamento prodotti...</div>
            ) : (
                <div className="products-grid">
                    {products.map(p => (
                        <ProductCard key={p.id} product={p}
                            onOrder={handleOrder} onEdit={setModal} onDelete={handleDelete}
                            isAdmin={isAdmin()} />
                    ))}
                    {products.length === 0 && <p className="empty">Nessun prodotto trovato.</p>}
                </div>
            )}

            {modal && (
                <ProductModal
                    product={modal === 'new' ? null : modal}
                    onSave={handleSave}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    )
}
