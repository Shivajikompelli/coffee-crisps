"use client"

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void }
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  image?: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: { name: string; email: string; contact: string }
  notes?: Record<string, string>
  theme: { color: string }
  modal: { ondismiss: () => void }
}

export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false)
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function initiateRazorpayPayment(
  orderData: {
    razorpay_order_id: string
    razorpay_key_id: string
    amount: number
    currency: string
    prefill: { name: string; email: string; contact: string }
  },
  onSuccess: (response: RazorpayResponse) => void,
  onFailure: () => void
): Promise<void> {
  const loaded = await loadRazorpayScript()
  if (!loaded) throw new Error('Razorpay SDK failed to load')

  const rzp = new window.Razorpay({
    key: orderData.razorpay_key_id,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'Coffee & Crisps Café',
    description: 'Order Payment',
    order_id: orderData.razorpay_order_id,
    handler: onSuccess,
    prefill: orderData.prefill,
    notes: { source: 'website_direct' },
    theme: { color: '#2C1A0E' },
    modal: { ondismiss: onFailure },
  })
  rzp.open()
}
