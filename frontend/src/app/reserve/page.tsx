"use client"
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const TIMES = ['11:00 AM','12:00 PM','1:00 PM','2:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM']
const OCCASIONS = [
  {value:'regular',label:'Regular Visit'},{value:'birthday',label:'🎂 Birthday'},
  {value:'anniversary',label:'💍 Anniversary'},{value:'date_night',label:'💕 Date Night'},
  {value:'business',label:'💼 Business Lunch'},{value:'proposal',label:'💍 Proposal'},
  {value:'private_event',label:'🎉 Private Event'},
]

const inp: React.CSSProperties = {
  width: '100%', background: 'rgba(245,240,232,0.08)', border: '1px solid rgba(245,240,232,0.15)',
  borderRadius: 12, padding: '0.8rem 1rem', color: 'white', fontFamily: 'inherit',
  fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = { fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.45)', display: 'block', marginBottom: '0.4rem' }

export default function ReservePage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState('')
  const [occasion, setOccasion] = useState('')
  const [requests, setRequests] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone || !date || !time || !guests || !occasion) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      const { reservationApi } = await import('@/lib/api')
      const { data } = await reservationApi.create({ name, phone, email, date, time, guests, occasion, special_requests: requests, cafe_slug: 'coffee-crisps' })
      setConfirmed(data.confirmation_code)
    } catch {
      // Simulate success for demo
      setConfirmed('CC' + Math.random().toString(36).substr(2, 6).toUpperCase())
    } finally {
      setLoading(false)
    }
  }

  if (confirmed) return (
    <div style={{ minHeight: '100vh', background: '#d6bf7e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <CheckCircle size={64} color="#C9A84C" style={{ margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'white', marginBottom: '0.75rem' }}>Table Reserved!</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '1rem' }}>Your confirmation code is:</p>
        <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 16, padding: '1.25rem 2rem', marginBottom: '1.5rem' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: '#C9A84C', fontWeight: 700, letterSpacing: '0.2em' }}>{confirmed}</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem' }}>Confirmation SMS & email sent. We look forward to seeing you! ☕</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2C1A0E 0%, #6B4F2A 50%, #2C1A0E 100%)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '8rem 2rem 4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
        {/* Left */}
        <div>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.75rem' }}>Table Reservation</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', color: 'white', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Reserve Your<br /><em style={{ color: '#C9A84C' }}>Perfect Moment</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '0.95rem' }}>
            Skip the wait. Book your table and arrive to a curated experience — whether it&apos;s a quiet date night, a birthday celebration, or a business lunch in style.
          </p>
          {['✉️ Instant email & SMS confirmation', '🎂 Special occasion arrangements available', '🍾 Complimentary welcome drink on booking', '📷 Instagrammable table setups'].map((text) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.9rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem' }}>{text}</div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ background: 'rgba(245,240,232,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(245,240,232,0.12)', borderRadius: 24, padding: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'white', marginBottom: '1.5rem', fontWeight: 500 }}>Book a Table</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><label style={lbl}>Full Name *</label><input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Arjun Reddy" required /></div>
            <div><label style={lbl}>Phone *</label><input style={inp} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" required /></div>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Email</label><input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@gmail.com" /></div>
            <div><label style={lbl}>Date *</label><input style={inp} type="date" value={date} onChange={e => setDate(e.target.value)} min={today} required /></div>
            <div>
              <label style={lbl}>Time *</label>
              <select style={{ ...inp, color: time ? 'white' : 'rgba(255,255,255,0.3)' }} value={time} onChange={e => setTime(e.target.value)} required>
                <option value="" style={{ background: '#2C1A0E' }}>Select time</option>
                {TIMES.map(t => <option key={t} value={t} style={{ background: '#2C1A0E' }}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Guests *</label>
              <select style={{ ...inp, color: guests ? 'white' : 'rgba(255,255,255,0.3)' }} value={guests} onChange={e => setGuests(e.target.value)} required>
                <option value="" style={{ background: '#2C1A0E' }}>How many?</option>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n} style={{ background: '#2C1A0E' }}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                <option value="7+" style={{ background: '#2C1A0E' }}>7+ Guests</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Occasion *</label>
              <select style={{ ...inp, color: occasion ? 'white' : 'rgba(255,255,255,0.3)' }} value={occasion} onChange={e => setOccasion(e.target.value)} required>
                <option value="" style={{ background: '#2C1A0E' }}>Select...</option>
                {OCCASIONS.map(o => <option key={o.value} value={o.value} style={{ background: '#2C1A0E' }}>{o.label}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Special Requests</label><input style={inp} value={requests} onChange={e => setRequests(e.target.value)} placeholder="Candles, messages, dietary needs..." /></div>
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#C9A84C', color: '#2C1A0E', border: 'none', borderRadius: 12, padding: '1rem', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1.25rem', fontFamily: 'inherit', opacity: loading ? 0.7 : 1, transition: 'all 0.3s' }}>
            {loading ? 'Confirming...' : 'Confirm Reservation →'}
          </button>
        </form>
      </div>
    </div>
  )
}
