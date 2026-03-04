import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Coffee & Crisps Café | Best Aesthetic Café in Saroornagar, Hyderabad',
  description: "Experience Hyderabad's most aesthetic café in Saroornagar. Korean Fried Chicken, specialty coffee, cozy ambience.",
}

const DISHES = [
  { name: 'Korean Fried Chicken', desc: 'Double-fried, gochujang glaze, sesame, spring onions', price: '₹320', tag: 'Bestseller', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80' },
  { name: 'Chicken Mexican Rice', desc: 'Spiced chicken, roasted corn, jalapeños, chipotle cream', price: '₹280', tag: "Chef's Pick", img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80' },
  { name: 'Espresso Hot Chocolate', desc: 'Belgian chocolate, double espresso, whipped cream, gold dust', price: '₹180', tag: 'Signature', img: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&q=80' },
  { name: 'Mango Mousse', desc: 'Alphonso mousse, mango compote, sponge crumble, mint crown', price: '₹160', tag: 'Seasonal', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&q=80' },
]

const REVIEWS = [
  { name: 'Priya R.', text: 'Absolutely love this place! The Korean Fried Chicken is to die for. Every corner is a photo opportunity. Highly recommend for a date night!', stars: 5, date: '2 weeks ago' },
  { name: 'Rahul M.', text: "Best café in Saroornagar, period. The Espresso Hot Chocolate is unlike anything I've had. Staff is super friendly.", stars: 5, date: '1 month ago' },
  { name: 'Sneha K.', text: 'Came for a birthday dinner and they made it so special. Custom balloon setup, complimentary dessert. 10/10!', stars: 5, date: '3 weeks ago' },
  { name: 'Aakash T.', text: 'Food quality is consistently excellent. Mango Mousse is heavenly. Great for dates or solo with a book.', stars: 4, date: '1 month ago' },
]

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(160deg, rgba(44,26,14,0.75) 0%, rgba(107,79,42,0.55) 50%, rgba(44,26,14,0.88) 100%), url(https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1800&q=85) center/cover no-repeat' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 860, padding: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)', padding: '0.4rem 1.1rem', borderRadius: 100, color: '#C9A84C', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            4.6 Rating &bull; 1,275+ Reviews &bull; Saroornagar, Hyderabad
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem,8vw,6.5rem)', fontWeight: 300, color: 'white', lineHeight: 1.05, marginBottom: '0.75rem' }}>
            We are Brewing<br /><em style={{ color: '#C9A84C' }}>Something Special</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem,2.5vw,1.4rem)', color: 'rgba(245,240,232,0.7)', fontStyle: 'italic', marginBottom: '2.5rem', fontWeight: 300 }}>
            Where every sip tells a story and every bite is a memory
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/reserve" style={{ background: '#C9A84C', color: '#2C1A0E', padding: '0.9rem 2.2rem', borderRadius: 100, fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
              Reserve a Table
            </Link>
            <Link href="/menu" style={{ border: '1.5px solid rgba(245,240,232,0.5)', color: 'white', padding: '0.9rem 2.2rem', borderRadius: 100, fontWeight: 500, fontSize: '0.88rem', textDecoration: 'none' }}>
              Explore Menu
            </Link>
            <Link href="/order" style={{ background: '#2C1A0E', color: '#F5F0E8', padding: '0.9rem 2.2rem', borderRadius: 100, fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
              Order Online
            </Link>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '2.5rem', right: '3rem', display: 'flex', gap: '2rem' }}>
          {[['4.6', 'Google Rating'], ['2.5K+', 'Instagram'], ['1275', 'Reviews']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: '#C9A84C', display: 'block' }}>{num}</span>
              <span style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SIGNATURE DISHES */}
      <section style={{ padding: '7rem 4rem', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9B7B52', marginBottom: '0.75rem' }}>Signature Creations</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#2C1A0E', fontWeight: 400 }}>
              Dishes That Define <em>Our Story</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.5rem' }}>
            {DISHES.map((dish) => (
              <div key={dish.name} style={{ background: 'white', borderRadius: 20, overflow: 'hidden', border: '1px solid #EDE5D0' }}>
                <div style={{ position: 'relative' }}>
                  <img src={dish.img} alt={dish.name} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                  <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: '#C9A84C', color: '#2C1A0E', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.3rem 0.7rem', borderRadius: 100 }}>{dish.tag}</span>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: '#2C1A0E', marginBottom: '0.4rem' }}>{dish.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#7A6245', lineHeight: 1.6, marginBottom: '1rem' }}>{dish.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, color: '#6B4F2A' }}>{dish.price}</span>
                    <Link href="/menu" style={{ background: '#2C1A0E', color: 'white', borderRadius: '50%', width: 36, height: 36, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>+</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/menu" style={{ background: '#2C1A0E', color: '#F5F0E8', padding: '0.9rem 2.5rem', borderRadius: 100, fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-block' }}>
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: '6rem 4rem', background: '#EDE5D0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9B7B52', marginBottom: '0.75rem' }}>What Guests Say</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', color: '#2C1A0E', fontWeight: 400, marginBottom: '1.5rem' }}>
              Stories from Our <em>Community</em>
            </h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: 'white', borderRadius: 20, padding: '1.25rem 2rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 700, color: '#2C1A0E', lineHeight: 1 }}>4.6</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#C9A84C', fontSize: '1.1rem' }}>★★★★★</div>
                <div style={{ fontWeight: 600, color: '#2C1A0E', fontSize: '0.9rem' }}>Exceptional</div>
                <div style={{ fontSize: '0.8rem', color: '#7A6245' }}>Based on 1,275 Google Reviews</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '1rem' }}>
            {REVIEWS.map((r) => (
              <div key={r.name} style={{ minWidth: 300, background: 'white', borderRadius: 20, padding: '2rem', flexShrink: 0, border: '1px solid rgba(196,168,130,0.2)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: '#C9A84C', lineHeight: 0.5, marginBottom: '0.5rem' }}>"</div>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: '#2C1A0E', marginBottom: '1.25rem' }}>{r.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#D9C9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2C1A0E', flexShrink: 0 }}>{r.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#2C1A0E' }}>{r.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#7A6245' }}>{'★'.repeat(r.stars)} · {r.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section style={{ padding: '5rem 4rem', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9B7B52', marginBottom: '0.75rem' }}>Find Us</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', color: '#2C1A0E', fontWeight: 400, marginBottom: '2rem' }}>Come Say <em>Hello</em></h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, background: '#F5F0E8', border: '1px solid #EDE5D0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>📍</div>
              <div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7A6245', marginBottom: '0.3rem' }}>Address</div>
                <div style={{ fontSize: '0.9rem', color: '#2C1A0E', fontWeight: 500, lineHeight: 1.6 }}>Rd Number 1, Jincala Bhavi Colony, Doctors Colony{'\n'}Saroornagar, Hyderabad – 500035</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, background: '#F5F0E8', border: '1px solid #EDE5D0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🕐</div>
              <div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7A6245', marginBottom: '0.3rem' }}>Hours</div>
                <div style={{ fontSize: '0.9rem', color: '#2C1A0E', fontWeight: 500, lineHeight: 1.6 }}>Mon–Fri: 11:00 AM – 10:30 PM{'\n'}Sat–Sun: 10:00 AM – 11:00 PM</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, background: '#F5F0E8', border: '1px solid #EDE5D0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>💰</div>
              <div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7A6245', marginBottom: '0.3rem' }}>Price Range</div>
                <div style={{ fontSize: '0.9rem', color: '#2C1A0E', fontWeight: 500, lineHeight: 1.6 }}>₹800 – ₹1,100 for two people</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ background: '#C9A84C', color: '#2C1A0E', padding: '0.85rem 1.75rem', borderRadius: 100, fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}>WhatsApp</a>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{ background: '#2C1A0E', color: '#F5F0E8', padding: '0.85rem 1.75rem', borderRadius: 100, fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}>Get Directions</a>
            </div>
          </div>
          <div style={{ borderRadius: 24, overflow: 'hidden', height: 360, border: '1px solid #EDE5D0' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60921.66!2d78.541!3d17.370!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcba324eca09ecf%3A0x9c72a6a891234567!2sSaroornagar%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading={"lazy" as "lazy"}
              referrerPolicy={"no-referrer-when-downgrade" as ReferrerPolicy}
              title="Coffee and Crisps Cafe Location"
            />
          </div>
        </div>
      </section>
    </>
  )
}
