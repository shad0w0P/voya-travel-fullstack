import React, { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext';
import { AdminSidebar } from './Dashboard';
import toast from 'react-hot-toast';

const typeIcon = { flight: '✈', hotel: '🏨', train: '🚂', bus: '🚌', metro: '🚇' };
const statusColor = { pending: 'badge-mist', confirmed: 'badge-green', cancelled: 'badge-red', completed: 'badge-gold', refunded: 'badge-mist' };

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ type: '', status: '', page: 1 });

  const load = async () => {
    setLoading(true);
    try {
      const params = { limit: 20, page: filters.page };
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      const res = await api.get('/admin/bookings', { params });
      setBookings(res.data.data);
      setTotal(res.data.total);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filters]);

  const getDetails = (b) => {
    if (b.type === 'flight' && b.flight) return `${b.flight.from} → ${b.flight.to}`;
    if (b.type === 'hotel' && b.hotel) return `${b.hotel.hotelName}, ${b.hotel.location}`;
    if (b.type === 'train' && b.train) return `${b.train.from} → ${b.train.to}`;
    if (b.type === 'bus' && b.bus) return `${b.bus.from} → ${b.bus.to}`;
    if (b.type === 'metro' && b.metro) return `${b.metro.fromStation} → ${b.metro.toStation}`;
    return '-';
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/cancel`, { reason: 'Admin action' });
      toast.success('Status updated');
      load();
    } catch { toast.error('Update failed'); }
  };

  const types = ['', 'flight', 'hotel', 'train', 'bus', 'metro'];
  const statuses = ['', 'pending', 'confirmed', 'cancelled', 'completed'];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Manage</div>
          <h1>Bookings <span style={{ fontFamily: 'DM Sans', fontSize: '1.2rem', color: 'var(--mist)', fontWeight: 300 }}>({total})</span></h1>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {types.map(t => (
              <button key={t || 'all'} onClick={() => setFilters(f => ({ ...f, type: t, page: 1 }))} style={{
                padding: '0.4rem 0.8rem', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                border: '1px solid', borderColor: filters.type === t ? 'var(--gold)' : 'var(--border)',
                background: filters.type === t ? 'var(--gold)' : 'transparent',
                color: filters.type === t ? 'var(--ink)' : 'var(--mist)',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s'
              }}>{t ? `${typeIcon[t]} ${t}` : 'All'}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {statuses.map(s => (
              <button key={s || 'all'} onClick={() => setFilters(f => ({ ...f, status: s, page: 1 }))} style={{
                padding: '0.4rem 0.8rem', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                border: '1px solid', borderColor: filters.status === s ? 'var(--gold)' : 'var(--border)',
                background: filters.status === s ? 'rgba(201,169,110,0.1)' : 'transparent',
                color: filters.status === s ? 'var(--gold)' : 'var(--mist)',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s'
              }}>{s || 'All Status'}</button>
            ))}
          </div>
        </div>

        <div className="panel">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}><div className="loader" style={{ margin: '0 auto' }} /></div>
          ) : (
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Details</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--mist)' }}>No bookings found</td></tr>
                ) : bookings.map(b => (
                  <tr key={b._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--gold)' }}>{b.bookingRef}</td>
                    <td style={{ fontSize: '0.8rem' }}>
                      <div style={{ color: 'var(--cream)' }}>{b.user?.name}</div>
                      <div style={{ color: 'var(--mist)', fontSize: '0.7rem' }}>{b.user?.email || b.user?.phone}</div>
                    </td>
                    <td>{typeIcon[b.type]} {b.type}</td>
                    <td style={{ fontSize: '0.78rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getDetails(b)}</td>
                    <td style={{ color: 'var(--cream)' }}>₹{b.payment?.amount?.toLocaleString('en-IN') || '-'}</td>
                    <td><span className={`badge ${statusColor[b.status] || 'badge-mist'}`}>{b.status}</span></td>
                    <td style={{ fontSize: '0.72rem' }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td>
                      {['pending', 'confirmed'].includes(b.status) && (
                        <button onClick={() => updateStatus(b._id)} className="btn btn-danger btn-sm" style={{ fontSize: '0.6rem', padding: '0.3rem 0.6rem' }}>Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {total > 20 && (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button onClick={() => setFilters(f => ({ ...f, page: Math.max(1, f.page - 1) }))} disabled={filters.page === 1} className="btn btn-ghost btn-sm">← Prev</button>
              <span style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: 'var(--mist)' }}>Page {filters.page} of {Math.ceil(total / 20)}</span>
              <button onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))} disabled={filters.page >= Math.ceil(total / 20)} className="btn btn-ghost btn-sm">Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
