# Sherpa Momo - Full Stack E-commerce Platform

A modern, full-stack e-commerce platform for authentic Himalayan cuisine, built with React, Next.js, Node.js, Express, and MongoDB Atlas.

## 🚀 Features

- **🛒 Dynamic Shopping Cart** - Add, remove, and update cart items with real-time calculations
- **📱 Responsive Design** - Beautiful UI that works on all devices
- **🎨 Modern UI/UX** - Built with Tailwind CSS and shadcn/ui components
- **⚡ Real-time Updates** - Toast notifications and loading states
- **🗄️ MongoDB Integration** - Full database persistence with Atlas
- **🔒 Type Safety** - Complete TypeScript implementation
- **📡 RESTful API** - Clean backend API with proper error handling

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Sonner** - Toast notifications
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **TypeScript** - Type-safe backend

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free tier available)

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string from 'Connect' > 'Connect your application'
5. Update the `.env` file in the backend directory:

```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/sherpamomo?retryWrites=true&w=majority
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This will populate your MongoDB database with all the product data from the frontend.

### 4. Start the Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api

## 📁 Project Structure

```
sherpamomo/
├── frontend/                 # Next.js frontend
│   ├── app/                 # App router pages
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Cart)
│   ├── lib/               # Utilities and API clients
│   └── types/             # TypeScript type definitions
├── backend/                # Express.js backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   └── scripts/       # Database seeding scripts
│   └── .env               # Environment variables
└── README.md
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products (with filtering/pagination)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get product categories
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Get order by ID
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:orderId/status` - Update order status (admin)

### Health
- `GET /api/health` - API health check

## 🎯 Key Features Explained

### Shopping Cart System
- Persistent cart using localStorage and server state
- Real-time price calculations and item counts
- Toast notifications for all cart actions
- Loading animations during add-to-cart operations

### Product Management
- Dynamic product fetching from MongoDB
- Category filtering and search functionality
- Featured products highlighting
- Responsive product grid layout

### Order Processing
- Complete order creation with customer details
- Automatic order ID generation
- Order status tracking
- Email and payment integration ready

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Railway, Render, or Heroku)
```bash
cd backend
npm run build
npm start
# Deploy to your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Product images from Unsplash and Pexels
- UI components from shadcn/ui
- Icons from Lucide React
- Inspired by traditional Himalayan cuisine