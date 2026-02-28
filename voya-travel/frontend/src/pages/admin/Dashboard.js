import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '◈' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/bookings', label: 'Bookings', icon: '📋' },
  { to: '/', label: '← Back to Site', icon: '🏠' },
];

export function AdminSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="admin-sidebar">
      <div className="logo">VOY<span>A</span> <span style={{ fontSize: '0.7rem', color: 'var(--mist)', letterSpacing: '0.2em' }}>ADMIN</span></div>
      {navItems.map(item => (
        <Link key={item.to} to={item.to} className={`admin-nav-item ${location.pathname === item.to ? 'active' : ''}`}>
          <span>{item.icon}</span> {item.label}
        </Link>
      ))}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginBottom: '0.8rem' }}>
          Logged in as<br /><span style={{ color: 'var(--cream)' }}>{user?.name}</span>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ fontSize: '0.65rem', color: '#eb8b7a', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setStats(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const typeIcon = { flight: '✈', hotel: '🏨', train: '🚂', bus: '🚌', metro: '🚇' };
  const statusColor = { pending: '#c9a96e', confirmed: '#6fcf97', cancelled: '#eb8b7a', completed: '#bb6bd9' };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Overview</div>
          <h1>Dashboard</h1>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}><div className="loader" style={{ margin: '0 auto' }} /></div>
        ) : stats ? (
          <>
            {/* Stat Cards */}
            <div className="admin-grid-4">
              {[
                { label: 'Total Users', val: stats.stats.totalUsers, icon: '👥', color: 'var(--gold)' },
                { label: 'Total Bookings', val: stats.stats.totalBookings, icon: '📋', color: '#6fcf97' },
                { label: 'Total Revenue', val: `₹${(stats.stats.totalRevenue || 0).toLocaleString('en-IN')}`, icon: '💰', color: '#bb6bd9' },
                { label: 'Active Bookings', val: stats.stats.activeBookings, icon: '✅', color: '#4a90d9' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                  <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="admin-grid-2">
              {/* Bookings by type */}
              <div className="panel">
                <h3>Bookings by Type</h3>
                {stats.bookingsByType?.length > 0 ? stats.bookingsByType.map(t => (
                  <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{typeIcon[t._id] || '📦'}</span>
                      <span style={{ textTransform: 'capitalize', fontSize: '0.85rem', color: 'var(--cream)' }}>{t._id}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--mist)' }}>{t.count} bookings</span>
                      <span style={{ color: 'var(--gold)' }}>₹{(t.revenue || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )) : (
                  <div style={{ color: 'var(--mist)', fontSize: '0.85rem', padding: '1rem 0' }}>No bookings yet. Add test data to see stats.</div>
                )}
              </div>

              {/* Recent Bookings */}
              <div className="panel">
                <h3>Recent Bookings</h3>
                {stats.recentBookings?.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Ref</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentBookings.slice(0, 6).map(b => (
                        <tr key={b._id}>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--gold)' }}>{b.bookingRef}</td>
                          <td>{b.user?.name || 'N/A'}</td>
                          <td>{typeIcon[b.type]} {b.type}</td>
                          <td><span style={{ color: statusColor[b.status] || 'var(--mist)' }}>{b.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ color: 'var(--mist)', fontSize: '0.85rem', padding: '1rem 0' }}>No recent bookings.</div>
                )}
                <Link to="/admin/bookings" style={{ display: 'block', marginTop: '1rem', fontSize: '0.7rem', color: 'var(--gold)', textDecoration: 'none', letterSpacing: '0.1em' }}>View all bookings →</Link>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
