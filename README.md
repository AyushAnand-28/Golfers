# GreenHeart — Golf with Purpose

The golf subscription platform that turns your Stableford scores into monthly prize draw entries, while funding charities that matter.

---

## What is GreenHeart?

GreenHeart is a full-stack charity golf platform where members subscribe monthly or annually, log their Stableford golf scores, and automatically enter a monthly prize draw. A percentage of every subscription goes directly to a charity of the member's choosing.

---

## Features

- Golf Score Tracking — Log your last 5 Stableford scores per round
- Monthly Prize Draw — Scores convert to automatic draw entries
- Charity Selection — Choose where 10% of your subscription is donated
- Razorpay Payments — Secure INR payment processing (999/mo or 9,588/yr)
- Prize Pool Tiers — Match 3, 4, or 5 numbers to win from the pool
- Jackpot Rollover — Unclaimed 5-match jackpot rolls to next month
- Member Dashboard — Track scores, subscription status, and draw history
- Admin Panel — Manage members, charities, draws, and payouts
- Supabase Auth — Secure authentication with session persistence

---

## How It Works

```
1. Subscribe and Select
   Choose Monthly (999) or Yearly (9,588) plan
   Pick a charity you care about

2. Enter Your Scores
   Log your last 5 Stableford golf scores after each round
   Scores become your draw entries for the month

3. Automatic Draw Entry
   Every month your score history enters you into the draw
   Match 3, 4, or 5 numbers to win from different prize pools

4. Win and Give
   Winners announced monthly
   Upload golf club screenshot to verify win
   Prize paid out, charity receives their contribution
```

### Prize Pool Distribution

Match 3 Numbers — 25% of pool, split among all 3-match winners
Match 4 Numbers — 35% of pool, split among all 4-match winners
Match 5 Numbers — 40% of pool, jackpot rolls over if unclaimed

---

## Tech Stack

### Frontend (./client)
- React 19 with Vite
- React Router v7
- Supabase JS client
- Lucide React icons
- Vanilla CSS with custom design system

### Backend (./server)
- Node.js with Express 5
- Razorpay SDK for payment order creation and signature verification
- Supabase JS with service role key for server-side operations
- crypto module for HMAC-SHA256 payment verification

### Infrastructure
- Supabase — PostgreSQL database, Authentication, Row Level Security
- Razorpay — Payment gateway supporting INR in test and live modes

---

## Project Structure

```
Golfers/
├── client/
│   ├── public/
│   │   └── image.png
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   └── PrivateRoute.jsx
│       ├── contexts/
│       │   ├── AuthContext.jsx
│       │   └── ToastContext.jsx
│       ├── lib/
│       │   ├── supabase.js
│       │   └── razorpay.js
│       └── pages/
│           ├── LandingPage.jsx
│           ├── SignupPage.jsx
│           ├── LoginPage.jsx
│           ├── DashboardPage.jsx
│           ├── AdminDashboard.jsx
│           └── CharitiesPage.jsx
│
├── server/
│   ├── index.js
│   └── package.json
│
├── supabase/
└── .gitignore
```

---

## Local Setup

### Prerequisites
- Node.js v18 or higher
- A Supabase project (free tier works)
- A Razorpay account (test mode is free)

---

### 1. Clone the Repository

```bash
git clone https://github.com/AyushAnand-28/Golfers.git
cd Golfers
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```
PORT=3001
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

Where to get these values:
- Razorpay keys: dashboard.razorpay.com > Settings > API Keys > Generate Test Key
- Supabase URL and Service Key: supabase.com > Project > Settings > API

Start the backend:

```bash
npm run dev
```

Server runs on http://localhost:3001

---

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_API_URL=http://localhost:3001
```

Note: VITE_SUPABASE_ANON_KEY is the public/anon key, not the service role key.

Start the frontend:

```bash
npm run dev
```

App runs on http://localhost:5173

---

### 4. Database

Run the SQL migrations from the `/supabase` directory in the Supabase SQL editor to create required tables:

- profiles — user data and subscription status
- charities — supported charity organisations
- scores — golf score submissions
- draws — monthly draw records

---

### 5. Test Payments

Use Razorpay test card details when running locally:

- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: 123456

---

## Mock Development Mode

The app automatically runs in Mock Mode when VITE_SUPABASE_URL contains the word "placeholder". In mock mode:

- Auth is simulated locally using localStorage
- All UI features work without any backend connection
- To test the admin role, use an email containing the word "admin" (e.g. admin@test.com)

---

## Deployment

### Frontend on Vercel
1. Import the repo on vercel.com
2. Set Root Directory to `client`
3. Add all VITE_ environment variables in Vercel settings
4. Deploy

### Backend on Render
1. Create a new Web Service on render.com
2. Set Root Directory to `server`
3. Set Start Command to `node index.js`
4. Add all environment variables in Render settings
5. Copy the deployed URL and set it as VITE_API_URL in Vercel

---

## API Endpoints

```
GET  /health                       Server health check
POST /api/create-razorpay-order    Create a Razorpay payment order
POST /api/verify-razorpay-payment  Verify payment HMAC-SHA256 signature
```

---

## License

MIT
