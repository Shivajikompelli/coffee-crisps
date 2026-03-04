export interface MenuItem {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image_url: string
  category: string
  category_name: string
  is_veg: boolean
  is_vegan: boolean
  is_gluten_free: boolean
  is_available: boolean
  is_featured: boolean
  is_bestseller: boolean
  badge_text?: string
  spice_level: 'none' | 'mild' | 'medium' | 'hot'
  prep_time_minutes: number
  calories?: number
  allergens?: string
}

export interface CartItem {
  menu_item_id: string
  name: string
  price: number
  quantity: number
  image_url: string
  customizations?: Record<string, string>
}

export interface Order {
  id: string
  order_number: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  order_type: 'dine_in' | 'takeaway' | 'delivery'
  items: CartItem[]
  subtotal: number
  discount_amount: number
  tax_amount: number
  total_amount: number
  payment_status: 'unpaid' | 'paid' | 'failed'
  razorpay_order_id?: string
  loyalty_points_earned: number
  special_instructions?: string
  created_at: string
}

export interface Reservation {
  id: string
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: number
  occasion: string
  special_requests?: string
  confirmation_code: string
  status: string
  created_at: string
}

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  loyalty_points: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  birthday?: string
  marketing_consent: boolean
}

export interface LoyaltyTransaction {
  transaction_type: string
  points: number
  balance_after: number
  description: string
  created_at: string
}

export interface LoyaltyDashboard {
  points: number
  tier: string
  points_to_next_tier: number
  total_earned: number
  wallet_value: number
  transactions: LoyaltyTransaction[]
}

export interface CouponValidation {
  valid: boolean
  discount_amount?: number
  description?: string
  message?: string
}

export interface RazorpayOrderResponse {
  order_id: string
  order_number: string
  razorpay_order_id: string
  razorpay_key_id: string
  amount: number
  currency: string
  prefill: { name: string; email: string; contact: string }
}

export interface AdminAnalytics {
  today: {
    revenue: number
    orders: number
    avg_order_value: number
    new_reservations: number
  }
  week: { revenue: number; orders: number }
  top_items: Array<{ name: string; total_orders: number; price: number }>
  loyalty_members: number
  pending_orders: number
  todays_reservations: Reservation[]
}
