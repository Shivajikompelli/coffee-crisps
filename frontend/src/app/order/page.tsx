"use client"
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export default function OrderPage() {
  const { setOpen } = useCartStore()
  return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', paddingTop: '5rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: '#2C1A0E' }}>Order Online</h1>
      <p style={{ color: '#7A6245', maxWidth: 400, textAlign: 'center', lineHeight: 1.7 }}>Browse our full menu and add items to your cart for direct ordering with Razorpay payment.</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/menu" style={{ background: '#2C1A0E', color: 'white', padding: '0.9rem 2rem', borderRadius: 100, fontWeight: 600, textDecoration: 'none' }}>Browse Menu →</Link>
        <button onClick={() => setOpen(true)} style={{ background: '#C9A84C', color: '#2C1A0E', padding: '0.9rem 2rem', borderRadius: 100, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>View Cart 🛒</button>
      </div>
    </div>
  )
}
