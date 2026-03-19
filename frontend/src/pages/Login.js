import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async () => {
    if (!identifier || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const res = await login(identifier, password);
      toast.success(res.message || 'Welcome back!');
      navigate(res.user?.role === 'admin' ? '/admin' : from);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>Welcome Back</div>
          <h2>Your Next<br /><em>Adventure</em><br />Awaits</h2>
          <p style={{ marginTop: '1rem' }}>Sign in to access your bookings, saved destinations, and personalized travel plans.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form">
          <Link to="/" className="auth-logo">VOY<span>A</span></Link>
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-sub">Use your email, phone, or username</p>

          <div className="form-group">
            <label className="form-label">Email / Phone / Username</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter email, +91xxxxxxxxxx, or @username"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--gold)', textDecoration: 'none' }}>Forgot Password?</Link>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '0.75rem', padding: '1rem' }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--mist)', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Demo accounts info */}
          <div style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid var(--border)', padding: '1rem', fontSize: '0.75rem', color: 'var(--mist)', lineHeight: 1.8 }}>
            <div style={{ color: 'var(--gold)', marginBottom: '0.3rem', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Demo Accounts</div>
            <div>Admin: <span style={{ color: 'var(--cream)' }}>admin@voya.com</span> / <span style={{ color: 'var(--cream)' }}>admin123</span></div>
            <div>User: <span style={{ color: 'var(--cream)' }}>user@voya.com</span> / <span style={{ color: 'var(--cream)' }}>user123</span></div>
          </div>

          <p className="auth-switch">Don't have an account? <Link to="/register">Create one →</Link></p>
        </div>
      </div>
    </div>
  );
}
