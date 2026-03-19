import React, { useState } from 'react';
import { api } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Hotels() {
  const { user } = useAuth();
  const [search, setSearch] = useState({ city: '', checkIn: '', checkOut: '', guests: 2, rooms: 1, minPrice: '', maxPrice: '', rating: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const set = k => e => setSearch(s => ({ ...s, [k]: e.target.value }));

  const handleSearch = async () => {
    if (!search.city || !search.checkIn || !search.checkOut) { toast.error('Fill required fields'); return; }
    if (new Date(search.checkOut) <= new Date(search.checkIn)) { toast.error('Check-out must be after check-in'); return; }
    setLoading(true);
    try {
      const res = await api.get('/hotels/search', { params: search });
      setResults(res.data.data);
      setSearched(true);
    } catch (err) { toast.error('Search failed'); }
    finally { setLoading(false); }
  };

  const handleBook = async (hotel) => {
    try {
      await api.post('/bookings', {
        type: 'hotel',
        hotel: {
          hotelId: hotel.id, hotelName: hotel.name, location: hotel.city,
          checkIn: hotel.checkIn, checkOut: hotel.checkOut,
          roomType: 'Standard', rooms: hotel.rooms, guests: hotel.guests,
        },
        payment: { amount: hotel.totalPrice, currency: 'INR', status: 'pending' },
        contactDetails: { name: user.name, email: user.email }
      });
      toast.success('Hotel booked! Check My Bookings.');
    } catch (err) { toast.error('Booking failed'); }
  };

  const Stars = ({ n }) => (
    <span style={{ color: 'var(--gold)' }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>
  );

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> / Hotels</div>
          <h1>🏨 Book <em>Hotels</em></h1>
          <p style={{ color: 'var(--mist)', marginTop: '0.5rem' }}>From budget stays to luxury escapes</p>
        </div>
      </div>
      <div style={{ background: 'var(--ink)', minHeight: 'calc(100vh - 200px)', padding: '2rem 0' }}>
        <div className="container">
          <div className="search-panel">
            <div className="search-grid search-grid-3" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">City *</label>
                <input className="form-input" placeholder="Mumbai, Delhi, Goa..." value={search.city} onChange={set('city')} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Check-In *</label>
                <input className="form-input" type="date" value={search.checkIn} onChange={set('checkIn')} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Check-Out *</label>
                <input className="form-input" type="date" value={search.checkOut} onChange={set('checkOut')} min={search.checkIn || new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="search-grid search-grid-4" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Guests</label>
                <select className="form-select" value={search.guests} onChange={set('guests')}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Rooms</label>
                <select className="form-select" value={search.rooms} onChange={set('rooms')}>
                  {[1,2,3,4].map(n => <option key={n} value={n}>{n} Room{n>1?'s':''}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Min Stars</label>
                <select className="form-select" value={search.rating} onChange={set('rating')}>
                  <option value="">Any</option>
                  {[2,3,4,5].map(n => <option key={n} value={n}>{n}★ & above</option>)}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Max Price/Night (₹)</label>
                <input className="form-input" type="number" placeholder="e.g. 5000" value={search.maxPrice} onChange={set('maxPrice')} />
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>{loading ? 'Searching...' : 'Search Hotels'}</button>
          </div>

          {searched && (
            <div>
              <div style={{ marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--mist)' }}>{results.length} hotels in {search.city} · {search.checkIn} to {search.checkOut}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {results.map(h => (
                  <div key={h.id} className="card" style={{ overflow: 'hidden' }}>
                    <img src={`https://source.unsplash.com/400x250/?hotel,${h.city},luxury&sig=${h.id}`} alt={h.name} style={{ width: '100%', height: 180, objectFit: 'cover', filter: 'saturate(0.7)' }} />
                    <div style={{ padding: '1.2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem' }}>{h.name}</div>
                          <Stars n={h.stars} />
                        </div>
                        <span className="badge badge-gold">{h.rating}★</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginBottom: '0.8rem' }}>{h.address}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--mist)', marginBottom: '1rem' }}>
                        {h.amenities.slice(0, 4).join(' · ')}
                        {h.amenities.length > 4 && ' · +more'}
                      </div>
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem' }}>₹{h.pricePerNight.toLocaleString('en-IN')}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--mist)' }}>/night</span>
                          <div style={{ fontSize: '0.7rem', color: 'var(--mist)' }}>₹{h.totalPrice.toLocaleString('en-IN')} total · {h.nights}N</div>
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={() => handleBook(h)}>Book</button>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: h.cancellation.includes('Free') ? '#6fcf97' : '#eb8b7a', marginTop: '0.4rem' }}>
                        {h.cancellation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!searched && (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--mist)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏨</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem' }}>Find Your Stay</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
