import React, { useState, useEffect } from 'react';

export default function MapPage() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapType, setMapType] = useState('hotels');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 28.6139, lng: 77.2090 }) // Default: Delhi
      );
    }
  }, []);

  const geocodeSearch = async (q) => {
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`, {
        headers: { 'User-Agent': 'VoyaTravel/1.0' }
      });
      const data = await res.json();
      setResults(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.length > 2) geocodeSearch(search);
  };

  const mapLat = selectedPlace ? selectedPlace.lat : (userLocation?.lat || 28.6139);
  const mapLng = selectedPlace ? selectedPlace.lon : (userLocation?.lng || 77.2090);
  const mapZoom = selectedPlace ? 14 : 12;

  // Google Maps embed URL (works without API key for basic usage)
  const mapSrc = `https://maps.google.com/maps?q=${mapLat},${mapLng}&z=${mapZoom}&output=embed&t=m`;

  const nearbySearchUrl = (type) => {
    const q = type === 'hotels' ? 'hotels near me' : type === 'restaurants' ? 'restaurants' : type === 'attractions' ? 'tourist attractions' : 'metro station';
    return `https://www.google.com/maps/search/${encodeURIComponent(q)}/@${mapLat},${mapLng},14z`;
  };

  return (
    <div className="page-wrapper" style={{display:'flex', flexDirection:'column', height:'100vh'}}>
      <div style={{background:'#1e1c18', padding:'1.5rem 2rem', borderBottom:'1px solid rgba(201,169,110,0.1)', flexShrink:0}}>
        <div style={{maxWidth:'1280px', margin:'0 auto', display:'flex', alignItems:'center', gap:'2rem', flexWrap:'wrap'}}>
          <div>
            <p className="gold-label" style={{marginBottom:'0.2rem'}}>🗺 Interactive Map</p>
            <h1 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.8rem', fontWeight:300}}>Explore <em style={{fontStyle:'italic', color:'#e8d5a3'}}>Destinations</em></h1>
          </div>
          <form onSubmit={handleSearch} style={{flex:1, maxWidth:'400px', display:'flex', gap:'0.5rem'}}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search city, landmark..." style={{flex:1}} />
            <button type="submit" className="btn-gold" style={{flexShrink:0, fontSize:'0.75rem'}}>Search</button>
          </form>
          <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
            {['hotels','restaurants','attractions','metro'].map(t => (
              <button key={t} onClick={() => { setMapType(t); window.open(nearbySearchUrl(t), '_blank'); }}
                style={{padding:'0.5rem 1rem', background:mapType===t?'rgba(201,169,110,0.15)':'rgba(255,255,255,0.04)', border:'1px solid rgba(201,169,110,0.2)', color:mapType===t?'#c9a96e':'#8a8278', borderRadius:'4px', fontSize:'0.75rem', cursor:'pointer'}}>
                {t === 'hotels' ? '🏨' : t === 'restaurants' ? '🍽' : t === 'attractions' ? '🎯' : '🚇'} {t}
              </button>
            ))}
          </div>
          {userLocation && (
            <button onClick={() => { setSelectedPlace(null); }} style={{padding:'0.5rem 1rem', background:'rgba(39,174,96,0.15)', border:'1px solid rgba(39,174,96,0.3)', color:'#4caf82', borderRadius:'4px', fontSize:'0.75rem', cursor:'pointer'}}>
              📍 My Location
            </button>
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div style={{background:'#1e1c18', borderBottom:'1px solid rgba(201,169,110,0.1)', padding:'0.5rem 2rem', display:'flex', gap:'0.5rem', flexWrap:'wrap', overflowX:'auto'}}>
          {results.map(r => (
            <button key={r.place_id} onClick={() => { setSelectedPlace(r); setResults([]); }}
              style={{padding:'0.5rem 1rem', background:'rgba(201,169,110,0.08)', border:'1px solid rgba(201,169,110,0.2)', color:'#f5f0e8', borderRadius:'4px', fontSize:'0.8rem', cursor:'pointer', whiteSpace:'nowrap'}}>
              📍 {r.display_name.split(',').slice(0,3).join(', ')}
            </button>
          ))}
        </div>
      )}

      <div style={{flex:1, display:'grid', gridTemplateColumns:'1fr 320px'}}>
        <iframe
          title="VOYA Map"
          src={mapSrc}
          style={{width:'100%', height:'100%', border:'none'}}
          allowFullScreen
          loading="lazy"
        />
        <div style={{background:'#1e1c18', borderLeft:'1px solid rgba(201,169,110,0.1)', overflowY:'auto', padding:'1.5rem'}}>
          {selectedPlace ? (
            <div>
              <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.3rem', fontWeight:300, marginBottom:'0.5rem'}}>{selectedPlace.display_name.split(',')[0]}</h3>
              <p style={{color:'#8a8278', fontSize:'0.8rem', marginBottom:'1rem'}}>{selectedPlace.display_name}</p>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'1.5rem'}}>
                <div style={{background:'rgba(255,255,255,0.03)', padding:'0.8rem', borderRadius:'4px', border:'1px solid rgba(201,169,110,0.1)'}}>
                  <p className="gold-label" style={{marginBottom:'0.3rem'}}>Lat</p>
                  <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1rem'}}>{parseFloat(selectedPlace.lat).toFixed(4)}</p>
                </div>
                <div style={{background:'rgba(255,255,255,0.03)', padding:'0.8rem', borderRadius:'4px', border:'1px solid rgba(201,169,110,0.1)'}}>
                  <p className="gold-label" style={{marginBottom:'0.3rem'}}>Lng</p>
                  <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1rem'}}>{parseFloat(selectedPlace.lon).toFixed(4)}</p>
                </div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                <a href={`https://www.google.com/maps/@${selectedPlace.lat},${selectedPlace.lon},14z`} target="_blank" rel="noreferrer" className="btn-gold" style={{textAlign:'center', fontSize:'0.75rem'}}>Open in Google Maps</a>
                <a href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(selectedPlace.display_name.split(',')[0])}`} target="_blank" rel="noreferrer" className="btn-outline" style={{textAlign:'center', fontSize:'0.75rem'}}>Find Hotels Nearby</a>
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.3rem', fontWeight:300, marginBottom:'1rem'}}>Map Explorer</h3>
              <p style={{color:'#8a8278', fontSize:'0.85rem', marginBottom:'1.5rem', lineHeight:'1.7'}}>Search for any destination, or use your current location to explore nearby hotels, restaurants, attractions, and metro stations.</p>
              <div style={{display:'flex', flexDirection:'column', gap:'0.8rem'}}>
                <div style={{background:'rgba(201,169,110,0.05)', border:'1px solid rgba(201,169,110,0.1)', borderRadius:'4px', padding:'1rem'}}>
                  <p style={{color:'#c9a96e', fontSize:'0.75rem', marginBottom:'0.5rem'}}>📍 Geolocation</p>
                  <p style={{fontSize:'0.8rem', color:'#8a8278'}}>
                    {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Getting your location...'}
                  </p>
                </div>
                <div style={{background:'rgba(201,169,110,0.05)', border:'1px solid rgba(201,169,110,0.1)', borderRadius:'4px', padding:'1rem'}}>
                  <p style={{color:'#c9a96e', fontSize:'0.75rem', marginBottom:'0.5rem'}}>ℹ️ Tip</p>
                  <p style={{fontSize:'0.8rem', color:'#8a8278'}}>Click category buttons above to find nearby hotels, restaurants, attractions, or metro stations on Google Maps.</p>
                </div>
              </div>
              <div style={{marginTop:'1.5rem'}}>
                <p className="gold-label" style={{marginBottom:'0.8rem'}}>Popular Destinations</p>
                {[{name:'Delhi',lat:28.6139,lon:77.2090},{name:'Mumbai',lat:19.0760,lon:72.8777},{name:'Bangalore',lat:12.9716,lon:77.5946},{name:'Hyderabad',lat:17.3850,lon:78.4867},{name:'Jaipur',lat:26.9124,lon:75.7873}].map(p => (
                  <button key={p.name} onClick={() => setSelectedPlace(p)} style={{display:'block', width:'100%', textAlign:'left', padding:'0.6rem 0.8rem', background:'none', border:'none', color:'#8a8278', fontSize:'0.85rem', cursor:'pointer', borderBottom:'1px solid rgba(201,169,110,0.06)'}}>
                    📍 {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
