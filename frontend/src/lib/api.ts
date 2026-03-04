import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null
      if (refresh) {
        try {
          const { data } = await api.post('/auth/refresh/', { refresh })
          localStorage.setItem('access_token', data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
      }
    }
    return Promise.reject(error)
  }
)

export const menuApi = {
  list: (params?: Record<string, string>) => api.get('/menu/', { params }),
  detail: (slug: string) => api.get(`/menu/${slug}/`),
  categories: () => api.get('/menu/categories/'),
}

export const orderApi = {
  create: (data: Record<string, unknown>) => api.post('/orders/', data),
  verify: (orderId: string, data: Record<string, string>) =>
    api.post(`/orders/${orderId}/verify/`, data),
  detail: (orderId: string) => api.get(`/orders/${orderId}/`),
  history: () => api.get('/orders/history/'),
}

export const reservationApi = {
  create: (data: Record<string, unknown>) => api.post('/reservations/', data),
}

export const loyaltyApi = {
  dashboard: () => api.get('/loyalty/'),
  redeem: (points: number) => api.post('/loyalty/redeem/', { points }),
}

export const couponApi = {
  validate: (code: string, orderAmount: number) =>
    api.post('/coupons/validate/', { code, order_amount: orderAmount }),
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),
  register: (data: Record<string, string>) => api.post('/auth/register/', data),
  refresh: (refresh: string) => api.post('/auth/refresh/', { refresh }),
}

export const adminApi = {
  analytics: () => api.get('/admin/analytics/'),
  reservations: (date?: string) =>
    api.get('/admin/reservations/', { params: date ? { date } : {} }),
  toggleMenuItem: (id: number) => api.patch(`/menu/admin/${id}/toggle/`),
}
