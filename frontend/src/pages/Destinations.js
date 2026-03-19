import React, { useState } from 'react';

const DESTINATIONS = [
  { name: 'Goa', country: 'India', category: 'beach', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&q=70', desc: 'Beaches, nightlife & Portuguese heritage.', price: 8000 },
  { name: 'Manali', country: 'India', category: 'mountain', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&q=70', desc: 'Snow peaks, adventure sports & serene valleys.', price: 12000 },
  { name: 'Jaipur', country: 'India', category: 'cultural', img: 'https://images.unsplash.com/photo-1477587458883-47145ed31e?w=500&q=70', desc: 'Pink City — forts, palaces & desert safari.', price: 9000 },
  { name: 'Kyoto', country: 'Japan', category: 'cultural', img: 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=500&q=70', desc: 'Temples, geishas & cherry blossoms.', price: 85000 },
  { name: 'Maldives', country: 'Maldives', category: 'beach', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=70', desc: 'Overwater villas & turquoise lagoons.', price: 150000 },
  { name: 'Patagonia', country: 'Argentina', category: 'mountain', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500&q=70', desc: "World's end — glaciers & dramatic peaks.", price: 200000 },
  { name: 'Santorini', country: 'Greece', category: 'beach', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=500&q=70', desc: 'Blue domes & Aegean sunsets.', price: 120000 },
  { name: 'Marrakech', country: 'Morocco', category: 'cultural', img: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=500&q=70', desc: 'Labyrinths, souks & Sahara gateway.', price: 60000 },
  { name: 'Ladakh', country: 'India', category: 'mountain', img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&q=70', desc: 'High-altitude desert & ancient monasteries.', price: 25000 },
];

export function Destinations() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const cats = ['all', 'beach', 'mountain', 'cultural', 'city'];
  const filtered = DESTINATIONS.filter(d => {
    const matchCat = filter === 'all' || d.category === filter;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> / Destinations</div>
          <h1>Explore <em>Destinations</em></h1>
        </div>
      </div>
      <div style={{ background: 'var(--ink)', padding: '2rem 0', minHeight: '80vh' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input className="form-input" placeholder="Search destinations..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {cats.map(c => (
                <button key={c} onClick={() => setFilter(c)} style={{
                  padding: '0.5rem 1rem', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  border: '1px solid', borderColor: filter === c ? 'var(--gold)' : 'var(--border)',
                  background: filter === c ? 'var(--gold)' : 'transparent',
                  color: filter === c ? 'var(--ink)' : 'var(--mist)',
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif'
                }}>{c}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {filtered.map(d => (
              <div key={d.name} className="card" style={{ overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ overflow: 'hidden', height: 220 }}>
                  <img src={d.img} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.75)', transition: 'transform 0.5s, filter 0.4s' }}
                    onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.filter = 'saturate(0.9)'; }}
                    onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.filter = 'saturate(0.75)'; }}
                  />
                </div>
                <div style={{ padding: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem' }}>{d.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--mist)' }}>{d.country}</div>
                    </div>
                    <span className="badge badge-gold" style={{ fontSize: '0.55rem', height: 'fit-content' }}>{d.category}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--mist)', lineHeight: 1.7, marginBottom: '1rem' }}>{d.desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.8rem' }}>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--mist)', letterSpacing: '0.1em' }}>FROM</div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem' }}>₹{d.price.toLocaleString('en-IN')}</div>
                    </div>
                    <a href="/flights" className="btn btn-outline btn-sm">Explore</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Destinations;
