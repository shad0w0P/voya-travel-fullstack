import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MOCK_STATS = { totalUsers: 1284, totalHotels: 86, totalBookings: 3420, revenue: 2847500 };
const MOCK_USERS = [
  { _id: '1', firstName: 'Arjun', lastName: 'Sharma', email: 'arjun@email.com', role: 'user', isActive: true, createdAt: new Date().toISOString() },
  { _id: '2', firstName: 'Priya', lastName: 'Mehta', email: 'priya@email.com', role: 'user', isActive: true, createdAt: new Date(Date.now()-86400000*3).toISOString() },
  { _id: '3', firstName: 'Rahul', lastName: 'Kumar', phone: '+91 9876543210', role: 'user', isActive: false, createdAt: new Date(Date.now()-86400000*7).toISOString() },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(MOCK_STATS);
  const [users, setUsers] = useState(MOCK_USERS);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => {
      setStats(res.data.data?.stats || MOCK_STATS);
      setBookings(res.data.data?.recentBookings || []);
    }).catch(() => {});
    api.get('/admin/users').then(res => setUsers(res.data.data || MOCK_USERS)).catch(() => {});
  }, []);

  const toggleUser = async (userId, isActive) => {
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !isActive });
      setUsers(us => us.map(u => u._id === userId ? { ...u, isActive: !isActive } : u));
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed to update user'); }
  };

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'users', label: '👥 Users' },
    { id: 'bookings', label: '🎫 Bookings' },
    { id: 'hotels', label: '🏨 Hotels' },
  ];

  return (
    <div className="page-wrapper">
      <div style={{background:'linear-gradient(to right, #1e1c18, #141210)', padding:'4rem 2rem 0', borderBottom:'1px solid rgba(201,169,110,0.1)'}}>
        <div className="container">
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem'}}>
            <div>
              <p className="gold-label" style={{marginBottom:'0.5rem'}}>⚙ Administration</p>
              <h1 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'2.5rem', fontWeight:300}}>Admin <em style={{fontStyle:'italic', color:'#e8d5a3'}}>Panel</em></h1>
            </div>
            <div style={{background:'rgba(139,58,42,0.2)', border:'1px solid rgba(139,58,42,0.4)', padding:'0.5rem 1.2rem', borderRadius:'4px', color:'#e8a090', fontSize:'0.75rem', letterSpacing:'0.1em', textTransform:'uppercase'}}>
              Admin Access
            </div>
          </div>
          <div style={{display:'flex', gap:'0', borderBottom:'none'}}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{padding:'1rem 1.5rem', background:activeTab===t.id?'rgba(201,169,110,0.1)':'transparent', border:'none', borderBottom:activeTab===t.id?'2px solid #c9a96e':'2px solid transparent', color:activeTab===t.id?'#c9a96e':'#8a8278', cursor:'pointer', fontSize:'0.85rem', transition:'all 0.3s'}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{padding:'3rem 2rem'}}>
        {activeTab === 'dashboard' && (
          <div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem', marginBottom:'3rem'}}>
              {[
                { label: 'Total Users', value: stats.totalUsers?.toLocaleString(), icon: '👥', color: '#3498db' },
                { label: 'Hotels Listed', value: stats.totalHotels, icon: '🏨', color: '#c9a96e' },
                { label: 'Total Bookings', value: stats.totalBookings?.toLocaleString(), icon: '🎫', color: '#27ae60' },
                { label: 'Revenue', value: `₹${(stats.revenue/100000).toFixed(1)}L`, icon: '💰', color: '#e74c3c' }
              ].map(s => (
                <div key={s.label} className="card" style={{padding:'1.5rem'}}>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem'}}>
                    <span style={{fontSize:'1.8rem'}}>{s.icon}</span>
                    <div style={{width:'8px', height:'8px', borderRadius:'50%', background:s.color}}></div>
                  </div>
                  <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'2.5rem', fontWeight:300, lineHeight:1}}>{s.value}</p>
                  <p style={{color:'#8a8278', fontSize:'0.75rem', marginTop:'0.5rem', textTransform:'uppercase', letterSpacing:'0.1em'}}>{s.label}</p>
                </div>
              ))}
            </div>
            <div className="card" style={{padding:'1.5rem'}}>
              <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.3rem', fontWeight:300, marginBottom:'1.5rem'}}>Quick Actions</h3>
              <div style={{display:'flex', gap:'1rem', flexWrap:'wrap'}}>
                <button className="btn-gold" style={{fontSize:'0.75rem'}} onClick={() => setActiveTab('users')}>Manage Users</button>
                <button className="btn-outline" style={{fontSize:'0.75rem'}} onClick={() => setActiveTab('hotels')}>Manage Hotels</button>
                <button className="btn-outline" style={{fontSize:'0.75rem'}} onClick={() => setActiveTab('bookings')}>View Bookings</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.8rem', fontWeight:300, marginBottom:'2rem'}}>User Management</h2>
            <div className="card" style={{overflow:'hidden'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{borderBottom:'1px solid rgba(201,169,110,0.1)', background:'rgba(201,169,110,0.04)'}}>
                    {['User','Contact','Role','Status','Joined','Actions'].map(h => (
                      <th key={h} style={{padding:'1rem 1.5rem', textAlign:'left', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#c9a96e', fontWeight:400}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{borderBottom:'1px solid rgba(201,169,110,0.06)'}}>
                      <td style={{padding:'1rem 1.5rem'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'0.8rem'}}>
                          <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'linear-gradient(135deg, #c9a96e, #8b6a3a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', color:'#0a0906', fontWeight:500}}>
                            {(u.firstName?.[0] || u.username?.[0] || '?').toUpperCase()}
                          </div>
                          <div>
                            <p style={{fontWeight:400}}>{u.firstName} {u.lastName}</p>
                            <p style={{color:'#8a8278', fontSize:'0.75rem'}}>{u.username || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{padding:'1rem 1.5rem', color:'#8a8278', fontSize:'0.85rem'}}>{u.email || u.phone}</td>
                      <td style={{padding:'1rem 1.5rem'}}><span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-blue'}`}>{u.role}</span></td>
                      <td style={{padding:'1rem 1.5rem'}}><span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td style={{padding:'1rem 1.5rem', color:'#8a8278', fontSize:'0.8rem'}}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td style={{padding:'1rem 1.5rem'}}>
                        <button onClick={() => toggleUser(u._id, u.isActive)} style={{padding:'0.4rem 0.8rem', fontSize:'0.7rem', background:u.isActive?'rgba(192,57,43,0.2)':'rgba(39,174,96,0.2)', border:`1px solid ${u.isActive?'rgba(192,57,43,0.4)':'rgba(39,174,96,0.4)'}`, color:u.isActive?'#e57373':'#4caf82', borderRadius:'4px', cursor:'pointer'}}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.8rem', fontWeight:300, marginBottom:'2rem'}}>All Bookings</h2>
            {bookings.length === 0 ? (
              <div className="card" style={{padding:'3rem', textAlign:'center', color:'#8a8278'}}>
                <p>No bookings found. They will appear here once users start booking.</p>
              </div>
            ) : (
              <div className="card">
                <table style={{width:'100%', borderCollapse:'collapse'}}>
                  <thead><tr style={{borderBottom:'1px solid rgba(201,169,110,0.1)', background:'rgba(201,169,110,0.04)'}}>
                    {['Ref','User','Type','Status','Amount','Date'].map(h => (
                      <th key={h} style={{padding:'1rem 1.5rem', textAlign:'left', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#c9a96e', fontWeight:400}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id} style={{borderBottom:'1px solid rgba(201,169,110,0.06)'}}>
                        <td style={{padding:'1rem 1.5rem'}}><code style={{color:'#c9a96e', fontSize:'0.8rem'}}>{b.bookingRef}</code></td>
                        <td style={{padding:'1rem 1.5rem', fontSize:'0.85rem'}}>{b.user?.firstName} {b.user?.lastName}</td>
                        <td style={{padding:'1rem 1.5rem'}}><span className="badge badge-blue">{b.type}</span></td>
                        <td style={{padding:'1rem 1.5rem'}}><span className="badge badge-green">{b.status}</span></td>
                        <td style={{padding:'1rem 1.5rem', fontFamily:'Cormorant Garamond, serif', fontSize:'1rem'}}>₹{b.totalPrice?.toLocaleString()}</td>
                        <td style={{padding:'1rem 1.5rem', color:'#8a8278', fontSize:'0.8rem'}}>{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hotels' && (
          <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
              <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.8rem', fontWeight:300}}>Hotel Management</h2>
              <button className="btn-gold" style={{fontSize:'0.75rem'}} onClick={() => toast('Hotel creation form — connect to POST /api/hotels endpoint', {icon:'ℹ️'})}>+ Add Hotel</button>
            </div>
            <div className="card" style={{padding:'3rem', textAlign:'center', color:'#8a8278'}}>
              <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.3rem', marginBottom:'0.5rem'}}>Hotel CRUD Panel</p>
              <p style={{fontSize:'0.85rem'}}>Connect to <code style={{color:'#c9a96e'}}>/api/hotels</code> endpoints to manage hotels. Add, edit, and remove listings from here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
