import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { authApi } from '@/lib/api'
import { setTokens, clearTokens } from '@/lib/auth'

interface AuthState {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await authApi.login(email, password)
          setTokens(data.access, data.refresh)
          set({ user: data.user, isLoading: false })
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      logout: () => {
        clearTokens()
        set({ user: null })
      },

      setUser: (user) => set({ user }),
    }),
    { name: 'cc-auth', partialize: (s) => ({ user: s.user }) }
  )
)
