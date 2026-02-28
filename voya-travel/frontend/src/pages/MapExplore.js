import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const DESTINATIONS = [
  { name: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.2090, desc: 'Capital city with rich Mughal & colonial heritage', type: 'city' },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, desc: 'Financial capital — Bollywood, beaches & street food', type: 'city' },
  { name: 'Goa', country: 'India', lat: 15.2993, lng: 74.1240, desc: 'Sun, sand, and vibrant nightlife', type: 'beach' },
  { name: 'Jaipur', country: 'India', lat: 26.9124, lng: 75.7873, desc: 'Pink City — palaces, forts & desert safari', type: 'cultural' },
  { name: 'Kerala Backwaters', country: 'India', lat: 9.9312, lng: 76.2673, desc: 'Serene houseboat journeys through emerald waterways', type: 'nature' },
  { name: 'Ladakh', country: 'India', lat: 34.1526, lng: 77.5771, desc: 'High-altitude desert — monasteries & stargazing', type: 'mountain' },
  { name: 'Kyoto', country: 'Japan', lat: 35.0116, lng: 135.7681, desc: 'Ancient temples, geishas & cherry blossoms', type: 'cultural' },
  { name: 'Santorini', country: 'Greece', lat: 36.3932, lng: 25.4615, desc: 'Iconic blue domes & Aegean sunsets', type: 'beach' },
  { name: 'Marrakech', country: 'Morocco', lat: 31.6295, lng: -7.9811, desc: 'Labyrinthine souks & Sahara gateway', type: 'cultural' },
  { name: 'Bali', country: 'Indonesia', lat: -8.4095, lng: 115.1889, desc: 'Temple culture, rice terraces & surf', type: 'beach' },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, desc: 'City of Light — art, cuisine & romance', type: 'city' },
  { name: 'Machu Picchu', country: 'Peru', lat: -13.1631, lng: -72.5450, desc: 'Incan citadel in the clouds', type: 'mountain' },
];

const TYPE_COLORS = { city: '#c9a96e', beach: '#4a90d9', mountain: '#6fcf97', cultural: '#bb6bd9', nature: '#eb5757', nature: '#2ecc71' };

function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.flyTo(center, 10, { duration: 1.5 }); }, [center, map]);
  return null;
}

export default function MapExplore() {
  const [userLocation, setUserLocation] = useState(null);
  const [flyTo, setFlyTo] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const getMyLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setFlyTo(coords);
        setGeoLoading(false);
        toast.success('Located you!');
      },
      () => { toast.error('Could not get location. Allow location access.'); setGeoLoading(false); }
    );
  };

  const types = ['all', 'city', 'beach', 'mountain', 'cultural', 'nature'];
  const filtered = DESTINATIONS.filter(d => {
    const matchType = filter === 'all' || d.type === filter;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 70px)', background: 'var(--ink)', marginTop: 70 }}>
      {/* Sidebar */}
      <div style={{ width: 340, background: 'var(--ash)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', marginBottom: '1rem' }}>
            🗺 <em>Explore</em>
          </div>
          <input
            className="form-input"
            placeholder="Search destinations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginBottom: '0.8rem' }}
          />
          <button className="btn btn-outline btn-sm" style={{ width: '100%', marginBottom: '0.8rem' }} onClick={getMyLocation} disabled={geoLoading}>
            {geoLoading ? 'Locating...' : '📍 My Location'}
          </button>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{
                padding: '0.3rem 0.7rem', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                border: '1px solid', borderColor: filter === t ? 'var(--gold)' : 'var(--border)',
                background: filter === t ? 'var(--gold)' : 'transparent',
                color: filter === t ? 'var(--ink)' : 'var(--mist)',
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif'
              }}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(d => (
            <div key={d.name}
              onClick={() => { setSelected(d); setFlyTo([d.lat, d.lng]); }}
              style={{
                padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                background: selected?.name === d.name ? 'var(--gold-dim)' : 'transparent',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => { if (selected?.name !== d.name) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
              onMouseLeave={e => { if (selected?.name !== d.name) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'var(--cream)' }}>{d.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>{d.country}</div>
                </div>
                <span style={{ background: TYPE_COLORS[d.type] + '22', color: TYPE_COLORS[d.type], border: `1px solid ${TYPE_COLORS[d.type]}44`, fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.5rem' }}>{d.type}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.3rem', lineHeight: 1.5 }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <MapContainer center={[20, 78]} zoom={4} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {flyTo && <FlyTo center={flyTo} />}
          {userLocation && (
            <>
              <Circle center={userLocation} radius={20000} pathOptions={{ fillColor: '#c9a96e', fillOpacity: 0.1, color: '#c9a96e', weight: 1 }} />
              <Marker position={userLocation} icon={goldIcon}>
                <Popup><div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem' }}><strong>You are here</strong></div></Popup>
              </Marker>
            </>
          )}
          {filtered.map(d => (
            <Marker key={d.name} position={[d.lat, d.lng]}>
              <Popup maxWidth={240}>
                <div style={{ fontFamily: 'DM Sans, sans-serif', padding: '0.2rem' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 400, color: '#0a0906', marginBottom: '0.3rem' }}>{d.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '0.4rem' }}>{d.country}</div>
                  <div style={{ fontSize: '0.75rem', color: '#444', lineHeight: 1.5 }}>{d.desc}</div>
                  <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.4rem' }}>
                    <a href="/flights" style={{ fontSize: '0.6rem', background: '#c9a96e', color: '#0a0906', padding: '0.3rem 0.6rem', textDecoration: 'none' }}>✈ Fly</a>
                    <a href="/hotels" style={{ fontSize: '0.6rem', background: '#1a1814', color: '#c9a96e', border: '1px solid #c9a96e', padding: '0.3rem 0.6rem', textDecoration: 'none' }}>🏨 Stay</a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
