import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#050504', borderTop: '1px solid var(--border)', padding: '4rem 0 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <Link to="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300, letterSpacing: '0.4em', color: 'var(--cream)', textDecoration: 'none', display: 'block', marginBottom: '1rem' }}>
              VOY<span style={{ color: 'var(--gold)' }}>A</span>
            </Link>
            <p style={{ fontSize: '0.85rem', color: 'var(--mist)', lineHeight: 1.8, maxWidth: 260 }}>
              Crafting extraordinary journeys — flights, trains, buses, metro & hotels, all in one platform.
            </p>
          </div>
          {[
            { title: 'Travel', links: [['Flights', '/flights'], ['Trains', '/trains'], ['Buses', '/buses'], ['Metro', '/metro'], ['Hotels', '/hotels']] },
            { title: 'Explore', links: [['Destinations', '/destinations'], ['Map View', '/map'], ['My Bookings', '/my-bookings']] },
            { title: 'Account', links: [['Login', '/login'], ['Register', '/register'], ['Profile', '/profile']] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.2rem' }}>{col.title}</h4>
              <ul style={{ listStyle: 'none' }}>
                {col.links.map(([label, to]) => (
                  <li key={label} style={{ marginBottom: '0.6rem' }}>
                    <Link to={to} style={{ fontSize: '0.85rem', color: 'var(--mist)', textDecoration: 'none', transition: 'color 0.3s' }}
                      onMouseEnter={e => e.target.style.color = 'var(--cream)'}
                      onMouseLeave={e => e.target.style.color = 'var(--mist)'}
                    >{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', color: 'var(--mist)' }}>
          <span>© {new Date().getFullYear()} VOYA Travel. All rights reserved.</span>
          <span>Built with MERN Stack · React + Node + Express + MongoDB</span>
        </div>
      </div>
    </footer>
  );
}
