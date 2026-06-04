
# 🔥 Flamr — Modern Dating App

A full-stack **Tinder-like dating application** built with React, Node.js, Express, MongoDB, and Socket.io. Features real-time chat, swipe cards with animations, match detection, and a beautiful dark-mode UI.

![Flamr Banner](https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&h=300&fit=crop)

---

## ✨ Features

### 👤 User Features
- **Authentication** — JWT-based register/login system
- **Profile Creation** — Name, age, gender, bio, interests, photos
- **Swipe Cards** — Drag-to-swipe with like/dislike/super-like animations
- **Match System** — Mutual like detection → instant match notification
- **Real-time Chat** — Socket.io powered messaging with typing indicators
- **Matches List** — View all mutual matches with last message preview
- **Profile Editing** — Photos, interests, bio, location, preferences

### 🎨 UI/UX
- **Dark Mode** — Sleek black and flame-red design system
- **Glassmorphism** — Frosted glass cards and panels
- **Swipe Animations** — LIKE/NOPE labels with smooth card physics
- **Match Modal** — Animated celebration popup on a new match
- **Responsive** — Mobile-first, works on all screen sizes
- **Micro-animations** — Hover effects, heartbeat, floating elements

### 🔧 Backend
- **REST API** — Full CRUD for users, matches, messages
- **Socket.io** — Real-time bidirectional chat
- **JWT Auth** — Secure token-based authentication
- **bcrypt** — Password hashing (12 rounds)
- **MongoDB** — 3 collections: Users, Matches, Messages
- **Discover Feed** — Excludes already-swiped users, filter by age/gender

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 + Custom CSS |
| State | Zustand (persisted) |
| Routing | React Router v6 |
| HTTP | Axios |
| Real-time | Socket.io-client |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| WebSocket | Socket.io |

---

## 📁 Project Structure

```
flamr/
├── backend/
│   ├── models/
│   │   ├── User.js         # User schema (profile, likes, matches)
│   │   ├── Match.js        # Match schema (conversation linking)
│   │   └── Message.js      # Chat message schema
│   ├── routes/
│   │   ├── auth.js         # POST /signup, POST /login, GET /me
│   │   ├── users.js        # GET /discover, POST /like/:id, POST /dislike/:id, PUT /profile
│   │   ├── matches.js      # GET /, GET /:id, DELETE /:id
│   │   └── messages.js     # GET /:convId, POST /:convId
│   ├── middleware/
│   │   └── auth.js         # JWT authentication middleware
│   ├── server.js           # Express + Socket.io server
│   ├── .env                # Environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── LandingPage.jsx     # Marketing homepage
    │   │   ├── LoginPage.jsx       # Login form
    │   │   ├── SignupPage.jsx      # Multi-step registration
    │   │   ├── DiscoverPage.jsx    # Swipe card feed
    │   │   ├── MatchesPage.jsx     # Matches grid
    │   │   ├── ChatPage.jsx        # Real-time chat
    │   │   ├── ProfilePage.jsx     # My profile view
    │   │   └── EditProfilePage.jsx # Profile editor
    │   ├── components/
    │   │   ├── Layout.jsx          # App shell + navigation
    │   │   └── MatchModal.jsx      # Match celebration popup
    │   ├── store/
    │   │   └── authStore.js        # Zustand auth state
    │   ├── utils/
    │   │   ├── api.js              # Axios instance
    │   │   └── socket.js           # Socket.io singleton
    │   ├── App.jsx                 # Router + route guards
    │   └── index.css               # Global design system
    ├── index.html
    └── vite.config.js
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v18+ 
- **MongoDB** (local or MongoDB Atlas)
- **npm** or yarn

### 1. Clone & Install

```bash
# Navigate to project folder
cd "harsh app"

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flamr
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

For **MongoDB Atlas**, replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flamr
```

### 3. Start Development Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Backend runs at: http://localhost:5000

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: http://localhost:5173

### 4. Open in Browser

Navigate to **http://localhost:5173** and start dating! 🔥

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/discover` | Get users to swipe (with filters) |
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/profile` | Update own profile |
| POST | `/api/users/like/:id` | Like a user |
| POST | `/api/users/dislike/:id` | Dislike a user |

### Matches
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/matches` | Get all my matches |
| GET | `/api/matches/:conversationId` | Get specific match |
| DELETE | `/api/matches/:matchId` | Unmatch |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/:conversationId` | Get chat history |
| POST | `/api/messages/:conversationId` | Send message (REST fallback) |

---

## 🗄️ Database Schema

### Users Collection
```js
{
  email, password (hashed), name, age, gender,
  interestedIn, bio, interests[], photos[],
  location: { city, country, coordinates },
  preferences: { ageMin, ageMax, maxDistance },
  likedUsers[], dislikedUsers[], matches[],
  isProfileComplete, lastActive, isOnline
}
```

### Matches Collection
```js
{
  users: [userId1, userId2],
  conversationId: "conv_id1_id2",
  isActive, lastMessage: { content, timestamp, sender }
}
```

### Messages Collection
```js
{
  conversationId, sender, receiver,
  content, messageType, isRead, timestamp
}
```

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```
Set environment variable in Vercel: none required (API proxied via Vite).

For production, update `vite.config.js` proxy target or use `VITE_API_URL` env var.

### Backend → Render / Railway
1. Connect your GitHub repo
2. Set build command: `npm install`
3. Set start command: `node server.js`
4. Add environment variables:
   - `MONGODB_URI` — Atlas connection string
   - `JWT_SECRET` — Long random secret
   - `CLIENT_URL` — Your Vercel frontend URL
   - `PORT` — 5000 (or let Render set it)

### Database → MongoDB Atlas
1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free M0 cluster
3. Whitelist IP `0.0.0.0/0` for Render
4. Copy connection string → set as `MONGODB_URI`

---

## 🔌 Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `user_online` | Client → Server | Register online presence |
| `join_room` | Client → Server | Join conversation room |
| `send_message` | Client → Server | Send a chat message |
| `receive_message` | Server → Client | Receive a message |
| `typing` | Client → Server | Start typing indicator |
| `stop_typing` | Client → Server | Stop typing indicator |
| `user_typing` | Server → Client | Show typing to other user |
| `online_users` | Server → Client | List of online user IDs |

---

## 🎨 Design System

- **Primary Color:** `#FF4458` (Flame Red)
- **Accent:** `#FD297B` (Pink)
- **Dark BG:** `#0D0D0D`
- **Card BG:** `#1A1A2E`
- **Font:** Inter + Playfair Display
- **Animations:** CSS keyframes (no heavy libraries)

---

## 📸 Screenshots

> Launch the app and visit http://localhost:5173 to see:
> - 🏠 Landing page with hero + feature cards
> - 🔐 Login/Signup with multi-step form
> - 🔥 Discover page with draggable swipe cards
> - ❤️ Matches grid with real-time status
> - 💬 Chat with typing indicators
> - 👤 Profile with completion tracker

---

## 🛠️ Future Enhancements

- [ ] Push notifications (web push API)
- [ ] Location-based matching (Geospatial queries)
- [ ] Premium subscription (Stripe)
- [ ] Video calls (WebRTC)
- [ ] Story-like photo status
- [ ] Instagram/Spotify profile linking
- [ ] Report & block functionality
- [ ] Admin dashboard

---

## 📄 License

MIT License — built with ❤️ and 🔥 by Harsh Sahu

---

*Made with Flamr — Find your flame! 🔥*
