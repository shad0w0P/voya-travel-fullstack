import React, { useState } from 'react';
import { api } from '../context/AuthContext';

const METRO_DATA = {
  delhi: {
    name: 'Delhi Metro', city: 'Delhi',
    lines: [
      { name: 'Red Line', number: 'Line 1', color: '#e74c3c', from: 'Dilshad Garden', to: 'Rithala', stations: 29 },
      { name: 'Yellow Line', number: 'Line 2', color: '#f1c40f', from: 'Samaypur Badli', to: 'HUDA City Centre', stations: 37 },
      { name: 'Blue Line', number: 'Line 3/4', color: '#3498db', from: 'Dwarka Sec 21', to: 'Vaishali/Noida Elect. City', stations: 50 },
      { name: 'Green Line', number: 'Line 5', color: '#27ae60', from: 'Inderlok', to: 'Brigadier Hoshiyar Singh', stations: 21 },
      { name: 'Violet Line', number: 'Line 6', color: '#8e44ad', from: 'Kashmere Gate', to: 'Raja Nahar Singh', stations: 34 },
      { name: 'Pink Line', number: 'Line 7', color: '#e91e8c', from: 'Majlis Park', to: 'Shiv Vihar', stations: 38 },
      { name: 'Magenta Line', number: 'Line 8', color: '#9b2335', from: 'Janakpuri West', to: 'Botanical Garden', stations: 25 },
      { name: 'Grey Line', number: 'Line 9', color: '#95a5a6', from: 'Dwarka', to: 'Najafgarh', stations: 4 },
    ],
    fare: '₹10 – ₹60', timing: '5:30 AM – 11:30 PM', frequency: '2–5 min peak', smartCard: 'Delhi Metro Smart Card (10% discount)',
    tips: ['Buy a Smart Card for 10% discount on all rides', 'Avoid peak hours 8–10AM and 5–8PM', 'Use UPI or card at token machines', 'Airport Express Line from New Delhi to IGI T3 in 18 min']
  },
  mumbai: {
    name: 'Mumbai Metro', city: 'Mumbai',
    lines: [
      { name: 'Line 1 (Versova–Ghatkopar)', number: 'Line 1', color: '#e74c3c', from: 'Versova', to: 'Ghatkopar', stations: 12 },
      { name: 'Line 2A (Dahisar–Andheri)', number: 'Line 2A', color: '#3498db', from: 'Dahisar E', to: 'D N Nagar', stations: 17 },
      { name: 'Line 7 (Andheri–Gundavali)', number: 'Line 7', color: '#f39c12', from: 'Andheri E', to: 'Gundavali', stations: 13 },
    ],
    fare: '₹10 – ₹50', timing: '5:30 AM – 11:00 PM', frequency: '4–7 min', smartCard: 'Mumbai Metro One Card',
    tips: ['Link Metro card with local train pass for savings', 'Cashless payment preferred', 'Avoid rush hours 8–10AM and 6–9PM']
  },
  bangalore: {
    name: 'Namma Metro', city: 'Bangalore',
    lines: [
      { name: 'Purple Line', number: 'Line 1', color: '#8e44ad', from: 'Challaghatta', to: 'Baiyappanahalli', stations: 37 },
      { name: 'Green Line', number: 'Line 2', color: '#27ae60', from: 'Nagasandra', to: 'Silk Institute', stations: 38 },
    ],
    fare: '₹10 – ₹55', timing: '5:00 AM – 11:00 PM', frequency: '5–8 min', smartCard: 'Namma Metro Smart Card',
    tips: ['Purchase day passes for tourists', 'Connect to BMTC buses at interchange', 'Airport connectivity via Kempapura (Green Line)']
  },
  hyderabad: {
    name: 'Hyderabad Metro', city: 'Hyderabad',
    lines: [
      { name: 'Red Line', number: 'Line 1', color: '#e74c3c', from: 'Miyapur', to: 'LB Nagar', stations: 27 },
      { name: 'Blue Line', number: 'Line 2', color: '#3498db', from: 'JBS Parade Grounds', to: 'MGBS', stations: 16 },
      { name: 'Green Line', number: 'Line 3', color: '#27ae60', from: 'Nagole', to: 'RGIA Airport', stations: 28 },
    ],
    fare: '₹10 – ₹60', timing: '6:00 AM – 11:00 PM', frequency: '5–7 min', smartCard: 'T-Money Card',
    tips: ['Green Line connects to Rajiv Gandhi Airport', 'Mall connectivity at major stations', 'Interchange at Ameerpet, Parade Grounds']
  }
};

export default function MetroPage() {
  const [selectedCity, setSelectedCity] = useState('delhi');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const metro = METRO_DATA[selectedCity];

  return (
    <div className="page-wrapper">
      <div style={{background:'linear-gradient(to bottom, #1e1c18, #0a0906)', padding:'4rem 2rem 2rem', borderBottom:'1px solid rgba(201,169,110,0.1)'}}>
        <div className="container">
          <p className="gold-label" style={{marginBottom:'0.5rem'}}>🚇 City Transit</p>
          <h1 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'3rem', fontWeight:300, marginBottom:'2rem'}}>Metro <em style={{fontStyle:'italic', color:'#e8d5a3'}}>Navigator</em></h1>
          <div style={{display:'flex', gap:'0.8rem', flexWrap:'wrap'}}>
            {Object.entries(METRO_DATA).map(([key, m]) => (
              <button key={key} onClick={() => setSelectedCity(key)} style={{...styles.cityBtn, ...(selectedCity === key ? styles.cityBtnActive : {})}}>
                {m.city}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{padding:'3rem 2rem'}}>
        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'3rem', alignItems:'start'}}>
          <div>
            <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'2rem', fontWeight:300, marginBottom:'0.5rem'}}>{metro.name}</h2>
            <div style={{display:'flex', gap:'2rem', marginBottom:'2rem', flexWrap:'wrap'}}>
              <div style={styles.infoChip}><span style={{color:'#c9a96e'}}>🕐</span> {metro.timing}</div>
              <div style={styles.infoChip}><span style={{color:'#c9a96e'}}>💰</span> {metro.fare}</div>
              <div style={styles.infoChip}><span style={{color:'#c9a96e'}}>⏱</span> {metro.frequency}</div>
            </div>

            <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.5rem', fontWeight:300, marginBottom:'1.5rem'}}>Metro Lines</h3>
            <div style={{display:'flex', flexDirection:'column', gap:'0.8rem', marginBottom:'2.5rem'}}>
              {metro.lines.map(line => (
                <div key={line.name} className="card" style={{padding:'1rem 1.5rem', display:'flex', alignItems:'center', gap:'1.5rem'}}>
                  <div style={{width:'12px', height:'12px', borderRadius:'50%', background:line.color, flexShrink:0, boxShadow:`0 0 8px ${line.color}`}}></div>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:400, fontSize:'0.9rem'}}>{line.name}</p>
                    <p style={{color:'#8a8278', fontSize:'0.75rem'}}>{line.from} ↔ {line.to}</p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <p className="badge badge-gold">{line.stations} stations</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.5rem', fontWeight:300, marginBottom:'1rem'}}>Smart Card</h3>
            <div className="card" style={{padding:'1rem 1.5rem', borderLeft:'3px solid #c9a96e', marginBottom:'2.5rem'}}>
              💳 <span style={{marginLeft:'0.5rem'}}>{metro.smartCard}</span>
            </div>

            <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.5rem', fontWeight:300, marginBottom:'1rem'}}>Traveller Tips</h3>
            <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
              {metro.tips.map((tip, i) => (
                <div key={i} style={{display:'flex', gap:'1rem', padding:'0.8rem', background:'rgba(201,169,110,0.04)', borderRadius:'4px'}}>
                  <span style={{color:'#c9a96e', fontSize:'0.8rem', marginTop:'1px'}}>✦</span>
                  <p style={{fontSize:'0.85rem', color:'#8a8278'}}>{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="card" style={{padding:'2rem'}}>
              <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.3rem', fontWeight:300, marginBottom:'1.5rem'}}>Plan Your Route</h3>
              <div style={{marginBottom:'1rem'}}>
                <label className="gold-label" style={{display:'block', marginBottom:'0.5rem'}}>From Station</label>
                <input value={from} onChange={e => setFrom(e.target.value)} placeholder="Enter station name" />
              </div>
              <div style={{marginBottom:'1.5rem'}}>
                <label className="gold-label" style={{display:'block', marginBottom:'0.5rem'}}>To Station</label>
                <input value={to} onChange={e => setTo(e.target.value)} placeholder="Enter destination station" />
              </div>
              <button className="btn-gold" style={{width:'100%'}} onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(from + ' metro to ' + to + ' ' + metro.city)}`, '_blank')}>
                Get Directions on Google Maps
              </button>
              <button className="btn-outline" style={{width:'100%', marginTop:'0.8rem'}} onClick={() => window.open(`https://www.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}`, '_blank')}>
                Open in Maps
              </button>
            </div>

            <div className="card" style={{padding:'2rem', marginTop:'1.5rem'}}>
              <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'1.3rem', fontWeight:300, marginBottom:'1rem'}}>Quick Links</h3>
              {[
                { label: 'Official Website', city: metro.city },
                { label: 'Download Route Map PDF', city: metro.city },
                { label: 'Buy Smart Card Online', city: metro.city }
              ].map(l => (
                <div key={l.label} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.7rem 0', borderBottom:'1px solid rgba(201,169,110,0.08)'}}>
                  <span style={{fontSize:'0.85rem', color:'#8a8278'}}>{l.label}</span>
                  <span style={{color:'#c9a96e', fontSize:'0.9rem'}}>→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  cityBtn: { padding:'0.6rem 1.5rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(201,169,110,0.2)', color:'#8a8278', borderRadius:'4px', cursor:'pointer', fontSize:'0.8rem', transition:'all 0.3s' },
  cityBtnActive: { background:'#c9a96e', color:'#0a0906', borderColor:'#c9a96e' },
  infoChip: { background:'rgba(201,169,110,0.08)', border:'1px solid rgba(201,169,110,0.15)', padding:'0.5rem 1rem', borderRadius:'4px', fontSize:'0.8rem', color:'#f5f0e8' }
};
