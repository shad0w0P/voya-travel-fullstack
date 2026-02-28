import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const isHome = location.pathname === '/';

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    padding: '0 2rem',
    background: scrolled || !isHome ? 'rgba(10,9,6,0.97)' : 'transparent',
    borderBottom: scrolled || !isHome ? '1px solid rgba(201,169,110,0.1)' : 'none',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    transition: 'all 0.4s',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '70px'
  };

  const links = [
    { to: '/destinations', label: 'Destinations' },
    { to: '/flights', label: 'Flights' },
    { to: '/trains', label: 'Trains' },
    { to: '/buses', label: 'Buses' },
    { to: '/metro', label: 'Metro' },
    { to: '/hotels', label: 'Hotels' },
    { to: '/map', label: 'Map' },
  ];

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.4em', color: 'var(--cream)', textDecoration: 'none' }}>
        VOY<span style={{ color: 'var(--gold)' }}>A</span>
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{
            fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: location.pathname === l.to ? 'var(--gold)' : 'var(--mist)',
            textDecoration: 'none', transition: 'color 0.3s'
          }}
            onMouseEnter={e => { if (location.pathname !== l.to) e.target.style.color = 'var(--cream)'; }}
            onMouseLeave={e => { if (location.pathname !== l.to) e.target.style.color = 'var(--mist)'; }}
          >{l.label}</Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
        {user ? (
          <>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.5rem' }}
            >
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gold-dim)', border: '1px solid rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--gold)' }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>{user.name.split(' ')[0]}</span>
              <span style={{ fontSize: '0.5rem', color: 'var(--mist)' }}>▼</span>
            </div>
            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0,
                background: 'var(--ash)', border: '1px solid var(--border)',
                minWidth: 180, zIndex: 100, marginTop: '0.5rem'
              }}>
                {[
                  { to: '/profile', label: 'Profile' },
                  { to: '/my-bookings', label: 'My Bookings' },
                  ...(isAdmin ? [{ to: '/admin', label: 'Admin Panel' }] : []),
                ].map(item => (
                  <Link key={item.to} to={item.to} onClick={() => setDropdownOpen(false)} style={{
                    display: 'block', padding: '0.75rem 1.2rem',
                    fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--mist)', textDecoration: 'none', transition: 'all 0.2s',
                    borderBottom: '1px solid var(--border)'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.background = 'var(--gold-dim)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--mist)'; e.currentTarget.style.background = 'transparent'; }}
                  >{item.label}</Link>
                ))}
                <button onClick={() => { setDropdownOpen(false); handleLogout(); }} style={{
                  display: 'block', width: '100%', padding: '0.75rem 1.2rem', background: 'none', border: 'none',
                  textAlign: 'left', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#e07070', cursor: 'pointer'
                }}>Sign Out</button>
              </div>
            )}
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--mist)', textDecoration: 'none' }}>Sign In</Link>
            <Link to="/register" className="btn btn-outline btn-sm">Join</Link>
          </>
        )}
      </div>
    </nav>
  );
}
