import React, { useState } from 'react';
import { api } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const classes = ['ECONOMY', 'BUSINESS', 'FIRST'];

export default function Flights() {
  const { user } = useAuth();
  const [search, setSearch] = useState({ origin: '', destination: '', date: '', adults: 1, travelClass: 'ECONOMY' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [bookingFlight, setBookingFlight] = useState(null);

  const set = k => e => setSearch(s => ({ ...s, [k]: e.target.value }));

  const handleSearch = async () => {
    if (!search.origin || !search.destination || !search.date) { toast.error('Fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await api.get('/flights/search', { params: search });
      setResults(res.data.data);
      setSearched(true);
      if (res.data.mock) toast('Showing sample data. Add Amadeus API key for live results.', { icon: 'ℹ️' });
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (flight) => {
    try {
      await api.post('/bookings', {
        type: 'flight',
        flight: {
          flightNumber: flight.flightNumber,
          airline: flight.airline,
          from: flight.origin,
          to: flight.destination,
          departure: new Date(`${flight.date}T${flight.departure}`),
          arrival: new Date(`${flight.date}T${flight.arrival}`),
          class: flight.class,
          passengers: search.adults,
        },
        payment: { amount: flight.price * search.adults, currency: 'INR', status: 'pending' },
        contactDetails: { name: user.name, email: user.email }
      });
      toast.success(`Flight booked! Ref will be in My Bookings.`);
      setBookingFlight(null);
    } catch (err) {
      toast.error('Booking failed');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> / Flights</div>
          <h1>✈ Book <em>Flights</em></h1>
          <p style={{ color: 'var(--mist)', marginTop: '0.5rem' }}>Search domestic & international flights</p>
        </div>
      </div>

      <div style={{ background: 'var(--ink)', minHeight: 'calc(100vh - 200px)', padding: '2rem 0' }}>
        <div className="container">
          {/* Search Panel */}
          <div className="search-panel">
            <div className="search-grid search-grid-4" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">From (Airport Code)</label>
                <input className="form-input" placeholder="DEL, BOM, BLR..." value={search.origin} onChange={set('origin')} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">To (Airport Code)</label>
                <input className="form-input" placeholder="HYD, MAA, CCU..." value={search.destination} onChange={set('destination')} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={search.date} onChange={set('date')} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Passengers</label>
                <select className="form-select" value={search.adults} onChange={set('adults')}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Adult{n>1?'s':''}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div>
                <label className="form-label" style={{ marginBottom: '0.3rem' }}>Class</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {classes.map(c => (
                    <button key={c} onClick={() => setSearch(s => ({ ...s, travelClass: c }))} style={{
                      padding: '0.5rem 1rem', fontSize: '0.65rem', letterSpacing: '0.1em',
                      textTransform: 'uppercase', border: '1px solid',
                      borderColor: search.travelClass === c ? 'var(--gold)' : 'var(--border)',
                      background: search.travelClass === c ? 'var(--gold)' : 'transparent',
                      color: search.travelClass === c ? 'var(--ink)' : 'var(--mist)',
                      cursor: 'pointer', transition: 'all 0.3s', fontFamily: 'DM Sans, sans-serif'
                    }}>{c}</button>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary" style={{ marginLeft: 'auto', marginTop: '1.2rem' }} onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search Flights'}
              </button>
            </div>
          </div>

          {/* Results */}
          {searched && (
            <div>
              <div style={{ marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--mist)' }}>
                {results.length} flights found · {search.origin} → {search.destination} · {search.date}
              </div>
              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--mist)' }}>No flights found for this route and date.</div>
              ) : results.map(flight => (
                <div key={flight.id} className="result-card">
                  <div style={{ minWidth: 120 }}>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>{flight.airline}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--mist)', letterSpacing: '0.1em' }}>{flight.flightNumber}</div>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem' }}>{flight.departure}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>{flight.origin}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--mist)', letterSpacing: '0.2em' }}>{flight.duration}</div>
                    <div style={{ width: 80, height: 1, background: 'var(--border)', margin: '0.5rem auto' }} />
                    <div style={{ fontSize: '0.6rem', color: flight.stops === 0 ? '#6fcf97' : 'var(--gold)' }}>{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}</div>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem' }}>{flight.arrival}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>{flight.destination}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="result-price">₹{(flight.price * search.adults).toLocaleString('en-IN')}<small>for {search.adults} pax</small></div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--mist)', marginBottom: '0.5rem' }}>{flight.seats} seats left</div>
                    <button className="btn btn-primary btn-sm" onClick={() => handleBook(flight)}>Book Now</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!searched && (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--mist)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✈</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '0.5rem' }}>Find Your Flight</div>
              <div style={{ fontSize: '0.85rem' }}>Enter your route and date to search available flights</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
