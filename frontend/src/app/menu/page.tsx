"use client"
import { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import { menuApi } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { MenuItem } from '@/types'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { slug: 'all', label: 'All', icon: '🍽' },
  { slug: 'coffee', label: 'Coffee', icon: '☕' },
  { slug: 'hotchoc', label: 'Hot Chocolate', icon: '🍫' },
  { slug: 'starters', label: 'Starters', icon: '🍟' },
  { slug: 'korean', label: 'Korean Specials', icon: '🇰🇷' },
  { slug: 'mains', label: 'Mains', icon: '🍽' },
  { slug: 'rice', label: 'Rice Bowls', icon: '🍚' },
  { slug: 'desserts', label: 'Desserts', icon: '🍰' },
  { slug: 'combos', label: 'Combos', icon: '🎁' },
]

// Fallback menu data for when backend isn't running
const FALLBACK_MENU: MenuItem[] = [
  { id: '1', name: 'Korean Fried Chicken', slug: 'kfc', description: 'Double-fried, gochujang glaze, sesame, spring onion', price: 320, image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300&q=70', category: 'korean', category_name: 'Korean Specials', is_veg: false, is_vegan: false, is_gluten_free: false, is_available: true, is_featured: true, is_bestseller: true, badge_text: 'Bestseller', spice_level: 'medium', prep_time_minutes: 20 },
  { id: '2', name: 'Chicken Mexican Rice', slug: 'cmr', description: 'Spiced chicken, roasted corn, jalapeños, chipotle cream', price: 280, image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&q=70', category: 'mains', category_name: 'Mains', is_veg: false, is_vegan: false, is_gluten_free: false, is_available: true, is_featured: true, is_bestseller: false, badge_text: "Chef's Pick", spice_level: 'mild', prep_time_minutes: 18 },
  { id: '3', name: 'Espresso Hot Chocolate', slug: 'ehc', description: 'Belgian chocolate + double espresso + whipped cream + gold dust', price: 180, image_url: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=300&q=70', category: 'hotchoc', category_name: 'Hot Chocolate', is_veg: true, is_vegan: false, is_gluten_free: true, is_available: true, is_featured: true, is_bestseller: false, badge_text: 'Signature', spice_level: 'none', prep_time_minutes: 8 },
  { id: '4', name: 'Mango Mousse', slug: 'mm', description: 'Alphonso mango mousse, compote, sponge crumble, mint crown', price: 160, image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&q=70', category: 'desserts', category_name: 'Desserts', is_veg: true, is_vegan: false, is_gluten_free: false, is_available: true, is_featured: true, is_bestseller: false, badge_text: 'Seasonal', spice_level: 'none', prep_time_minutes: 5 },
  { id: '5', name: 'Cappuccino', slug: 'cap', description: 'Velvety microfoam meets bold espresso', price: 120, image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&q=70', category: 'coffee', category_name: 'Coffee', is_veg: true, is_vegan: false, is_gluten_free: true, is_available: true, is_featured: false, is_bestseller: false, spice_level: 'none', prep_time_minutes: 5 },
  { id: '6', name: 'Cold Brew', slug: 'cb', description: '12-hour cold steeped, smooth & bold', price: 150, image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=70', category: 'coffee', category_name: 'Coffee', is_veg: true, is_vegan: true, is_gluten_free: true, is_available: true, is_featured: false, is_bestseller: false, spice_level: 'none', prep_time_minutes: 3 },
  { id: '7', name: 'Belgian Waffle', slug: 'bw', description: 'Crispy waffle, strawberry compote, whipped cream', price: 180, image_url: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300&q=70', category: 'desserts', category_name: 'Desserts', is_veg: true, is_vegan: false, is_gluten_free: false, is_available: true, is_featured: false, is_bestseller: false, spice_level: 'none', prep_time_minutes: 10 },
  { id: '8', name: 'Date Night Combo', slug: 'dnc', description: 'Korean Fried Chicken + 2 Coffees + 1 Dessert', price: 580, image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=70', category: 'combos', category_name: 'Combos', is_veg: false, is_vegan: false, is_gluten_free: false, is_available: true, is_featured: true, is_bestseller: false, badge_text: 'Save ₹120', spice_level: 'none', prep_time_minutes: 25 },
  { id: '9', name: 'Loaded Fries', slug: 'lf', description: 'Truffle seasoned fries, cheese sauce, chilli flakes', price: 200, image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=70', category: 'starters', category_name: 'Starters', is_veg: true, is_vegan: false, is_gluten_free: false, is_available: true, is_featured: false, is_bestseller: false, spice_level: 'mild', prep_time_minutes: 12 },
  { id: '10', name: 'Buddha Bowl', slug: 'bb', description: 'Quinoa, grilled veggies, tahini, roasted chickpeas', price: 250, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=70', category: 'rice', category_name: 'Rice Bowls', is_veg: true, is_vegan: true, is_gluten_free: true, is_available: true, is_featured: false, is_bestseller: false, spice_level: 'none', prep_time_minutes: 15 },
]

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>(FALLBACK_MENU)
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const { addItem, setOpen } = useCartStore()

  const filtered = items.filter((item) => {
    const catMatch = category === 'all' || item.category === category
    const searchMatch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase())
    return catMatch && searchMatch
  })

  useEffect(() => {
    menuApi.list().then(({ data }) => setItems(data)).catch(() => {/* use fallback */})
  }, [])

  const handleAddToCart = useCallback((item: MenuItem) => {
    addItem({ menu_item_id: item.id, name: item.name, price: item.price, image_url: item.image_url })
    toast.success(`✓ ${item.name} added`)
    setOpen(true)
  }, [addItem, setOpen])

  return (
    <div style={{ minHeight: '100vh', background: '#EDE5D0', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9B7B52', marginBottom: '0.6rem' }}>Our Menu</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#2C1A0E', fontWeight: 400 }}>Curated with <em>Love & Craft</em></h1>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: 420, margin: '0 auto 2rem', background: 'white', border: '1.5px solid #D9C9A8', borderRadius: 100, padding: '0.35rem 0.35rem 0.35rem 1.25rem' }}>
          <Search size={16} color="#7A6245" style={{ marginRight: '0.5rem', flexShrink: 0 }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dishes or drinks..."
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: '#2C1A0E', fontFamily: 'inherit' }} />
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
          {CATEGORIES.map((cat) => (
            <button key={cat.slug} onClick={() => setCategory(cat.slug)}
              style={{ padding: '0.5rem 1.2rem', borderRadius: 100, border: '1.5px solid', borderColor: category === cat.slug ? '#2C1A0E' : '#D9C9A8', background: category === cat.slug ? '#2C1A0E' : 'transparent', color: category === cat.slug ? 'white' : '#7A6245', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#7A6245' }}>No items found. Try a different search.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(380px,1fr))', gap: '1.25rem' }}>
            {filtered.map((item) => (
              <div key={item.id} style={{ background: 'white', borderRadius: 20, padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', border: '1px solid #EDE5D0', position: 'relative', transition: 'all 0.25s' }}>
                {item.is_veg && (
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', width: 16, height: 16, border: '1.5px solid #2E7D32', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2E7D32' }} />
                  </div>
                )}
                <img src={item.image_url} alt={item.name} style={{ width: 120, height: 120, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                    {item.badge_text && <span style={{ background: '#C9A84C', color: '#2C1A0E', fontSize: '0.62rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 100 }}>{item.badge_text}</span>}
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: '#2C1A0E', lineHeight: 1.2 }}>{item.name}</h3>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#7A6245', lineHeight: 1.5, marginBottom: '0.6rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: '#6B4F2A' }}>₹{item.price}</span>
                    <button onClick={() => handleAddToCart(item)} style={{ background: '#2C1A0E', color: 'white', border: 'none', borderRadius: 8, padding: '0.35rem 0.75rem', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add</button>
                    <a href={`https://wa.me/919876543210?text=Hi! I'd like to order ${item.name}`} target="_blank" rel="noreferrer"
                      style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: 8, padding: '0.35rem 0.75rem', fontSize: '0.72rem', fontWeight: 600, textDecoration: 'none' }}>
                      💬 WA
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
