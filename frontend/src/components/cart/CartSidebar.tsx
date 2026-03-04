"use client"
import { useState } from 'react'
import { X, Plus, Minus, Tag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { couponApi, orderApi } from '@/lib/api'
import { initiateRazorpayPayment } from '@/lib/razorpay'
import toast from 'react-hot-toast'

function formatPrice(n: number) {
  return '₹' + n.toLocaleString('en-IN')
}

export default function CartSidebar() {
  const { items, isOpen, setOpen, addItem, removeItem, clearCart,
          setCoupon, couponCode, discount, subtotal, tax, total } = useCartStore()
  const [couponInput, setCouponInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    try {
      const { data } = await couponApi.validate(couponInput.trim().toUpperCase(), subtotal)
      if (data.valid) {
        setCoupon(couponInput.toUpperCase(), data.discount_amount)
        toast.success(`🎉 ${data.description} applied!`)
      } else {
        toast.error(data.message || 'Invalid coupon')
      }
    } catch {
      toast.error('Could not validate coupon')
    }
  }

  const handleCheckout = async () => {
    if (!items.length) return
    setLoading(true)
    try {
      const { data: orderData } = await orderApi.create({
        cafe_slug: 'coffee-crisps',
        items: items.map((i) => ({ menu_item_id: i.menu_item_id, quantity: i.quantity })),
        order_type: 'dine_in',
        coupon_code: couponCode,
      })
      await initiateRazorpayPayment(
        orderData,
        async (response) => {
          await orderApi.verify(orderData.order_id, response as Record<string, string>)
          clearCart()
          setOpen(false)
          toast.success(`✅ Order ${orderData.order_number} confirmed!`)
        },
        () => toast.error('Payment cancelled')
      )
    } catch {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.5)', backdropFilter: 'blur(4px)', zIndex: 40 }} onClick={() => setOpen(false)} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, maxWidth: '100vw', background: 'white', zIndex: 50, display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 1.75rem', borderBottom: '1px solid #EDE5D0' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: '#2C1A0E' }}>Your Order</h2>
          <button onClick={() => setOpen(false)} style={{ width: 36, height: 36, border: '1px solid #EDE5D0', borderRadius: '50%', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.75rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#7A6245' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
              <p style={{ fontWeight: 600, color: '#2C1A0E', marginBottom: '0.5rem' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.85rem' }}>Add your favorites from the menu</p>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <div key={item.menu_item_id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 0', borderBottom: '1px solid #EDE5D0' }}>
                  <img src={item.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100'} alt={item.name} style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, color: '#2C1A0E', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{item.name}</p>
                    <p style={{ fontFamily: 'var(--font-display)', color: '#6B4F2A', fontSize: '1.1rem', fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                      <button onClick={() => removeItem(item.menu_item_id)} style={{ width: 24, height: 24, border: '1px solid #EDE5D0', borderRadius: '50%', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Minus size={10} />
                      </button>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => addItem(item)} style={{ width: 24, height: 24, border: '1px solid #EDE5D0', borderRadius: '50%', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: '1.25rem 1.75rem', borderTop: '1px solid #EDE5D0', background: '#F5F0E8' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code (FIRST20)"
                style={{ flex: 1, background: 'white', border: '1.5px solid #EDE5D0', borderRadius: 10, padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#2C1A0E', outline: 'none', fontFamily: 'inherit' }}
              />
              <button onClick={handleApplyCoupon} style={{ background: '#2C1A0E', color: 'white', border: 'none', borderRadius: 10, padding: '0.6rem 1rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'inherit' }}>
                <Tag size={13} /> Apply
              </button>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.88rem', color: '#7A6245' }}>
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.88rem', color: '#2E7D32' }}>
                  <span>Discount ({couponCode})</span><span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.88rem', color: '#7A6245' }}>
                <span>GST (5%)</span><span>{formatPrice(tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0 0.3rem', fontSize: '1rem', fontWeight: 700, color: '#2C1A0E', borderTop: '1px solid #EDE5D0', marginTop: '0.5rem' }}>
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{ width: '100%', background: '#2C1A0E', color: 'white', border: 'none', borderRadius: 14, padding: '1rem', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {loading ? 'Processing...' : `Pay ${formatPrice(total)} with Razorpay →`}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
