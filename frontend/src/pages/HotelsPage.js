import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MOCK_HOTELS = [
  { _id: '1', name: 'The Grand Hyatt', location: { city: 'Mumbai', country: 'India', address: 'Bandra Kurla Complex' }, pricePerNight: 12000, currency: 'INR', rating: 4.8, reviewCount: 1240, category: 'luxury', amenities: ['Pool', 'Spa', 'WiFi', 'Gym', 'Restaurant'], images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'] },
  { _id: '2', name: 'Taj Lake Palace', location: { city: 'Udaipur', country: 'India', address: 'Pichola Lake' }, pricePerNight: 45000, currency: 'INR', rating: 4.9, reviewCount: 867, category: 'luxury', amenities: ['Lake View', 'Pool', 'Spa', 'Fine Dining', 'Boat'], images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80'] },
  { _id: '3', name: 'Ibis Styles', location: { city: 'Delhi', country: 'India', address: 'Aerocity' }, pricePerNight: 3500, currency: 'INR', rating: 4.1, reviewCount: 3200, category: 'budget', amenities: ['WiFi', 'Restaurant', 'Parking'], images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80'] },
  { _id: '4', name: 'The Oberoi', location: { city: 'Bangalore', country: 'India', address: 'MG Road' }, pricePerNight: 18000, currency: 'INR', rating: 4.7, reviewCount: 945, category: 'luxury', amenities: ['Pool', 'Spa', 'WiFi', 'Bar', 'Concierge'], images: ['https://images.unsplash.com/photo-1543968996-ee822b8176ba?w=600&q=80'] },
  { _id: '5', name: 'Zostel Jaipur', location: { city: 'Jaipur', country: 'India', address: 'Pink City' }, pricePerNight: 800, currency: 'INR', rating: 4.3, reviewCount: 5600, category: 'budget', amenities: ['WiFi', 'Common Room', 'Cafe', 'Tours'], images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'] },
  { _id: '6', name: 'Aloft Hyderabad', location: { city: 'Hyderabad', country: 'India', address: 'HITEC City' }, pricePerNight: 7500, currency: 'INR', rating: 4.4, reviewCount: 1890, category: 'standard', amenities: ['Pool', 'WiFi', 'Gym', 'Bar'], images: ['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80'] },
];

export default function HotelsPage() {
  const [hotels, setHotels] = useState(MOCK_HOTELS);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ city: '', category: '', minPrice: '', maxPrice: '' });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const city = searchParams.get('city');
    if (city) setFilters(f => ({ ...f, city }));
  }, [searchParams]);

  const handleBook = (hotel) => navigate(`/hotels/${hotel._id}`, { state: { hotel } });

  return (
    <div className="page-wrapper">
      <div style={{background:'linear-gradient(to bottom, #1e1c18, #0a0906)', padding:'4rem 2rem 2rem', borderBottom:'1px solid rgba(201,169,110,0.1)'}}>
        <div className="container">
          <p className="gold-label" style={{marginBottom:'0.5rem'}}>Find Your Stay</p>
          <h1 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'3rem', fontWeight:300, marginBottom:'2rem'}}>Hotels & <em style={{fontStyle:'italic', color:'#e8d5a3'}}>Resorts</em></h1>
          <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr auto', gap:'1rem', alignItems:'end'}}>
            <div>
              <label className="gold-label" style={{display:'block', marginBottom:'0.5rem'}}>City</label>
              <input value={filters.city} onChange={e => setFilters(f => ({...f, city: e.target.value}))} placeholder="Delhi, Mumbai, Goa..." />
            </div>
            <div>
              <label className="gold-label" style={{display:'block', marginBottom:'0.5rem'}}>Category</label>
              <select value={filters.category} onChange={e => setFilters(f => ({...f, category: e.target.value}))}>
                <option value="">All</option>
                <option value="budget">Budget</option>
                <option value="standard">Standard</option>
                <option value="luxury">Luxury</option>
                <option value="boutique">Boutique</option>
              </select>
            </div>
            <div>
              <label className="gold-label" style={{display:'block', marginBottom:'0.5rem'}}>Min Price</label>
              <input type="number" value={filters.minPrice} onChange={e => setFilters(f => ({...f, minPrice: e.target.value}))} placeholder="₹ 0" />
            </div>
            <div>
              <label className="gold-label" style={{display:'block', marginBottom:'0.5rem'}}>Max Price</label>
              <input type="number" value={filters.maxPrice} onChange={e => setFilters(f => ({...f, maxPrice: e.target.value}))} placeholder="₹ 50000" />
            </div>
            <button className="btn-gold">Search</button>
          </div>
        </div>
      </div>

      <div className="container" style={{padding:'3rem 2rem'}}>
        <div className="grid-3" style={{gap:'2rem'}}>
          {hotels.filter(h => !filters.city || h.location.city.toLowerCase().includes(filters.city.toLowerCase()))
            .filter(h => !filters.category || h.category === filters.category)
            .map(hotel => (
            <div key={hotel._id} className="card" style={{cursor:'pointer'}} onClick={() => handleBook(hotel)}>
              <div style={{position:'relative', height:'200px', overflow:'hidden'}}>
                <img src={hotel.images[0]} alt={hotel.name} style={{width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s', filter:'brightness(0.85)'}} />
                <span style={{position:'absolute', top:'1rem', right:'1rem'}} className={`badge badge-${hotel.category === 'luxury' ? 'gold' : hotel.category === 'budget' ? 'blue' : 'green'}`}>
                  {hotel.category}
                </span>
              </div>
              <div style={{padding:'1.5rem'}}>
                <div className="flex-between" style={{marginBottom:'0.5rem'}}>
                  <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.3rem', fontWeight:300}}>{hotel.name}</h3>
                  <div style={{display:'flex', alignItems:'center', gap:'0.3rem', fontSize:'0.85rem'}}>
                    <span style={{color:'#c9a96e'}}>★</span>
                    <span>{hotel.rating}</span>
                    <span style={{color:'#8a8278', fontSize:'0.75rem'}}>({hotel.reviewCount})</span>
                  </div>
                </div>
                <p style={{color:'#8a8278', fontSize:'0.8rem', marginBottom:'0.8rem'}}>📍 {hotel.location.address}, {hotel.location.city}</p>
                <div style={{display:'flex', flexWrap:'wrap', gap:'0.4rem', marginBottom:'1rem'}}>
                  {hotel.amenities.slice(0,4).map(a => (
                    <span key={a} style={{fontSize:'0.65rem', padding:'0.2rem 0.5rem', background:'rgba(201,169,110,0.08)', border:'1px solid rgba(201,169,110,0.15)', borderRadius:'3px', color:'#8a8278'}}>{a}</span>
                  ))}
                </div>
                <div className="flex-between">
                  <div>
                    <span style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.6rem', fontWeight:300}}>₹{hotel.pricePerNight.toLocaleString()}</span>
                    <span style={{color:'#8a8278', fontSize:'0.75rem'}}> /night</span>
                  </div>
                  <button className="btn-gold" style={{padding:'0.6rem 1.2rem', fontSize:'0.7rem'}}>Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
