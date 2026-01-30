# Sherpa Momo - Full Stack E-commerce Platform

A modern, full-stack e-commerce platform for authentic Himalayan cuisine: **web store**, **mobile app** (Expo/React Native), **admin dashboard**, and **REST API** backend (Node.js, Express, MongoDB).

## 🚀 Features

- **🛒 Shopping & Cart** – Add/remove items, real-time totals, persistent cart (web + mobile)
- **📱 Web & Mobile** – Next.js storefront and Expo mobile app (iOS/Android)
- **🔐 Auth** – Phone OTP (SMS via Twilio) and Google sign-in (web); mobile supports both phone and in-app browser Google sign-in
- **📦 Orders** – Place orders, track status, order history; cash on delivery
- **👤 Profile** – User profile, saved delivery address/name/phone (stored in backend)
- **🛠️ Admin** – Separate Next.js app for orders, products, and users
- **🎨 UI** – Tailwind CSS, shadcn/ui (web/admin), custom theme (mobile)
- **🗄️ Data** – MongoDB with Mongoose; TypeScript across stack

## 🏗️ Tech Stack

| Layer    | Stack |
|----------|--------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Sonner, Lucide, Firebase (Google auth) |
| **Backend**  | Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, Twilio (SMS) |
| **Mobile**   | Expo (SDK 54), React Native, expo-router, expo-web-browser |
| **Admin**    | Next.js, TypeScript, Tailwind, shadcn/ui, Firebase |

## 📋 Prerequisites

- **Node.js** 18+
- **npm** or **yarn** (or **pnpm** for admin)
- **MongoDB** – local or [MongoDB Atlas](https://cloud.mongodb.com/) (free tier)
- **Expo account** – for [EAS Build](https://expo.dev) (mobile builds; optional for local dev)

## 🛠️ Setup Instructions

### 1. Clone and install

```bash
git clone <repo-url>
cd sherpamomo

# Backend
cd backend && npm install && cd ..

# Frontend (customer store)
cd frontend && npm install && cd ..

# Admin (optional)
cd admin && pnpm install && cd ..

# Mobile (optional)
cd mobile && npm install && cd ..
```

### 2. Backend environment

Copy `.env.example` to `.env` in `backend/` and set:

```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/sherpamomo   # or Atlas URI
JWT_SECRET=your-secure-jwt-secret
OTP_SECRET=your-otp-secret

# Optional: SMS (Twilio) for phone auth
# TWILIO_ACCOUNT_SID=...
# TWILIO_AUTH_TOKEN=...
# TWILIO_PHONE_NUMBER=+1...
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

### 4. Frontend environment (web store)

In `frontend/`, create `.env.local` with your API URL and Firebase config (for Google sign-in):

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# ... other Firebase client env vars
```

### 5. Run development servers

```bash
# Terminal 1 – Backend
cd backend && npm run dev

# Terminal 2 – Frontend (web store)
cd frontend && npm run dev

# Terminal 3 (optional) – Admin
cd admin && pnpm dev

# Terminal 4 (optional) – Mobile
cd mobile && npx expo start
```

### 6. Access

| App        | URL                          |
|-----------|-------------------------------|
| Web store | http://localhost:3000         |
| Admin     | http://localhost:3001 (or admin port) |
| Backend   | http://localhost:5001/api     |
| Mobile    | Expo Go / simulator           |

## 📁 Project Structure

```
sherpamomo/
├── frontend/           # Next.js customer store (cart, checkout, orders, profile)
│   ├── app/            # App Router pages
│   ├── components/     # UI components
│   ├── contexts/       # Auth, Cart
│   └── lib/            # API client, Firebase
├── backend/            # Express API
│   ├── src/
│   │   ├── config/     # DB config
│   │   ├── middleware/ # Auth
│   │   ├── models/     # User, Order, Product, PhoneVerification, MobileAuthCode
│   │   ├── routes/     # auth, orders, products, users
│   │   └── utils/      # JWT, SMS, auth helpers
│   └── .env
├── admin/              # Next.js admin (orders, products, users)
│   └── src/
├── mobile/             # Expo React Native app
│   ├── app/            # expo-router screens (tabs, signin, checkout, order, profile)
│   ├── contexts/       # Auth, Cart
│   ├── lib/            # API, theme
│   ├── app.json        # Expo config
│   ├── eas.json        # EAS Build/Submit config
│   └── docs/           # EAS_SETUP.md, etc.
└── README.md
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/phone/request` – Request OTP (body: `{ phone }`)
- `POST /api/auth/phone/verify` – Verify OTP and get JWT (body: `{ phone, code }`)
- `POST /api/auth/mobile-code` – One-time code for mobile Google sign-in (body: `{ firebaseUid, email?, name?, redirect_uri }`)
- `POST /api/auth/mobile/callback` – Exchange code for JWT (body: `{ code }`)
- `GET /api/auth/status` – Auth status

### Products
- `GET /api/products` – List (pagination/filter)
- `GET /api/products/:id` – Single product
- `GET /api/products/featured` – Featured products
- `GET /api/products/categories` – Categories
- `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` – Admin

### Orders
- `POST /api/orders` – Create order (auth)
- `GET /api/orders/:orderId` – Get order
- `GET /api/orders/user/orders` – Current user’s orders (auth)
- `PUT /api/orders/:orderId/cancel` – Cancel order (auth)
- `GET /api/orders`, `PUT /api/orders/:orderId/status` – Admin

### Users
- `GET /api/users/me` – Current user profile (auth)
- `PUT /api/users/profile` – Update profile (auth)
- `GET /api/users/stats`, `GET /api/users`, etc. – Admin

### Health
- `GET /api/health` – Health check

## 🎯 Key Flows

### Web
- Browse products → Cart → Checkout (profile/delivery from backend or localStorage) → Order confirmation
- Sign in with Google (Firebase); profile and address stored/loaded from backend

### Mobile
- Sign in: **phone OTP** (test: `+14167258527` / `123456`) or **Sign in with Google** (in-app browser → web sign-in → redirect back with code)
- Menu (products from API) → Cart (header) → Checkout (cash on delivery) → Order placed
- Orders tab → order list → order detail (status timeline, cancel if pending/packaging)
- Profile: edit name/phone/address (saved to backend), notifications, help, Terms/Privacy links

### Admin
- Orders, products, users management; auth as needed

## 🚀 Deployment

| App     | Suggested platform | Notes |
|---------|--------------------|--------|
| Frontend | Vercel             | `npm run build`; set `NEXT_PUBLIC_API_URL` and Firebase env |
| Backend  | Railway, Render, Fly.io | Set `MONGODB_URI`, `JWT_SECRET`, optional Twilio |
| Admin    | Vercel             | Point API to production backend |
| Mobile   | EAS Build          | `cd mobile` then `eas build --profile production`; see [mobile/docs/EAS_SETUP.md](mobile/docs/EAS_SETUP.md) |

### Mobile (EAS)

```bash
cd mobile
eas login
eas init
eas build --profile preview --platform android   # internal APK
eas build --profile production --platform all    # store builds
```

Environment variables for mobile builds: set `EXPO_PUBLIC_API_URL` and `EXPO_PUBLIC_WEB_URL` (e.g. in EAS Secrets or `eas.json` env).

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Product imagery from Unsplash/Pexels
- UI: shadcn/ui, Lucide React
- Inspired by traditional Himalayan cuisine
