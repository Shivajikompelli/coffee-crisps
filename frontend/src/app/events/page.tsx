import React from 'react'

export default function EventsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#EDE5D0', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9B7B52', marginBottom: '0.6rem' }}>
            Events and Collaborations
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: '#2C1A0E', fontWeight: 400 }}>
            Create <em>Memories</em> With Us
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', minHeight: 360 }}>
            <img src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=700&q=80" alt="Private Events" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(44,26,14,0.92), transparent)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '2rem' }}>
              <span style={{ background: '#C9A84C', color: '#2C1A0E', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.3rem 0.9rem', borderRadius: 100, display: 'inline-block', marginBottom: '0.75rem' }}>Private Events</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'white', marginBottom: '0.5rem' }}>Book the Entire Cafe</h2>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1rem' }}>Host your birthday, kitty party, or corporate event in our exclusive private setting.</p>
              <a href="/reserve" style={{ color: '#C9A84C', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Enquire Now</a>
            </div>
          </div>

          <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', minHeight: 360 }}>
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=80" alt="Influencer Collabs" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(44,26,14,0.92), transparent)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '2rem' }}>
              <span style={{ background: '#C9A84C', color: '#2C1A0E', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.3rem 0.9rem', borderRadius: 100, display: 'inline-block', marginBottom: '0.75rem' }}>Influencer Collabs</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'white', marginBottom: '0.5rem' }}>Create Content Here</h2>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1rem' }}>We welcome creators, food bloggers, and photographers to collaborate and showcase their craft.</p>
              <a href="/reserve" style={{ color: '#C9A84C', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Enquire Now</a>
            </div>
          </div>

          <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', minHeight: 360 }}>
            <img src="https://images.unsplash.com/photo-1555244162-803834f70033?w=700&q=80" alt="Custom Catering" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(44,26,14,0.92), transparent)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '2rem' }}>
              <span style={{ background: '#C9A84C', color: '#2C1A0E', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.3rem 0.9rem', borderRadius: 100, display: 'inline-block', marginBottom: '0.75rem' }}>Custom Catering</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'white', marginBottom: '0.5rem' }}>We Come to You</h2>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1rem' }}>Office lunches, family gatherings, and special occasions catered with our full menu.</p>
              <a href="/reserve" style={{ color: '#C9A84C', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Enquire Now</a>
            </div>
          </div>

          <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', minHeight: 360 }}>
            <img src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=700&q=80" alt="Date Night" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(44,26,14,0.92), transparent)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '2rem' }}>
              <span style={{ background: '#C9A84C', color: '#2C1A0E', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.3rem 0.9rem', borderRadius: 100, display: 'inline-block', marginBottom: '0.75rem' }}>Date Night Package</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'white', marginBottom: '0.5rem' }}>Special Date Packages</h2>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1rem' }}>Candlelight setup, curated 3-course meal, and personalized service for an unforgettable evening.</p>
              <a href="/reserve" style={{ color: '#C9A84C', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Enquire Now</a>
            </div>
          </div>

        </div>

        <div style={{ marginTop: '3rem', background: '#2C1A0E', borderRadius: 24, padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'white', marginBottom: '0.75rem' }}>
            Have a custom requirement?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Reach out via WhatsApp for instant response.
          </p>
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{ background: '#C9A84C', color: '#2C1A0E', padding: '0.9rem 2.5rem', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block' }}>
            WhatsApp Us
          </a>
        </div>

      </div>
    </div>
  )
}