# 🌍 VOYA — Full-Stack Travel Booking Platform
### MERN Stack · React.js · Node.js · Express.js · MongoDB

---

## 📦 Project Structure

```
voya-travel/
├── backend/          # Node.js + Express API
│   ├── models/       # Mongoose schemas (User, Booking, Destination)
│   ├── routes/       # API routes (auth, flights, hotels, trains, buses, metro, bookings, admin)
│   ├── middleware/   # JWT auth, role guard
│   ├── server.js     # Entry point
│   └── .env.example  # Environment variables template
└── frontend/         # React.js app
    └── src/
        ├── pages/    # All page components
        │   ├── admin/  # Admin dashboard, users, bookings
        │   └── ...     # Login, Register, Flights, Hotels, Trains, Buses, Metro, Map, etc.
        ├── components/ # Navbar, Footer
        └── context/    # Auth context + Axios instance
```

---

## 🚀 Features

### Authentication
- ✅ Register/Login via **Email**, **Phone Number**, or **Username** — user's choice
- ✅ JWT-based auth (7-day tokens)
- ✅ Forgot password / Reset password flow
- ✅ Admin vs User role system

### Booking Modules
| Module | Features |
|--------|----------|
| ✈ Flights | Search by airport code, date, class, passengers · Amadeus API (+ mock fallback) |
| 🏨 Hotels | City search, check-in/out, guests, rooms, star filter, price filter |
| 🚂 Trains | Indian Railways style search, class selector (SL/3A/2A/1A), popular routes |
| 🚌 Buses | City-to-city, bus type (AC/Sleeper/Volvo), operator listings |
| 🚇 Metro | Delhi/Mumbai/Hyderabad/Bangalore/Chennai, station picker, fare calculator, pass types |

### Interactive Map
- 🗺 Leaflet.js dark theme map
- 📍 Browser Geolocation API — "My Location" button
- 12 global destinations with click-to-fly navigation
- Category filters (city, beach, mountain, cultural)
- Popup with quick-book links

### Admin Panel
- 📊 Dashboard: user count, bookings, revenue, bookings by type
- 👥 User management: search, promote/demote admin, activate/deactivate
- 📋 All bookings: filter by type & status, cancel bookings

### User Dashboard
- My Bookings with filter by type/status
- Booking cancellation
- Profile update & password change

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Git

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
# Runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### 4. Environment Variables (backend/.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voya_travel
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000

# Optional: Amadeus API for live flight data (free test account)
# Sign up at: https://developers.amadeus.com
AMADEUS_CLIENT_ID=your_id
AMADEUS_CLIENT_SECRET=your_secret
```

### 5. Create First Admin User

After registering via the UI, open MongoDB shell or Compass and run:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register (email/phone/username) |
| POST | /api/auth/login | Login (email/phone/username + password) |
| GET  | /api/auth/me | Get current user |
| POST | /api/auth/forgot-password | Request reset |
| POST | /api/auth/reset-password | Reset with token |

### Travel Search (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/flights/search | Search flights |
| GET | /api/flights/airports | Airport autocomplete |
| GET | /api/hotels/search | Search hotels |
| GET | /api/trains/search | Search trains |
| GET | /api/trains/stations | Station list |
| GET | /api/buses/search | Search buses |
| GET | /api/metro/stations | Metro stations by city |
| GET | /api/metro/fare | Fare calculation |
| GET | /api/metro/route | Route info |

### Bookings (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/bookings/my | My bookings |
| POST | /api/bookings | Create booking |
| GET | /api/bookings/:id | Booking detail |
| PATCH | /api/bookings/:id/cancel | Cancel booking |

### Admin (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Stats overview |
| GET | /api/admin/users | All users |
| PATCH | /api/admin/users/:id | Update user role/status |
| GET | /api/admin/bookings | All bookings |

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Map | React-Leaflet + Leaflet.js + OpenStreetMap (CartoDB dark tiles) |
| Geolocation | Browser Geolocation API |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Flights API | Amadeus for Developers (free sandbox) |
| Security | Helmet, express-rate-limit, CORS |
| Notifications | react-hot-toast |

---

## 🎨 Design System

- Dark luxury aesthetic inspired by editorial travel photography
- Color palette: `#0a0906` ink, `#c9a96e` gold, `#f5f0e8` cream
- Typography: Cormorant Garamond (display) + DM Sans (body)
- Fully responsive

---

## 📝 Notes

- All search results include **mock data fallback** — works without any API keys
- To get **live flight data**: sign up free at https://developers.amadeus.com (sandbox)
- Hotel/Train/Bus data: uses realistic mock data; integrate Booking.com or RailYatri APIs for production
- Metro: static route data for 5 Indian cities; integrate DMRC/MMRC open data APIs for real-time

---

## 🔮 Future Additions (Suggested)
- Payment gateway integration (Razorpay/Stripe)
- Email confirmation (Nodemailer)
- Real-time seat availability via WebSockets
- Review & rating system
- Mobile app (React Native)
