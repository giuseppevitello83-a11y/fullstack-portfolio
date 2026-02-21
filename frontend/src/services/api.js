import axios from 'axios'

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || '') + '/api',
    headers: { 'Content-Type': 'application/json' }
})

// Response interceptor — handle 401
api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(err)
    }
)

export const productApi = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`)
}

export const orderApi = {
    getMyOrders: () => api.get('/orders/my'),
    getAll: () => api.get('/orders'),
    create: (productId, quantity) => api.post('/orders', { productId, quantity }),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
}

export default api
