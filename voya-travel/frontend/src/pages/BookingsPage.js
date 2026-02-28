import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/bookings/my').then(res => {
      setBookings(res.data.data);
    }).catch(err => {
      // Demo bookings
      setBookings([
        { _id: '1', bookingRef: 'VYA5X9KDEM', type: 'hotel', status: 'confirmed', totalPrice: 12000, currency: 'INR', createdAt: new Date().toISOString(), details: { name: 'The Grand Hyatt', city: 'Mumbai' }, checkIn: '2025-03-15', checkOut: '2025-03-18' },
        { _id: '2', bookingRef: 'VYA8M2KFLY', type: 'flights', status: 'confirmed', totalPrice: 8500, currency: 'INR', createdAt: new Date(Date.now()-86400000).toISOString(), details: { airline: 'IndiGo', flightNumber: 'IG204' } },
      ]);
    }).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings(bs => bs.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch { toast.error('Failed to cancel'); }
  };

  const typeIcon = { hotel: '🏨', flights: '✈', trains: '🚂', buses: '🚌', metro: '🚇' };
  const statusColors = { confirmed: 'badge-green', pending: 'badge-gold', cancelled: 'badge-red', completed: 'badge-blue' };

  if (loading) return <div className="page-wrapper"><div className="loading">Loading bookings...</div></div>;

  return (
    <div className="page-wrapper">
      <div style={{background:'linear-gradient(to bottom, #1e1c18, #0a0906)', padding:'4rem 2rem 2rem', borderBottom:'1px solid rgba(201,169,110,0.1)'}}>
        <div className="container">
          <p className="gold-label" style={{marginBottom:'0.5rem'}}>My Trips</p>
          <h1 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'3rem', fontWeight:300}}>My <em style={{fontStyle:'italic', color:'#e8d5a3'}}>Bookings</em></h1>
        </div>
      </div>
      <div className="container" style={{padding:'3rem 2rem'}}>
        {bookings.length === 0 ? (
          <div style={{textAlign:'center', padding:'6rem 2rem', color:'#8a8278'}}>
            <div style={{fontSize:'3rem', marginBottom:'1rem'}}>✈</div>
            <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.5rem', marginBottom:'0.5rem'}}>No bookings yet</p>
            <p style={{marginBottom:'2rem', fontSize:'0.85rem'}}>Start your journey by booking a hotel, flight, or train</p>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            {bookings.map(b => (
              <div key={b._id} className="card" style={{padding:'1.5rem', display:'grid', gridTemplateColumns:'auto 1fr auto auto', alignItems:'center', gap:'2rem'}}>
                <div style={{fontSize:'2.5rem'}}>{typeIcon[b.type] || '🎫'}</div>
                <div>
                  <div style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'0.5rem'}}>
                    <span className={`badge ${statusColors[b.status]}`}>{b.status}</span>
                    <code style={{fontSize:'0.8rem', color:'#c9a96e', background:'rgba(201,169,110,0.08)', padding:'0.2rem 0.6rem', borderRadius:'3px'}}>{b.bookingRef}</code>
                    <span style={{fontSize:'0.75rem', color:'#8a8278', textTransform:'uppercase', letterSpacing:'0.1em'}}>{b.type}</span>
                  </div>
                  <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.1rem', marginBottom:'0.3rem'}}>
                    {b.details?.name || `${b.details?.airline || ''} ${b.details?.flightNumber || b.details?.name || ''}`}
                  </p>
                  <p style={{color:'#8a8278', fontSize:'0.8rem'}}>
                    Booked {new Date(b.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    {b.checkIn && ` · Check-in: ${new Date(b.checkIn).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}`}
                    {b.checkOut && ` – ${new Date(b.checkOut).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}`}
                  </p>
                </div>
                <div style={{textAlign:'right'}}>
                  <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.8rem', fontWeight:300}}>
                    {b.currency === 'INR' ? '₹' : '$'}{b.totalPrice?.toLocaleString()}
                  </p>
                  <p style={{color:'#8a8278', fontSize:'0.75rem'}}>Total</p>
                </div>
                <div>
                  {b.status === 'confirmed' && (
                    <button onClick={() => handleCancel(b._id)} className="btn-danger" style={{fontSize:'0.7rem'}}>Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
