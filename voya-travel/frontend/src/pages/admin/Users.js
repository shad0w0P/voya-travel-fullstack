import React, { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext';
import { AdminSidebar } from './Dashboard';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', { params: { search, page, limit: 15 } });
      setUsers(res.data.data);
      setTotal(res.data.total);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, page]);

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await api.patch(`/admin/users/${user._id}`, { role: newRole });
      toast.success(`${user.name} is now ${newRole}`);
      load();
    } catch { toast.error('Failed to update'); }
  };

  const toggleActive = async (user) => {
    try {
      await api.patch(`/admin/users/${user._id}`, { isActive: !user.isActive });
      toast.success(`Account ${user.isActive ? 'deactivated' : 'activated'}`);
      load();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Manage</div>
          <h1>Users <span style={{ fontFamily: 'DM Sans', fontSize: '1.2rem', color: 'var(--mist)', fontWeight: 300 }}>({total})</span></h1>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <input
            className="form-input"
            placeholder="Search by name, email, or username..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ maxWidth: 400 }}
          />
        </div>

        <div className="panel">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}><div className="loader" style={{ margin: '0 auto' }} /></div>
          ) : (
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Identifier</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--mist)' }}>No users found</td></tr>
                ) : users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--gold)', flexShrink: 0 }}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ color: 'var(--cream)' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.78rem' }}>
                      {u.email || u.phone || `@${u.username}`}
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-mist'}`}>{u.role}</span>
                    </td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => toggleRole(u)} className="btn btn-ghost btn-sm" style={{ fontSize: '0.6rem', padding: '0.3rem 0.6rem' }}>
                          {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button onClick={() => toggleActive(u)} className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-primary'}`} style={{ fontSize: '0.6rem', padding: '0.3rem 0.6rem' }}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {total > 15 && (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-ghost btn-sm">← Prev</button>
              <span style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: 'var(--mist)' }}>Page {page} of {Math.ceil(total / 15)}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 15)} className="btn btn-ghost btn-sm">Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
