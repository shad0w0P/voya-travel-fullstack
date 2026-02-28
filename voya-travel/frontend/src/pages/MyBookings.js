import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import toast from 'react-hot-toast';

const typeIcon = { flight: '✈', hotel: '🏨', train: '🚂', bus: '🚌', metro: '🚇' };
const statusColor = { pending: 'badge-mist', confirmed: 'badge-green', cancelled: 'badge-red', completed: 'badge-gold' };

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (typeFilter !== 'all') params.type = typeFilter;
      if (filter !== 'all') params.status = filter;
      const res = await api.get('/bookings/my', { params });
      setBookings(res.data.bookings);
    } catch (err) { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter, typeFilter]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`, { reason: 'User cancelled' });
      toast.success('Booking cancelled');
      load();
    } catch (err) { toast.error('Failed to cancel'); }
  };

  const getDetails = (b) => {
    if (b.type === 'flight' && b.flight) return `${b.flight.from} → ${b.flight.to} · ${b.flight.airline} ${b.flight.flightNumber}`;
    if (b.type === 'hotel' && b.hotel) return `${b.hotel.hotelName} · ${b.hotel.location}`;
    if (b.type === 'train' && b.train) return `${b.train.from} → ${b.train.to} · ${b.train.trainName}`;
    if (b.type === 'bus' && b.bus) return `${b.bus.from} → ${b.bus.to} · ${b.bus.operator}`;
    if (b.type === 'metro' && b.metro) return `${b.metro.fromStation} → ${b.metro.toStation} · ${b.metro.passType}`;
    return 'Details unavailable';
  };

  const statuses = ['all', 'pending', 'confirmed', 'cancelled', 'completed'];
  const types = ['all', 'flight', 'hotel', 'train', 'bus', 'metro'];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> / My Bookings</div>
          <h1>My <em>Bookings</em></h1>
        </div>
      </div>
      <div style={{ background: 'var(--ink)', minHeight: 'calc(100vh - 200px)', padding: '2rem 0' }}>
        <div className="container">
          {/* Filters */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {types.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)} style={{
                  padding: '0.4rem 0.8rem', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  border: '1px solid', borderColor: typeFilter === t ? 'var(--gold)' : 'var(--border)',
                  background: typeFilter === t ? 'var(--gold)' : 'transparent',
                  color: typeFilter === t ? 'var(--ink)' : 'var(--mist)',
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif'
                }}>{t === 'all' ? 'All Types' : `${typeIcon[t] || ''} ${t}`}</button>
              ))}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.4rem' }}>
              {statuses.map(s => (
                <button key={s} onClick={() => setFilter(s)} style={{
                  padding: '0.4rem 0.8rem', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  border: '1px solid', borderColor: filter === s ? 'var(--gold)' : 'var(--border)',
                  background: filter === s ? 'rgba(201,169,110,0.1)' : 'transparent',
                  color: filter === s ? 'var(--gold)' : 'var(--mist)',
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif'
                }}>{s}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}><div className="loader" style={{ margin: '0 auto' }} /></div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--mist)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '0.5rem' }}>No Bookings Found</div>
              <div style={{ fontSize: '0.85rem' }}>Start exploring and booking your journeys</div>
            </div>
          ) : bookings.map(b => (
            <div key={b._id} className="result-card" style={{ marginBottom: '2px' }}>
              <div style={{ fontSize: '2.5rem', width: 50 }}>{typeIcon[b.type]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', textTransform: 'capitalize', marginBottom: '0.2rem' }}>
                  {b.type} Booking
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '0.3rem' }}>{getDetails(b)}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--mist)' }}>
                  Ref: <span style={{ color: 'var(--gold)' }}>{b.bookingRef}</span> · Booked {new Date(b.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span className={`badge ${statusColor[b.status] || 'badge-mist'}`}>{b.status}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem' }}>₹{b.payment?.amount?.toLocaleString('en-IN') || '-'}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--mist)', marginBottom: '0.5rem' }}>{b.payment?.status}</div>
                {['pending', 'confirmed'].includes(b.status) && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b._id)}>Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
