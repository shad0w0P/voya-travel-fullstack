import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';

const destinations = [
  { name: 'Kyoto', country: 'Japan', img: 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=800&q=80', price: '$3,200' },
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80', price: '$2,800' },
  { name: 'Marrakech', country: 'Morocco', img: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80', price: '$1,900' },
  { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', price: '$2,100' },
  { name: 'Patagonia', country: 'Argentina', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', price: '$4,100' },
  { name: 'Maldives', country: 'Maldives', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', price: '$5,500' },
];

const services = [
  { icon: '✈', label: 'Flights', to: '/flights', desc: 'Domestic & International' },
  { icon: '🚂', label: 'Trains', to: '/trains', desc: 'Rail bookings & PNR' },
  { icon: '🚌', label: 'Buses', to: '/buses', desc: 'Intercity & overnight' },
  { icon: '🏨', label: 'Hotels', to: '/hotels', desc: 'Curated stays worldwide' },
  { icon: '🚇', label: 'Metro', to: '/metro', desc: 'City transit maps' },
  { icon: '🗺', label: 'Map', to: '/map', desc: 'Explore destinations' },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [heroLoaded, setHeroLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setTimeout(() => setHeroLoaded(true), 100); }, []);

  return (
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroBg}></div>
        <div style={{...styles.heroContent, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1.2s ease'}}>
          <p style={styles.heroTag}>✦ Curated Travel Experiences</p>
          <h1 style={styles.heroTitle}>Travel <em style={{fontStyle:'italic', color:'#e8d5a3'}}>Beyond</em><br/>Ordinary</h1>
          <p style={styles.heroSub}>Crafting extraordinary journeys for the world's most curious travellers.</p>
          <div style={styles.heroSearch}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Where do you want to go?" style={styles.searchInput} />
            <button onClick={() => navigate(`/hotels?city=${searchQuery}`)} className="btn-gold" style={{flexShrink:0, borderRadius:'0 4px 4px 0'}}>Search</button>
          </div>
          <div style={styles.heroLinks}>
            {services.map(s => (
              <Link key={s.label} to={s.to} style={styles.heroLink}>
                <span style={styles.heroLinkIcon}>{s.icon}</span>
                <span style={{fontSize:'0.75rem'}}>{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div style={styles.serviceSection}>
        <div style={{textAlign:'center', marginBottom:'3rem'}}>
          <p style={{fontSize:'0.65rem', letterSpacing:'0.35em', textTransform:'uppercase', color:'#c9a96e', marginBottom:'1rem'}}>Everything You Need</p>
          <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(2rem,4vw,3rem)', fontWeight:300}}>Plan Your <em style={{fontStyle:'italic', color:'#e8d5a3'}}>Complete</em> Trip</h2>
        </div>
        <div style={styles.servicesGrid}>
          {services.map(s => (
            <Link key={s.label} to={s.to} style={styles.serviceCard}>
              <div style={styles.serviceIcon}>{s.icon}</div>
              <h3 style={styles.serviceName}>{s.label}</h3>
              <p style={styles.serviceDesc}>{s.desc}</p>
              <span style={styles.serviceArrow}>→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Destinations */}
      <div style={styles.destSection}>
        <div style={styles.destHeader}>
          <div>
            <p style={{fontSize:'0.65rem', letterSpacing:'0.35em', textTransform:'uppercase', color:'#c9a96e', marginBottom:'0.5rem'}}>Explore the World</p>
            <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(2rem,4vw,3rem)', fontWeight:300}}>Featured <em style={{fontStyle:'italic', color:'#e8d5a3'}}>Destinations</em></h2>
          </div>
          <Link to="/hotels" style={{fontSize:'0.75rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#c9a96e', borderBottom:'1px solid rgba(201,169,110,0.3)', paddingBottom:'2px'}}>View All →</Link>
        </div>
        <div style={styles.destGrid}>
          {destinations.map((d, i) => (
            <Link key={d.name} to={`/hotels?city=${d.name}`} style={{...styles.destCard, gridColumn: i === 0 ? 'span 2' : 'span 1', gridRow: i === 0 ? 'span 2' : 'span 1'}}>
              <img src={d.img} alt={d.name} style={styles.destImg} />
              <div style={styles.destOverlay}>
                <p style={{fontSize:'0.55rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#c9a96e', marginBottom:'0.3rem'}}>{d.country}</p>
                <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize: i === 0 ? '2.5rem' : '1.5rem', fontWeight:300}}>{d.name}</h3>
                <p style={{fontSize:'0.8rem', color:'rgba(245,240,232,0.7)', marginTop:'0.3rem'}}>From {d.price} / person</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsBar}>
        {[['12K+','Journeys Crafted'],['94','Destinations'],['98%','Satisfaction'],['6','Years Excellence']].map(([n,l]) => (
          <div key={l} style={styles.stat}>
            <div style={styles.statNum}>{n}</div>
            <div style={styles.statLabel}>{l}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={styles.cta}>
        <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(2rem,5vw,4rem)', fontWeight:300, marginBottom:'1.5rem'}}>Ready to <em style={{fontStyle:'italic', color:'#e8d5a3'}}>Explore?</em></h2>
        <p style={{color:'#8a8278', marginBottom:'2.5rem', maxWidth:'400px', margin:'0 auto 2.5rem'}}>Create your account and start planning your dream journey today.</p>
        <div style={{display:'flex', gap:'1rem', justifyContent:'center'}}>
          <Link to="/register" className="btn-gold">Get Started</Link>
          <Link to="/map" className="btn-outline">Explore Map</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  hero: { position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: '80px' },
  heroBg: { position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,9,6,0.4) 0%, rgba(10,9,6,0.75) 60%, rgba(10,9,6,1) 100%), url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80) center/cover' },
  heroContent: { position: 'relative', textAlign: 'center', padding: '0 2rem', maxWidth: '800px' },
  heroTag: { fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '1.5rem' },
  heroTitle: { fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: 300, lineHeight: '0.95', marginBottom: '1.5rem' },
  heroSub: { color: '#8a8278', fontSize: '1rem', marginBottom: '2.5rem' },
  heroSearch: { display: 'flex', maxWidth: '500px', margin: '0 auto 2.5rem', border: '1px solid rgba(201,169,110,0.3)', borderRadius: '4px', overflow: 'hidden' },
  searchInput: { flex: 1, background: 'rgba(30,28,24,0.9)', border: 'none', borderRadius: '4px 0 0 4px', padding: '1rem 1.5rem', color: '#f5f0e8', fontSize: '0.95rem', outline: 'none' },
  heroLinks: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  heroLink: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(201,169,110,0.15)', borderRadius: '8px', color: '#f5f0e8', transition: 'all 0.3s', backdropFilter: 'blur(10px)' },
  heroLinkIcon: { fontSize: '1.4rem' },
  serviceSection: { padding: '6rem 2rem', background: '#1e1c18', maxWidth: '1280px', margin: '0 auto' },
  servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' },
  serviceCard: { background: '#0a0906', border: '1px solid rgba(201,169,110,0.1)', borderRadius: '8px', padding: '2rem', transition: 'all 0.3s', display: 'block' },
  serviceIcon: { fontSize: '2rem', marginBottom: '1rem' },
  serviceName: { fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 300, marginBottom: '0.5rem' },
  serviceDesc: { fontSize: '0.8rem', color: '#8a8278', marginBottom: '1rem' },
  serviceArrow: { color: '#c9a96e', fontSize: '1.2rem' },
  destSection: { padding: '6rem 2rem', maxWidth: '1280px', margin: '0 auto' },
  destHeader: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem' },
  destGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(3, 200px)', gap: '2px' },
  destCard: { position: 'relative', overflow: 'hidden', display: 'block' },
  destImg: { width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)', transition: 'transform 0.6s, filter 0.4s' },
  destOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,6,0.85) 0%, transparent 60%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem' },
  statsBar: { background: '#c9a96e', color: '#0a0906', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' },
  stat: { padding: '3rem 2rem', textAlign: 'center', borderRight: '1px solid rgba(10,9,6,0.15)' },
  statNum: { fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 300, marginBottom: '0.3rem' },
  statLabel: { fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.7 },
  cta: { padding: '8rem 2rem', textAlign: 'center', background: '#1e1c18' }
};
