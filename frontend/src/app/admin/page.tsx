"use client"
import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'
import { AdminAnalytics } from '@/types'
import { formatPrice } from '@/lib/utils'
import { TrendingUp, ShoppingBag, Calendar, Users, Package, Star } from 'lucide-react'

export default function AdminDashboard() {
  const [data, setData] = useState<AdminAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.analytics()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-matte-black flex items-center justify-center text-white">Loading dashboard...</div>
  if (!data) return <div className="min-h-screen bg-matte-black flex items-center justify-center text-white/40">Access denied or not authenticated.</div>

  const stats = [
    { label: "Today's Revenue", value: formatPrice(data.today.revenue), icon: TrendingUp, change: '↑ 18%' },
    { label: "Today's Orders", value: data.today.orders, icon: ShoppingBag, change: '↑ 23%' },
    { label: 'Avg Order Value', value: formatPrice(data.today.avg_order_value), icon: Star, change: '' },
    { label: 'New Reservations', value: data.today.new_reservations, icon: Calendar, change: '' },
    { label: 'Pending Orders', value: data.pending_orders, icon: Package, change: '' },
    { label: 'Loyalty Members', value: data.loyalty_members.toLocaleString(), icon: Users, change: '↑ 12 today' },
  ]

  const STATUS_COLORS: Record<string, string> = {
    confirmed: 'bg-green-900/40 text-green-400',
    pending: 'bg-yellow-900/40 text-yellow-400',
    preparing: 'bg-blue-900/40 text-blue-400',
    completed: 'bg-gray-700 text-gray-400',
  }

  return (
    <div className="min-h-screen bg-matte-black text-white px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-accent-gold text-xs uppercase tracking-widest mb-1">Admin Dashboard</p>
          <h1 className="font-display text-4xl">Live Business <em>Intelligence</em></h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, change }) => (
            <div key={label} className="bg-white/4 border border-white/8 rounded-2xl p-4 hover:border-accent-gold/30 transition-all">
              <Icon size={20} className="text-accent-gold mb-3" />
              <p className="font-display text-2xl text-accent-gold font-bold">{value}</p>
              <p className="text-white/40 text-xs mt-1 uppercase tracking-wider">{label}</p>
              {change && <p className="text-green-400 text-xs mt-1">{change}</p>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reservations */}
          <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
            <h2 className="font-display text-xl mb-5">Today&apos;s Reservations</h2>
            {data.todays_reservations.length === 0 ? (
              <p className="text-white/30 text-sm">No reservations today</p>
            ) : (
              <div className="space-y-3">
                {data.todays_reservations.map((res, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/6 last:border-0">
                    <span className="text-accent-gold text-xs font-bold min-w-16">{String(res.time)}</span>
                    <div className="flex-1">
                      <p className="text-white/80 text-sm font-medium">{res.name}</p>
                      <p className="text-white/30 text-xs">{res.guests} guests · {res.occasion}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLORS[res.status] || 'bg-white/10 text-white/40'}`}>
                      {String(res.status).toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Items */}
          <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
            <h2 className="font-display text-xl mb-5">Top Selling Items</h2>
            <div className="space-y-3">
              {data.top_items.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-accent-gold font-bold text-sm min-w-6">#{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-white/80 text-sm font-medium">{item.name}</p>
                    <p className="text-white/30 text-xs">{formatPrice(item.price)}</p>
                  </div>
                  <span className="text-white/50 text-xs">{item.total_orders} orders</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
            <h2 className="font-display text-xl mb-5">Weekly Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Week Revenue</p>
                <p className="font-display text-3xl text-accent-gold font-bold">{formatPrice(data.week.revenue)}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Week Orders</p>
                <p className="font-display text-3xl text-white font-bold">{data.week.orders}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Avg Daily Revenue</p>
                <p className="font-display text-2xl text-white/60">{formatPrice(data.week.revenue / 7)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
