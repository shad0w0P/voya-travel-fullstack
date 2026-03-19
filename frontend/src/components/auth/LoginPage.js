import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(identifier, password);
      toast.success(`Welcome back, ${res.user.firstName || res.user.username || 'Traveller'}!`);
      navigate(res.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg}></div>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <Link to="/" style={styles.logo}>VOY<span style={{color:'#c9a96e'}}>A</span></Link>
          <p style={styles.tagline}>Sign in to continue your journey</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email, Phone, or Username</label>
            <input
              value={identifier} onChange={e => setIdentifier(e.target.value)}
              placeholder="Enter email, phone number, or username"
              required style={styles.input}
            />
            <small style={styles.hint}>Any of your registered identifiers work here</small>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={styles.input} />
          </div>
          <button type="submit" disabled={loading} className="btn-gold" style={{width:'100%', marginTop:'1.5rem', opacity: loading ? 0.7 : 1}}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div style={styles.divider}><span>or</span></div>
        <div style={styles.demoBox}>
          <p style={{fontSize:'0.7rem', color:'#8a8278', marginBottom:'0.8rem', letterSpacing:'0.1em', textTransform:'uppercase'}}>Demo Credentials</p>
          <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
            <button onClick={()=>{setIdentifier('admin@voya.com');setPassword('Admin@1234');}} style={styles.demoBtn}>Admin Login</button>
            <button onClick={()=>{setIdentifier('user@voya.com');setPassword('User@1234');}} style={styles.demoBtn}>User Demo</button>
          </div>
        </div>
        <p style={{textAlign:'center', marginTop:'1.5rem', fontSize:'0.85rem', color:'#8a8278'}}>
          No account? <Link to="/register" style={{color:'#c9a96e'}}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '2rem' },
  bg: { position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #0a0906 0%, #1a1208 50%, #0a0906 100%)', zIndex: -1 },
  card: { background: '#1e1c18', border: '1px solid rgba(201,169,110,0.2)', padding: '3rem', width: '100%', maxWidth: '440px', borderRadius: '8px' },
  logoWrap: { textAlign: 'center', marginBottom: '2.5rem' },
  logo: { fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 300, letterSpacing: '0.4em', color: '#f5f0e8' },
  tagline: { color: '#8a8278', fontSize: '0.85rem', marginTop: '0.5rem' },
  field: { marginBottom: '1.2rem' },
  label: { display: 'block', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.5rem' },
  input: { display: 'block', width: '100%', padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '4px', color: '#f5f0e8', fontSize: '0.95rem', outline: 'none', fontFamily: 'DM Sans, sans-serif' },
  hint: { fontSize: '0.72rem', color: '#8a8278', marginTop: '0.4rem', display:'block' },
  divider: { textAlign: 'center', margin: '1.5rem 0', position: 'relative', color: '#8a8278', fontSize: '0.8rem' },
  demoBox: { background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.1)', borderRadius: '4px', padding: '1rem' },
  demoBtn: { background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', padding: '0.5rem 1rem', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer' }
};
