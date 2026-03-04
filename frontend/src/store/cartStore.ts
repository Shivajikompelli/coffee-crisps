import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  couponCode: string
  discount: number
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  setCoupon: (code: string, discount: number) => void
  setOpen: (open: boolean) => void
  get subtotal(): number
  get tax(): number
  get total(): number
  get itemCount(): number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      discount: 0,
      isOpen: false,

      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.menu_item_id === newItem.menu_item_id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.menu_item_id === newItem.menu_item_id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.menu_item_id === id ? { ...i, quantity: i.quantity - 1 } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      updateQty: (id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.menu_item_id !== id)
              : state.items.map((i) =>
                  i.menu_item_id === id ? { ...i, quantity: qty } : i
                ),
        })),

      clearCart: () => set({ items: [], couponCode: '', discount: 0 }),
      setCoupon: (code, discount) => set({ couponCode: code, discount }),
      setOpen: (open) => set({ isOpen: open }),

      get subtotal() {
        return get().items.reduce((s, i) => s + i.price * i.quantity, 0)
      },
      get tax() {
        return Math.round((get().subtotal - get().discount) * 0.05)
      },
      get total() {
        return get().subtotal - get().discount + get().tax
      },
      get itemCount() {
        return get().items.reduce((s, i) => s + i.quantity, 0)
      },
    }),
    { name: 'cc-cart' }
  )
)
