import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await api.put('/users/profile', { name: form.name });
      toast.success('Profile updated!');
    } catch (err) { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  const handleChangePassword = async () => {
    if (!form.currentPassword || !form.newPassword) { toast.error('Fill password fields'); return; }
    setLoading(true);
    try {
      await api.put('/users/change-password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password changed!');
      setForm(f => ({ ...f, currentPassword: '', newPassword: '' }));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> / Profile</div>
          <h1>My <em>Profile</em></h1>
        </div>
      </div>
      <div style={{ background: 'var(--ink)', padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          {/* User info card */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gold-dim)', border: '2px solid rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--gold)', flexShrink: 0 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem' }}>{user?.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.3rem', lineHeight: 1.8 }}>
                {user?.email && <div>📧 {user.email}</div>}
                {user?.phone && <div>📞 {user.phone}</div>}
                {user?.username && <div>@ {user.username}</div>}
              </div>
              <span className="badge badge-gold" style={{ marginTop: '0.5rem' }}>{user?.role}</span>
            </div>
          </div>

          {/* Update name */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Update Profile</h3>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={set('name')} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleUpdateProfile} disabled={loading}>Save Changes</button>
          </div>

          {/* Change password */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Change Password</h3>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input className="form-input" type="password" value={form.currentPassword} onChange={set('currentPassword')} />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" value={form.newPassword} onChange={set('newPassword')} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleChangePassword} disabled={loading}>Update Password</button>
          </div>

          <button className="btn btn-danger btn-sm" onClick={logout}>Sign Out</button>
        </div>
      </div>
    </div>
  );
}
