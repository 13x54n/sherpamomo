#!/bin/bash

echo "🚀 Sherpa Momo - Full Stack Setup Script"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. You have $(node -v)."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
if npm install; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd ../backend
if npm install; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Build backend
echo "🔨 Building backend..."
if npm run build; then
    echo "✅ Backend built successfully"
else
    echo "❌ Failed to build backend"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up MongoDB Atlas (see MONGODB_SETUP.md in backend/)"
echo "2. Update MONGODB_URI in backend/.env"
echo "3. Run 'npm run seed' in backend/ to populate database"
echo "4. Start servers:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Access your app:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5001/api"