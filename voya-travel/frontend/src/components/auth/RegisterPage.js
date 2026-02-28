import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', username: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('email');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (!form[loginType]) { toast.error(`Please provide your ${loginType}`); return; }
    setLoading(true);
    try {
      const payload = { firstName: form.firstName, lastName: form.lastName, password: form.password };
      if (loginType === 'email') payload.email = form.email;
      if (loginType === 'phone') payload.phone = form.phone;
      if (loginType === 'username') payload.username = form.username;
      const res = await register(payload);
      toast.success('Account created! Welcome to VOYA.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <Link to="/" style={styles.logo}>VOY<span style={{color:'#c9a96e'}}>A</span></Link>
          <p style={styles.tagline}>Create your account</p>
        </div>
        <div style={styles.tabGroup}>
          {['email','phone','username'].map(t => (
            <button key={t} onClick={() => setLoginType(t)} style={{...styles.tab, ...(loginType===t ? styles.tabActive : {})}}>
              {t === 'email' ? '✉ Email' : t === 'phone' ? '📱 Phone' : '@ Username'}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" style={styles.input} />
            </div>
          </div>
          {loginType === 'email' && (
            <div style={styles.field}>
              <label style={styles.label}>Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required style={styles.input} />
            </div>
          )}
          {loginType === 'phone' && (
            <div style={styles.field}>
              <label style={styles.label}>Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" required style={styles.input} />
            </div>
          )}
          {loginType === 'username' && (
            <div style={styles.field}>
              <label style={styles.label}>Username *</label>
              <input name="username" value={form.username} onChange={handleChange} placeholder="voyatraveller" required style={styles.input} />
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Password *</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Confirm Password *</label>
            <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Repeat password" required style={styles.input} />
          </div>
          <button type="submit" disabled={loading} className="btn-gold" style={{width:'100%', marginTop:'1.5rem', opacity: loading ? 0.7 : 1}}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p style={{textAlign:'center', marginTop:'1.5rem', fontSize:'0.85rem', color:'#8a8278'}}>
          Have an account? <Link to="/login" style={{color:'#c9a96e'}}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#0a0906' },
  card: { background: '#1e1c18', border: '1px solid rgba(201,169,110,0.2)', padding: '3rem', width: '100%', maxWidth: '520px', borderRadius: '8px' },
  logoWrap: { textAlign: 'center', marginBottom: '2rem' },
  logo: { fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 300, letterSpacing: '0.4em', color: '#f5f0e8' },
  tagline: { color: '#8a8278', fontSize: '0.85rem', marginTop: '0.5rem' },
  tabGroup: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.3rem', borderRadius: '6px' },
  tab: { flex: 1, padding: '0.6rem', background: 'transparent', border: 'none', color: '#8a8278', fontSize: '0.8rem', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.3s' },
  tabActive: { background: '#c9a96e', color: '#0a0906' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.5rem' },
  input: { display: 'block', width: '100%', padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '4px', color: '#f5f0e8', fontSize: '0.95rem', outline: 'none', fontFamily: 'DM Sans, sans-serif' }
};
