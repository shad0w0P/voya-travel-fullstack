import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname.startsWith(path) ? styles.navLinkActive : {};

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>VOY<span style={{color:'#c9a96e'}}>A</span></Link>
      <div style={styles.links}>
        <Link to="/hotels" style={{...styles.navLink, ...isActive('/hotels')}}>Hotels</Link>
        <Link to="/flights" style={{...styles.navLink, ...isActive('/flights')}}>Flights</Link>
        <Link to="/trains" style={{...styles.navLink, ...isActive('/trains')}}>Trains</Link>
        <Link to="/buses" style={{...styles.navLink, ...isActive('/buses')}}>Buses</Link>
        <Link to="/metro" style={{...styles.navLink, ...isActive('/metro')}}>Metro</Link>
        <Link to="/map" style={{...styles.navLink, ...isActive('/map')}}>🗺 Map</Link>
      </div>
      <div style={styles.right}>
        {user ? (
          <div style={styles.userMenu}>
            {isAdmin && <Link to="/admin" style={styles.adminBadge}>Admin Panel</Link>}
            <Link to="/bookings" style={styles.navLink}>My Trips</Link>
            <div style={styles.avatar} onClick={() => setMenuOpen(!menuOpen)}>
              {(user.firstName?.[0] || user.username?.[0] || 'U').toUpperCase()}
              {menuOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownUser}>{user.firstName} {user.lastName}</div>
                  <div style={styles.dropdownEmail}>{user.email || user.phone || user.username}</div>
                  <hr style={{border:'none', borderTop:'1px solid rgba(201,169,110,0.1)', margin:'0.5rem 0'}} />
                  <Link to="/profile" style={styles.dropdownItem}>Profile</Link>
                  <Link to="/bookings" style={styles.dropdownItem}>My Bookings</Link>
                  {isAdmin && <Link to="/admin" style={styles.dropdownItem}>Admin Panel</Link>}
                  <button onClick={handleLogout} style={styles.dropdownLogout}>Sign Out</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={styles.authBtns}>
            <Link to="/login" style={styles.navLink}>Sign In</Link>
            <Link to="/register" className="btn-gold" style={{padding:'0.6rem 1.5rem', fontSize:'0.7rem'}}>Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: 'rgba(10,9,6,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,169,110,0.08)' },
  logo: { fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 300, letterSpacing: '0.4em', color: '#f5f0e8' },
  links: { display: 'flex', gap: '2rem' },
  navLink: { fontSize: '0.72rem', letterSpacing: '0.1em', color: '#8a8278', transition: 'color 0.3s', textTransform: 'uppercase' },
  navLinkActive: { color: '#c9a96e' },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  userMenu: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  adminBadge: { fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(139,58,42,0.3)', color: '#e8a090', border: '1px solid rgba(139,58,42,0.5)', padding: '0.4rem 0.8rem', borderRadius: '4px' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #c9a96e, #8b6a3a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: '0.85rem', color: '#0a0906', cursor: 'pointer', position: 'relative', flexShrink: 0 },
  dropdown: { position: 'absolute', top: '110%', right: 0, background: '#1e1c18', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '8px', minWidth: '200px', padding: '0.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 200 },
  dropdownUser: { padding: '0.5rem 0.8rem', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#f5f0e8' },
  dropdownEmail: { padding: '0 0.8rem 0.5rem', fontSize: '0.75rem', color: '#8a8278' },
  dropdownItem: { display: 'block', padding: '0.5rem 0.8rem', fontSize: '0.8rem', color: '#8a8278', transition: 'color 0.3s', borderRadius: '4px' },
  dropdownLogout: { display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 0.8rem', fontSize: '0.8rem', color: '#e57373', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px' },
  authBtns: { display: 'flex', alignItems: 'center', gap: '1.5rem' }
};
