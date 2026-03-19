import React, { useState } from 'react';
import { api } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const trainClasses = [
  { code: 'SL', name: 'Sleeper' }, { code: '3A', name: '3rd AC' },
  { code: '2A', name: '2nd AC' }, { code: '1A', name: '1st AC' }
];

export default function Trains() {
  const { user } = useAuth();
  const [search, setSearch] = useState({ from: '', to: '', date: '', passengers: 1, classType: 'SL' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const set = k => e => setSearch(s => ({ ...s, [k]: e.target.value }));

  const handleSearch = async () => {
    if (!search.from || !search.to || !search.date) { toast.error('Fill required fields'); return; }
    setLoading(true);
    try {
      const res = await api.get('/trains/search', { params: search });
      setResults(res.data.data);
      setSearched(true);
    } catch (err) { toast.error('Search failed'); }
    finally { setLoading(false); }
  };

  const handleBook = async (train) => {
    try {
      await api.post('/bookings', {
        type: 'train',
        train: {
          trainNumber: train.trainNumber, trainName: train.name,
          from: train.from, to: train.to,
          departure: new Date(`${train.date}T${train.departure}`),
          arrival: new Date(`${train.date}T${train.arrival}`),
          class: train.class, passengers: search.passengers
        },
        payment: { amount: train.totalPrice, currency: 'INR', status: 'pending' },
        contactDetails: { name: user.name, email: user.email }
      });
      toast.success('Train booked! Check My Bookings.');
    } catch (err) { toast.error('Booking failed'); }
  };

  const popularRoutes = [
    ['DEL', 'CSTM'], ['NDLS', 'SBC'], ['HWH', 'MAS'], ['SC', 'ADI']
  ];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> / Trains</div>
          <h1>🚂 Book <em>Trains</em></h1>
          <p style={{ color: 'var(--mist)', marginTop: '0.5rem' }}>Indian Railways · Rajdhani · Shatabdi · Duronto</p>
        </div>
      </div>
      <div style={{ background: 'var(--ink)', minHeight: 'calc(100vh - 200px)', padding: '2rem 0' }}>
        <div className="container">
          <div className="search-panel">
            <div className="search-grid search-grid-4" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">From Station</label>
                <input className="form-input" placeholder="NDLS, CSTM, MAS..." value={search.from} onChange={set('from')} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">To Station</label>
                <input className="form-input" placeholder="HYD, BLR, CCU..." value={search.to} onChange={set('to')} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={search.date} onChange={set('date')} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Passengers</label>
                <select className="form-select" value={search.passengers} onChange={set('passengers')}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div className="form-label" style={{ marginBottom: '0.4rem' }}>Class</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {trainClasses.map(c => (
                    <button key={c.code} onClick={() => setSearch(s => ({ ...s, classType: c.code }))} style={{
                      padding: '0.5rem 0.8rem', fontSize: '0.65rem', letterSpacing: '0.1em',
                      textTransform: 'uppercase', border: '1px solid',
                      borderColor: search.classType === c.code ? 'var(--gold)' : 'var(--border)',
                      background: search.classType === c.code ? 'var(--gold)' : 'transparent',
                      color: search.classType === c.code ? 'var(--ink)' : 'var(--mist)',
                      cursor: 'pointer', transition: 'all 0.3s', fontFamily: 'DM Sans, sans-serif'
                    }}>{c.name}</button>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary" style={{ marginLeft: 'auto', marginTop: '1.2rem' }} onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search Trains'}
              </button>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--mist)', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>POPULAR ROUTES</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {popularRoutes.map(([f, t]) => (
                  <button key={`${f}-${t}`} onClick={() => setSearch(s => ({ ...s, from: f, to: t }))}
                    style={{ background: 'var(--gold-dim)', border: '1px solid var(--border)', color: 'var(--mist)', padding: '0.3rem 0.8rem', fontSize: '0.65rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    {f} → {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {searched && results.map(train => (
            <div key={train.id} className="result-card">
              <div style={{ minWidth: 160 }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>{train.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>#{train.trainNumber}</div>
                {train.pantry && <span className="badge badge-green" style={{ marginTop: '0.3rem', fontSize: '0.55rem' }}>Pantry</span>}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem' }}>{train.departure}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>{train.from}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>{train.duration}</div>
                <div style={{ width: 60, height: 1, background: 'var(--border)', margin: '0.4rem auto' }} />
                <div style={{ fontSize: '0.6rem', color: 'var(--mist)' }}>{train.class}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem' }}>{train.arrival}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>{train.to}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="result-price">₹{train.totalPrice.toLocaleString('en-IN')}<small>{search.passengers} passenger{search.passengers > 1 ? 's' : ''}</small></div>
                <div style={{ fontSize: '0.65rem', color: train.availableSeats < 10 ? '#eb8b7a' : 'var(--mist)', marginBottom: '0.5rem' }}>
                  {train.availableSeats} seats left
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => handleBook(train)}>Book Now</button>
              </div>
            </div>
          ))}

          {!searched && (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--mist)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚂</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem' }}>Search Indian Railways</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
