import Link from 'next/link'

export default function Footer() {
  const cols = [
    { title: 'Quick Links', links: [['Menu', '/menu'], ['Reserve', '/reserve'], ['Rewards', '/loyalty'], ['Events', '/events']] },
    { title: 'Signature', links: [['Korean Fried Chicken', '/menu'], ['Espresso Hot Choc', '/menu'], ['Mango Mousse', '/menu'], ['Combos', '/menu']] },
    { title: 'Legal', links: [['Privacy Policy', '#'], ['Refund Policy', '#'], ['Terms', '#'], ['Allergen Info', '#']] },
  ]

  return (
    <footer style={{ background: '#1A1410', borderTop: '1px solid rgba(245,240,232,0.05)', padding: '5rem 4rem 3rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: '1rem' }}>
              Coffee <span style={{ color: '#C9A84C' }}>&</span> Crisps
            </p>
            <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.85rem', lineHeight: 1.8, maxWidth: 260 }}>
              {"Saroornagar's most aesthetic café — specialty coffee meets soulful food in a space designed for memories."}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {['📸', '📘', '💬', '📍'].map((icon, i) => (
                <a key={i} href="#" style={{ width: 38, height: 38, background: 'rgba(245,240,232,0.05)', border: '1px solid rgba(245,240,232,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '1rem' }}>{icon}</a>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: '1rem', marginBottom: '1.25rem', fontWeight: 600 }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.85rem', textDecoration: 'none' }}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(245,240,232,0.06)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'rgba(245,240,232,0.2)', fontSize: '0.78rem' }}>© 2025 Coffee & Crisps Café. Saroornagar, Hyderabad.</p>
          <p style={{ color: '#C9A84C', fontSize: '0.8rem' }}>⭐ 4.6 on Google · 2.5K+ Instagram</p>
        </div>
      </div>
    </footer>
  )
}
