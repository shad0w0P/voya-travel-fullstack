import React, { useState } from 'react';
import { api } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const busTypes = ['AC', 'Non-AC', 'Sleeper', 'Volvo'];

export default function Buses() {
  const { user } = useAuth();
  const [search, setSearch] = useState({ from: '', to: '', date: '', passengers: 1, busType: 'AC' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const set = k => e => setSearch(s => ({ ...s, [k]: e.target.value }));

  const handleSearch = async () => {
    if (!search.from || !search.to || !search.date) { toast.error('Fill required fields'); return; }
    setLoading(true);
    try {
      const res = await api.get('/buses/search', { params: search });
      setResults(res.data.data);
      setSearched(true);
    } catch (err) { toast.error('Search failed'); }
    finally { setLoading(false); }
  };

  const handleBook = async (bus) => {
    try {
      await api.post('/bookings', {
        type: 'bus',
        bus: { busNumber: bus.id, operator: bus.operator, from: bus.from, to: bus.to, departure: new Date(`${bus.date}T${bus.departure.replace(':', ':')}:00`), passengers: search.passengers },
        payment: { amount: bus.totalPrice, currency: 'INR', status: 'pending' },
        contactDetails: { name: user.name, email: user.email }
      });
      toast.success('Bus booked!');
    } catch (err) { toast.error('Booking failed'); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> / Buses</div>
          <h1>🚌 Book <em>Buses</em></h1>
          <p style={{ color: 'var(--mist)', marginTop: '0.5rem' }}>KSRTC · MSRTC · Private operators · Volvo</p>
        </div>
      </div>
      <div style={{ background: 'var(--ink)', minHeight: 'calc(100vh - 200px)', padding: '2rem 0' }}>
        <div className="container">
          <div className="search-panel">
            <div className="search-grid search-grid-4" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">From City</label>
                <input className="form-input" placeholder="Mumbai, Pune, Delhi..." value={search.from} onChange={set('from')} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">To City</label>
                <input className="form-input" placeholder="Goa, Bangalore, Hyderabad..." value={search.to} onChange={set('to')} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={search.date} onChange={set('date')} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Passengers</label>
                <select className="form-select" value={search.passengers} onChange={set('passengers')}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
              {busTypes.map(t => (
                <button key={t} onClick={() => setSearch(s => ({ ...s, busType: t }))} style={{
                  padding: '0.5rem 1rem', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  border: '1px solid', borderColor: search.busType === t ? 'var(--gold)' : 'var(--border)',
                  background: search.busType === t ? 'var(--gold)' : 'transparent',
                  color: search.busType === t ? 'var(--ink)' : 'var(--mist)',
                  cursor: 'pointer', transition: 'all 0.3s', fontFamily: 'DM Sans, sans-serif'
                }}>{t}</button>
              ))}
              <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search Buses'}
              </button>
            </div>
          </div>

          {searched && results.map(bus => (
            <div key={bus.id} className="result-card">
              <div style={{ minWidth: 160 }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>{bus.operator}</div>
                <span className="badge badge-gold">{bus.type}</span>
                <div style={{ fontSize: '0.7rem', color: 'var(--mist)', marginTop: '0.3rem' }}>⭐ {bus.rating}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem' }}>{bus.departure}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>{bus.from}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>{bus.duration}</div>
                <div style={{ width: 60, height: 1, background: 'var(--border)', margin: '0.4rem auto' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem' }}>{bus.arrival}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>{bus.to}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="result-price">₹{bus.totalPrice.toLocaleString('en-IN')}<small>{search.passengers} seat{search.passengers > 1 ? 's' : ''}</small></div>
                <div style={{ fontSize: '0.65rem', color: bus.availableSeats < 5 ? '#eb8b7a' : 'var(--mist)', marginBottom: '0.5rem' }}>{bus.availableSeats} seats</div>
                <button className="btn btn-primary btn-sm" onClick={() => handleBook(bus)}>Book</button>
              </div>
            </div>
          ))}
          {!searched && (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--mist)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚌</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem' }}>Find Your Bus</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Metro() {
  const { user } = useAuth();
  const [city, setCity] = useState('Delhi');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [passType, setPassType] = useState('single');
  const [passes, setPasses] = useState(1);
  const [fare, setFare] = useState(null);
  const [route, setRoute] = useState(null);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  const cities = ['Delhi', 'Mumbai', 'Hyderabad', 'Bangalore', 'Chennai'];
  const passTypes = [
    { key: 'single', label: 'Single Journey' },
    { key: 'return', label: 'Return' },
    { key: 'day', label: 'Day Pass' },
    { key: 'weekly', label: 'Weekly' }
  ];

  const loadStations = async (c) => {
    try {
      const res = await api.get('/metro/stations', { params: { city: c } });
      setStations(res.data.data);
    } catch {}
  };

  React.useEffect(() => { loadStations(city); }, [city]);

  const handleGetFare = async () => {
    if (!from || !to) { toast.error('Select from and to stations'); return; }
    setLoading(true);
    try {
      const [fareRes, routeRes] = await Promise.all([
        api.get('/metro/fare', { params: { from, to, city, passType } }),
        api.get('/metro/route', { params: { from, to, city } })
      ]);
      setFare(fareRes.data.data);
      setRoute(routeRes.data.data);
    } catch (err) { toast.error('Failed to get fare'); }
    finally { setLoading(false); }
  };

  const handleBook = async () => {
    if (!fare) { toast.error('Get fare first'); return; }
    try {
      await api.post('/bookings', {
        type: 'metro',
        metro: { fromStation: from, toStation: to, date: new Date(), passes: Number(passes), passType },
        payment: { amount: fare.fare * passes, currency: 'INR', status: 'pending' },
        contactDetails: { name: user.name, email: user.email }
      });
      toast.success('Metro pass booked!');
    } catch (err) { toast.error('Booking failed'); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> / Metro</div>
          <h1>🚇 Metro <em>Passes</em></h1>
          <p style={{ color: 'var(--mist)', marginTop: '0.5rem' }}>Delhi · Mumbai · Hyderabad · Bangalore · Chennai Metro</p>
        </div>
      </div>
      <div style={{ background: 'var(--ink)', minHeight: 'calc(100vh - 200px)', padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="search-panel">
            {/* City Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="form-label">Select City</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {cities.map(c => (
                  <button key={c} onClick={() => { setCity(c); setFrom(''); setTo(''); setFare(null); setRoute(null); }} style={{
                    padding: '0.5rem 1rem', fontSize: '0.7rem', border: '1px solid',
                    borderColor: city === c ? 'var(--gold)' : 'var(--border)',
                    background: city === c ? 'var(--gold)' : 'transparent',
                    color: city === c ? 'var(--ink)' : 'var(--mist)',
                    cursor: 'pointer', transition: 'all 0.3s', fontFamily: 'DM Sans, sans-serif'
                  }}>{c}</button>
                ))}
              </div>
            </div>

            <div className="search-grid search-grid-2" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">From Station</label>
                <select className="form-select" value={from} onChange={e => setFrom(e.target.value)}>
                  <option value="">Select Station</option>
                  {stations.map(s => <option key={s.id} value={s.name}>{s.name} ({s.line} Line)</option>)}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">To Station</label>
                <select className="form-select" value={to} onChange={e => setTo(e.target.value)}>
                  <option value="">Select Station</option>
                  {stations.filter(s => s.name !== from).map(s => <option key={s.id} value={s.name}>{s.name} ({s.line} Line)</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div className="form-label" style={{ marginBottom: '0.4rem' }}>Pass Type</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {passTypes.map(p => (
                  <button key={p.key} onClick={() => setPassType(p.key)} style={{
                    padding: '0.5rem 1rem', fontSize: '0.65rem', border: '1px solid',
                    borderColor: passType === p.key ? 'var(--gold)' : 'var(--border)',
                    background: passType === p.key ? 'var(--gold)' : 'transparent',
                    color: passType === p.key ? 'var(--ink)' : 'var(--mist)',
                    cursor: 'pointer', transition: 'all 0.3s', fontFamily: 'DM Sans, sans-serif'
                  }}>{p.label}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Passes</label>
                <select className="form-select" style={{ width: 100 }} value={passes} onChange={e => setPasses(e.target.value)}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <button className="btn btn-primary" onClick={handleGetFare} disabled={loading}>{loading ? 'Calculating...' : 'Get Fare'}</button>
            </div>
          </div>

          {fare && route && (
            <div className="card" style={{ padding: '2rem', marginTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                <div>
                  <div className="form-label">Route</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem' }}>{from}</div>
                  <div style={{ color: 'var(--gold)', margin: '0.3rem 0' }}>↓</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem' }}>{to}</div>
                </div>
                <div>
                  <div className="form-label">Journey Info</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--mist)', lineHeight: 2 }}>
                    <div>⏱ {route.totalTime}</div>
                    <div>📍 {route.distance}</div>
                    <div>🔄 {route.transfers} transfer{route.transfers !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="form-label">Total Fare</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem' }}>₹{(fare.fare * passes).toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--mist)' }}>{passes} × ₹{fare.fare} ({passType})</div>
                </div>
                <button className="btn btn-primary" onClick={handleBook}>Book Pass</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
