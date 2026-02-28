import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const services = [
  { icon: '✈', label: 'Flights', desc: 'Domestic & international flights', to: '/flights', color: '#4a90d9' },
  { icon: '🚂', label: 'Trains', desc: 'Book Indian Railways & more', to: '/trains', color: '#e8a838' },
  { icon: '🚌', label: 'Buses', desc: 'AC, Sleeper, Volvo buses', to: '/buses', color: '#6fcf97' },
  { icon: '🚇', label: 'Metro', desc: 'City metro passes & routes', to: '/metro', color: '#bb6bd9' },
  { icon: '🏨', label: 'Hotels', desc: 'Budget to luxury stays', to: '/hotels', color: '#eb5757' },
  { icon: '🗺', label: 'Explore Map', desc: 'Interactive destination map', to: '/map', color: 'var(--gold)' },
];

const destinations = [
  { name: 'Kyoto', country: 'Japan', img: 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=600&q=75', tag: 'Trending' },
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=75' },
  { name: 'Marrakech', country: 'Morocco', img: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=75' },
  { name: 'Maldives', country: 'Indian Ocean', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=75', tag: 'Featured' },
];

export default function Home() {
  const { user } = useAuth();
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      {/* HERO */}
      <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 2rem 5rem' }}>
        <div ref={heroRef} style={{
          position: 'absolute', inset: 0,
          background: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80) center/cover',
          filter: 'brightness(0.6) saturate(0.7)',
          willChange: 'transform'
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,9,6,0.2) 0%, rgba(10,9,6,0.65) 60%, rgba(10,9,6,0.97) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1320, margin: '0 auto', width: '100%' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
            All Travel, One Platform
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(4rem, 9vw, 10rem)', fontWeight: 300, lineHeight: 0.88, marginBottom: '2.5rem' }}>
            Travel<br /><em>Beyond</em><br />Ordinary
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <p style={{ maxWidth: 360, fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--mist)' }}>
              Flights · Trains · Buses · Metro · Hotels — discover and book everything for your perfect journey.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {user ? (
                <Link to="/flights" className="btn btn-primary">Start Booking</Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">Get Started</Link>
                  <Link to="/destinations" className="btn btn-ghost">Explore</Link>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div style={{ position: 'absolute', right: '2rem', bottom: '3rem', writingMode: 'vertical-rl', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--mist)' }}>
          Scroll ↓
        </div>
      </div>

      {/* SERVICES */}
      <div style={{ background: 'var(--ash-2)', borderTop: '1px solid var(--border)', padding: '5rem 0' }}>
        <div className="container">
          <div className="section-label">Everything You Need</div>
          <h2 className="section-title" style={{ marginBottom: '3rem' }}>Book All Your<br /><em>Travel Needs</em></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1px', background: 'var(--border)' }}>
            {services.map(s => (
              <Link key={s.label} to={s.to} style={{
                background: 'var(--ash)', padding: '2rem 1.5rem', textDecoration: 'none',
                display: 'block', transition: 'background 0.3s', textAlign: 'center'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--ash-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--ash)'}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>{s.icon}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--cream)', marginBottom: '0.3rem' }}>{s.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--mist)', lineHeight: 1.5 }}>{s.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div style={{ padding: '5rem 0', background: 'var(--ink)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <div className="section-label">Featured Destinations</div>
              <h2 className="section-title">Where Will You<br /><em>Discover?</em></h2>
            </div>
            <Link to="/destinations" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none' }}>All Destinations →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '320px 220px', gap: '2px' }}>
            {destinations.map((d, i) => (
              <div key={d.name} style={{
                position: 'relative', overflow: 'hidden', cursor: 'pointer',
                gridRow: i === 0 ? '1 / 3' : undefined
              }}>
                <img src={d.img} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7) saturate(0.75)', transition: 'transform 0.7s, filter 0.5s' }}
                  onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.filter = 'brightness(0.6) saturate(0.85)'; }}
                  onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.filter = 'brightness(0.7) saturate(0.75)'; }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,6,0.85) 0%, transparent 55%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>{d.country}</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: i === 0 ? '2.5rem' : '1.8rem', fontWeight: 300 }}>{d.name}</div>
                </div>
                {d.tag && (
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--red)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.3rem 0.7rem' }}>{d.tag}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ background: 'var(--gold)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[['12K+', 'Journeys Booked'], ['94', 'Destinations'], ['5', 'Transport Modes'], ['98%', 'Satisfaction']].map(([val, label]) => (
          <div key={label} style={{ padding: '3rem', textAlign: 'center', borderRight: '1px solid rgba(10,9,6,0.15)' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5rem', fontWeight: 300, color: 'var(--ink)', lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(10,9,6,0.65)', marginTop: '0.5rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ background: 'var(--ash)', padding: '6rem 0', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-label" style={{ justifyContent: 'center' }}>Ready to Explore?</div>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>Your Journey Starts<br /><em>Right Here</em></h2>
          <p style={{ color: 'var(--mist)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            Create your free account and book flights, trains, buses, metro passes, and hotels all in one place.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary">Join Free</Link>
            <Link to="/map" className="btn btn-ghost">Explore Map</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
