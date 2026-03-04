"use client"
import { useEffect, useState } from 'react'
import { loyaltyApi } from '@/lib/api'
import { LoyaltyDashboard } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Gift, Star, Zap, Trophy } from 'lucide-react'

const TIERS = [
  { name: 'Bronze', min: 0, color: '#C4A882', emoji: '🥉' },
  { name: 'Silver', min: 500, color: '#9B9B9B', emoji: '🥈' },
  { name: 'Gold', min: 2000, color: '#C9A84C', emoji: '🥇' },
  { name: 'Platinum', min: 5000, color: '#B9F2FF', emoji: '💎' },
]

export default function LoyaltyPage() {
  const [data, setData] = useState<LoyaltyDashboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loyaltyApi.dashboard()
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  const currentTier = TIERS.find((t) => data && data.points >= t.min) || TIERS[0]
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1]
  const progress = nextTier ? ((data?.points || 0) - currentTier.min) / (nextTier.min - currentTier.min) * 100 : 100

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-brown-mid mb-2">Loyalty Program</p>
          <h1 className="font-display text-5xl text-espresso">Earn Beans, <em>Get Rewarded</em></h1>
        </div>

        {loading ? (
          <div className="text-center py-20 text-text-muted">Loading your rewards...</div>
        ) : !data ? (
          <div className="bg-espresso rounded-3xl p-10 text-center text-white">
            <Trophy size={48} className="text-accent-gold mx-auto mb-4" />
            <h2 className="font-display text-3xl mb-3">Join Our Loyalty Program</h2>
            <p className="text-white/60 mb-6">Sign up to start earning Beans on every order.</p>
            <a href="/auth/register" className="bg-accent-gold text-espresso font-bold px-8 py-3 rounded-full hover:bg-yellow-400 transition-all">
              Join Now — It&apos;s Free
            </a>
          </div>
        ) : (
          <>
            {/* Loyalty Card */}
            <div className="bg-gradient-to-br from-espresso to-brown-deep rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <p className="font-display text-xl text-accent-gold mb-6">Coffee & Crisps</p>
              <p className="text-white/40 text-xs uppercase tracking-wider">Loyalty Member</p>
              <h2 className="font-display text-3xl mt-1 mb-6">Welcome Back!</h2>
              <p className="text-accent-gold text-xs uppercase tracking-wider mb-1">Beans Balance</p>
              <p className="font-display text-6xl font-bold">{data.points.toLocaleString()}<span className="text-2xl font-normal text-white/40 ml-2">beans</span></p>
              <p className="text-white/40 text-sm mt-1">= {formatPrice(data.wallet_value)} in rewards</p>
              {nextTier && (
                <div className="mt-6">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent-gold to-yellow-300 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-white/30 text-xs mt-1">{data.points_to_next_tier} beans to {nextTier.emoji} {nextTier.name}</p>
                </div>
              )}
              <div className="absolute bottom-6 right-8 text-5xl opacity-20">{currentTier.emoji}</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Total Earned', value: `${data.total_earned} beans`, icon: Star },
                { label: 'Wallet Value', value: formatPrice(data.wallet_value), icon: Gift },
                { label: 'Current Tier', value: `${currentTier.emoji} ${currentTier.name}`, icon: Trophy },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white rounded-2xl p-5 border border-beige text-center">
                  <Icon size={20} className="text-accent-gold mx-auto mb-2" />
                  <p className="font-display text-xl text-espresso font-bold">{value}</p>
                  <p className="text-text-muted text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-2xl border border-beige p-6">
              <h3 className="font-display text-xl text-espresso mb-4">Recent Activity</h3>
              {data.transactions.length === 0 ? (
                <p className="text-text-muted text-sm">No transactions yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.transactions.map((tx, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-beige last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.points > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                          <Zap size={14} className={tx.points > 0 ? 'text-green-600' : 'text-red-500'} />
                        </div>
                        <div>
                          <p className="text-sm text-espresso font-medium">{tx.description}</p>
                          <p className="text-xs text-text-muted">{new Date(tx.created_at).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                      <span className={`font-bold text-sm ${tx.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {tx.points > 0 ? '+' : ''}{tx.points} beans
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
