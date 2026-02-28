import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', username: '', password: '', confirm: '' });
  const [loginMethod, setLoginMethod] = useState('email'); // email | phone | username
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.password) { toast.error('Name and password required'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    const identifier = loginMethod === 'email' ? form.email : loginMethod === 'phone' ? form.phone : form.username;
    if (!identifier) { toast.error(`Please enter your ${loginMethod}`); return; }
    setLoading(true);
    try {
      const payload = { name: form.name, password: form.password };
      if (loginMethod === 'email') payload.email = form.email;
      if (loginMethod === 'phone') payload.phone = form.phone;
      if (loginMethod === 'username') payload.username = form.username;
      const res = await register(payload);
      toast.success(res.message || 'Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const methods = [
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'username', label: 'Username' },
  ];

  return (
    <div className="auth-page">
      <div className="auth-left" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1200&q=80')" }}>
        <div className="auth-left-content">
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>Join VOYA</div>
          <h2>Explore the<br /><em>World</em><br />Your Way</h2>
          <p style={{ marginTop: '1rem' }}>Book flights, trains, buses, metro passes & hotels — all from one beautiful platform.</p>
        </div>
      </div>
      <div className="auth-right" style={{ overflowY: 'auto' }}>
        <div className="auth-form">
          <Link to="/" className="auth-logo">VOY<span>A</span></Link>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Choose how you want to sign in</p>

          {/* Method selector */}
          <div style={{ display: 'flex', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
            {methods.map(m => (
              <button
                key={m.key}
                onClick={() => setLoginMethod(m.key)}
                style={{
                  flex: 1, padding: '0.7rem', fontSize: '0.65rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                  background: loginMethod === m.key ? 'var(--gold)' : 'transparent',
                  color: loginMethod === m.key ? 'var(--ink)' : 'var(--mist)',
                  transition: 'all 0.3s', fontFamily: 'DM Sans, sans-serif'
                }}
              >{m.label}</button>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" type="text" placeholder="Your full name" value={form.name} onChange={set('name')} />
          </div>

          {loginMethod === 'email' && (
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
            </div>
          )}
          {loginMethod === 'phone' && (
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input className="form-input" type="tel" placeholder="+91 9876543210" value={form.phone} onChange={set('phone')} />
            </div>
          )}
          {loginMethod === 'username' && (
            <div className="form-group">
              <label className="form-label">Username *</label>
              <input className="form-input" type="text" placeholder="@yourusername" value={form.username} onChange={set('username')} />
              <div style={{ fontSize: '0.7rem', color: 'var(--mist)', marginTop: '0.3rem' }}>Letters, numbers, underscores only</div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="form-input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <input className="form-input" type="password" placeholder="Confirm your password" value={form.confirm} onChange={set('confirm')} />
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '0.75rem', padding: '1rem' }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="auth-switch">Already have an account? <Link to="/login">Sign in →</Link></p>
        </div>
      </div>
    </div>
  );
}
