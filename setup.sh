#!/bin/bash

# AI Builder Platform - Setup Script

echo "🚀 AI Builder Platform - Setup Script"
echo "===================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+."
    exit 1
fi

echo "✅ Node.js $(node -v)"

# Install root dependencies
echo ""
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create env files if they don't exist
echo ""
echo "🔧 Setting up environment files..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env (update with your values)"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.example frontend/.env.local
    echo "✅ Created frontend/.env.local"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Update backend/.env with your configuration"
echo "  2. Update frontend/.env.local with API URL"
echo "  3. Start development: npm run dev"
echo ""
echo "📖 Documentation:"
echo "  - API Docs: docs/API.md"
echo "  - Database Schema: docs/DATABASE.md"
echo "  - Security: docs/SECURITY.md"
echo "  - Deployment: docs/DEPLOYMENT.md"
echo ""
