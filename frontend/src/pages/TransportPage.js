import React, { useState } from 'react';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function TransportPage({ type }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ origin: '', destination: '', date: '', adults: 1 });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState({});

  const icons = { flights: '✈', trains: '🚂', buses: '🚌' };
  const titles = { flights: 'Flights', trains: 'Trains', buses: 'Buses' };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get(`/transport/${type}`, {
        params: { origin: form.origin, destination: form.destination, date: form.date, adults: form.adults }
      });
      setResults(res.data.data || []);
      if (res.data.source === 'mock') toast('Showing sample data. Connect Amadeus/IRCTC API for live results.', { icon: 'ℹ️' });
    } catch (err) {
      toast.error('Search failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleBook = async (item, classInfo) => {
    if (!user) { toast.error('Please login to book'); return; }
    try {
      const bookingData = {
        type,
        details: { ...item, selectedClass: classInfo },
        totalPrice: classInfo ? classInfo.price : item.price,
        currency: item.currency || 'INR',
        checkIn: form.date,
        passengers: [{ firstName: user.firstName || 'Guest', lastName: user.lastName || '' }]
      };
      const res = await api.post('/bookings', bookingData);
      toast.success(`Booking confirmed! Ref: ${res.data.data.bookingRef}`);
    } catch (err) {
      toast.error('Booking failed. Please try again.');
    }
  };

  return (
    <div className="page-wrapper">
      <div style={{background:'linear-gradient(to bottom, #1e1c18, #0a0906)', padding:'4rem 2rem 2rem', borderBottom:'1px solid rgba(201,169,110,0.1)'}}>
        <div className="container">
          <p className="gold-label" style={{marginBottom:'0.5rem'}}>{icons[type]} {titles[type]} Search</p>
          <h1 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'3rem', fontWeight:300, marginBottom:'2rem'}}>Book <em style={{fontStyle:'italic', color:'#e8d5a3'}}>{titles[type]}</em></h1>
          <form onSubmit={handleSearch}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto auto', gap:'1rem', alignItems:'end'}}>
              <div>
                <label className="gold-label" style={{display:'block', marginBottom:'0.5rem'}}>From</label>
                <input value={form.origin} onChange={e => setForm(f=>({...f, origin: e.target.value}))} placeholder={type === 'flights' ? 'DEL, BOM, BLR...' : 'City or Station'} required />
              </div>
              <div>
                <label className="gold-label" style={{display:'block', marginBottom:'0.5rem'}}>To</label>
                <input value={form.destination} onChange={e => setForm(f=>({...f, destination: e.target.value}))} placeholder={type === 'flights' ? 'DXB, LHR, SIN...' : 'City or Station'} required />
              </div>
              <div>
                <label className="gold-label" style={{display:'block', marginBottom:'0.5rem'}}>Date</label>
                <input type="date" value={form.date} onChange={e => setForm(f=>({...f, date: e.target.value}))} required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="gold-label" style={{display:'block', marginBottom:'0.5rem'}}>Pax</label>
                <input type="number" value={form.adults} onChange={e => setForm(f=>({...f, adults: e.target.value}))} min="1" max="9" style={{width:'80px'}} />
              </div>
              <button type="submit" className="btn-gold" disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
            </div>
          </form>
        </div>
      </div>

      <div className="container" style={{padding:'3rem 2rem'}}>
        {loading && <div className="loading">Searching {titles[type]}...</div>}
        {results.length > 0 && (
          <div>
            <p style={{color:'#8a8278', marginBottom:'1.5rem', fontSize:'0.85rem'}}>{results.length} results found · {form.origin} → {form.destination} · {form.date}</p>
            <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
              {results.map(item => (
                <div key={item.id} className="card" style={{padding:'1.5rem'}}>
                  {type === 'flights' && (
                    <div style={{display:'grid', gridTemplateColumns:'1fr auto 1fr auto', alignItems:'center', gap:'2rem'}}>
                      <div>
                        <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.8rem', fontWeight:300}}>{item.departure}</p>
                        <p style={{color:'#8a8278', fontSize:'0.8rem'}}>{item.origin}</p>
                        <p style={{fontWeight:500, marginTop:'0.3rem'}}>{item.airline} {item.flightNumber}</p>
                      </div>
                      <div style={{textAlign:'center'}}>
                        <p style={{fontSize:'0.75rem', color:'#c9a96e'}}>{item.duration}</p>
                        <div style={{border:'1px solid rgba(201,169,110,0.3)', height:'1px', width:'80px', margin:'0.5rem auto', position:'relative'}}>
                          <span style={{position:'absolute', right:-6, top:-6, color:'#c9a96e', fontSize:'0.8rem'}}>✈</span>
                        </div>
                        <p style={{fontSize:'0.7rem', color:'#8a8278'}}>{item.stops === 0 ? 'Non-stop' : `${item.stops} stop`}</p>
                      </div>
                      <div>
                        <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.8rem', fontWeight:300}}>{item.arrival}</p>
                        <p style={{color:'#8a8278', fontSize:'0.8rem'}}>{item.destination}</p>
                        <p style={{fontSize:'0.75rem', color:'#8a8278', marginTop:'0.3rem'}}>{item.class}</p>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'2rem', fontWeight:300}}>₹{item.price?.toLocaleString()}</p>
                        <p style={{color:'#8a8278', fontSize:'0.75rem', marginBottom:'0.8rem'}}>{item.seatsLeft} seats left</p>
                        <button className="btn-gold" style={{fontSize:'0.7rem'}} onClick={() => handleBook(item, null)}>Book</button>
                      </div>
                    </div>
                  )}
                  {type === 'trains' && (
                    <div>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem'}}>
                        <div>
                          <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.3rem', fontWeight:300}}>{item.name} <span style={{color:'#c9a96e', fontSize:'1rem'}}>#{item.number}</span></h3>
                          <p style={{color:'#8a8278', fontSize:'0.8rem'}}>Runs: {item.runningDays}</p>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.5rem', fontWeight:300}}>{item.departure} → {item.arrival}</p>
                          <p style={{color:'#c9a96e', fontSize:'0.8rem'}}>{item.duration}</p>
                        </div>
                      </div>
                      <div style={{display:'flex', gap:'0.8rem', flexWrap:'wrap'}}>
                        {item.classes?.map(cls => (
                          <div key={cls.type} style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(201,169,110,0.15)', padding:'0.8rem 1.2rem', borderRadius:'4px', minWidth:'120px'}}>
                            <p style={{fontSize:'0.7rem', color:'#c9a96e', marginBottom:'0.3rem'}}>{cls.type}</p>
                            <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.2rem'}}>₹{cls.price}</p>
                            <p style={{fontSize:'0.65rem', color:'#8a8278', marginBottom:'0.5rem'}}>{cls.available} avail</p>
                            <button className="btn-gold" style={{fontSize:'0.6rem', padding:'0.4rem 0.8rem'}} onClick={() => handleBook(item, cls)}>Book</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {type === 'buses' && (
                    <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr auto', alignItems:'center', gap:'2rem'}}>
                      <div>
                        <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.3rem', fontWeight:300}}>{item.operator}</h3>
                        <p style={{color:'#c9a96e', fontSize:'0.8rem'}}>{item.busType}</p>
                        <div style={{display:'flex', gap:'0.4rem', marginTop:'0.5rem', flexWrap:'wrap'}}>
                          {item.amenities?.map(a => <span key={a} style={{fontSize:'0.65rem', color:'#8a8278', background:'rgba(255,255,255,0.04)', padding:'0.2rem 0.5rem', borderRadius:'3px'}}>{a}</span>)}
                        </div>
                      </div>
                      <div style={{textAlign:'center'}}>
                        <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.3rem'}}>{item.departure}</p>
                        <p style={{color:'#c9a96e', fontSize:'0.75rem'}}>{item.duration}</p>
                        <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.3rem'}}>{item.arrival}</p>
                      </div>
                      <div style={{textAlign:'center'}}>
                        <p style={{color:'#c9a96e'}}>★ {item.rating}</p>
                        <p style={{fontSize:'0.75rem', color:'#8a8278'}}>{item.seatsLeft} seats</p>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'2rem', fontWeight:300}}>₹{item.price}</p>
                        <button className="btn-gold" style={{fontSize:'0.7rem', marginTop:'0.5rem'}} onClick={() => handleBook(item, null)}>Book</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {results.length === 0 && !loading && (
          <div style={{textAlign:'center', padding:'6rem 2rem', color:'#8a8278'}}>
            <div style={{fontSize:'3rem', marginBottom:'1rem'}}>{icons[type]}</div>
            <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.5rem', marginBottom:'0.5rem'}}>Search for {titles[type]}</p>
            <p style={{fontSize:'0.85rem'}}>Enter your origin and destination to find available {type}</p>
          </div>
        )}
      </div>
    </div>
  );
}
