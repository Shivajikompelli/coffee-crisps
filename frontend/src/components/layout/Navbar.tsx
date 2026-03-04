"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { itemCount, setOpen } = useCartStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/menu', label: 'Menu' },
    { href: '/reserve', label: 'Reserve' },
    { href: '/loyalty', label: 'Rewards' },
    { href: '/events', label: 'Events' },
  ]

  const navStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    padding: scrolled ? '0.85rem 3.5rem' : '1.25rem 3.5rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    transition: 'all 0.3s ease',
    background: scrolled ? 'rgba(245,240,232,0.96)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(196,168,130,0.3)' : 'none',
    boxShadow: scrolled ? '0 4px 30px rgba(44,26,14,0.08)' : 'none',
  }

  return (
    <nav style={navStyle}>
      <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, textDecoration: 'none', color: scrolled ? '#2C1A0E' : 'white', letterSpacing: '0.02em' }}>
        Coffee <span style={{ color: '#C9A84C' }}>&</span> Crisps
      </Link>

      {/* Desktop */}
      <ul style={{ display: 'flex', alignItems: 'center', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }} className="hidden-mobile">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} style={{ fontSize: '0.78rem', fontWeight: 500, color: scrolled ? '#7A6245' : 'rgba(255,255,255,0.85)', textDecoration: 'none', letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'color 0.3s' }}>
              {l.label}
            </Link>
          </li>
        ))}
        <li>
          <button onClick={() => setOpen(true)} style={{ position: 'relative', padding: '0.5rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={18} color={scrolled ? '#2C1A0E' : 'white'} />
            {itemCount > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: '#C9A84C', color: '#2C1A0E', width: 20, height: 20, borderRadius: '50%', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {itemCount}
              </span>
            )}
          </button>
        </li>
        <li>
          <Link href="/reserve" style={{ background: '#C9A84C', color: '#2C1A0E', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.6rem 1.4rem', borderRadius: '100px', textDecoration: 'none' }}>
            Book Table
          </Link>
        </li>
      </ul>

      {/* Mobile hamburger */}
      <button style={{ display: 'none', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }} className="show-mobile" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X color={scrolled ? '#2C1A0E' : 'white'} size={24} /> : <Menu color={scrolled ? '#2C1A0E' : 'white'} size={24} />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: '#2C1A0E', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
          <button style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => setMenuOpen(false)}>
            <X color="white" size={28} />
          </button>
          {links.map((l) => (
            <Link key={l.href} href={l.href} style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'white', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/reserve" style={{ background: '#C9A84C', color: '#2C1A0E', fontWeight: 700, padding: '0.9rem 2.5rem', borderRadius: '100px', textDecoration: 'none', marginTop: '1rem' }} onClick={() => setMenuOpen(false)}>
            Book a Table
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
