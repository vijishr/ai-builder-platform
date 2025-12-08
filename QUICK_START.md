# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 16+
- npm or yarn
- Git

### Option 1: Using npm (Easiest)

```bash
# Clone the repository
git clone <repository-url>
cd ai-builder-platform

# Install all dependencies
npm run setup

# Setup environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Start development servers
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

### Option 2: Using Docker

```bash
# Make sure Docker is installed and running

# Build and start all services
docker-compose up -d

# Check services are running
docker-compose ps
```

Frontend: http://localhost:3000
Backend: http://localhost:5000
MongoDB: localhost:27017
Redis: localhost:6379

### Option 3: Manual Setup

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

#### Frontend Setup (New Terminal)
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

---

## 📝 First Time Setup

### 1. Create Account
- Go to http://localhost:3000/signup
- Fill in your details
- You'll receive an OTP email (check console in dev mode)

### 2. Verify Email
- Enter the OTP (default: 123456)
- You'll be logged in

### 3. Create First Project
- Click "Create New Project"
- Enter project name and idea
- Select style and color theme
- Click "Generate with AI"

### 4. Edit & Publish
- Use the drag-and-drop editor to customize
- Click "Preview" to see changes
- Click "Publish" to deploy

---

## 📚 Project Structure

```
ai-builder-platform/
├── frontend/                 # React/Next.js frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API calls
│   │   ├── styles/          # CSS/Tailwind
│   │   └── utils/           # Helper functions
│   └── package.json
│
├── backend/                  # Node.js/Express backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   ├── server.js
│   └── package.json
│
├── docs/                     # Documentation
│   ├── API.md
│   ├── DATABASE.md
│   ├── SECURITY.md
│   └── DEPLOYMENT.md
│
└── README.md
```

---

## 🔑 Key Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/verify-email` - Verify email with OTP
- `POST /api/v1/auth/refresh-token` - Refresh access token

### Projects
- `GET /api/v1/projects` - Get all projects
- `POST /api/v1/projects` - Create new project
- `GET /api/v1/projects/:id` - Get project details
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

### AI Generation
- `POST /api/v1/ai/generate-website` - Generate website layout
- `POST /api/v1/ai/generate-code` - Generate source code
- `POST /api/v1/ai/generate-logo` - Generate logo

### Deployment
- `POST /api/v1/deployment/publish` - Publish project
- `GET /api/v1/deployment/:deploymentId/status` - Get deployment status
- `POST /api/v1/deployment/export-code` - Export source code

### Dashboard
- `GET /api/v1/dashboard/stats` - Get statistics
- `GET /api/v1/dashboard/analytics` - Get analytics data
- `GET /api/v1/dashboard/form-submissions` - Get form submissions

See `docs/API.md` for complete API documentation.

---

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend    # Start only frontend
npm run dev:backend     # Start only backend

# Building
npm run build           # Build both frontend and backend
npm run build:frontend # Build only frontend
npm run build:backend  # Build only backend

# Testing
npm test               # Run all tests
npm run test:frontend # Test frontend
npm run test:backend  # Test backend

# Linting
npm run lint          # Lint all code
npm run lint:fix      # Fix linting issues

# Production
npm start             # Start production build
npm run start:backend # Start backend only
```

---

## 🔧 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-builder
JWT_SECRET=your_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

See `.env.example` files for all options.

---

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy build folder to Vercel/Netlify
```

### Backend Deployment
```bash
cd backend
npm run build
# Deploy to Heroku/AWS/DigitalOcean
```

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

---

## 📖 Documentation

- **API Documentation**: `docs/API.md`
- **Database Schema**: `docs/DATABASE.md`
- **Security Guide**: `docs/SECURITY.md`
- **Deployment Guide**: `docs/DEPLOYMENT.md`
- **Contributing Guide**: `CONTRIBUTING.md`

---

## 🆘 Troubleshooting

### Port already in use
```bash
# Change port in .env
PORT=5001  # Use different port
```

### MongoDB connection error
```bash
# Make sure MongoDB is running
# Or use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-builder
```

### Nodemailer email errors
```bash
# Use Gmail App Password (not your password)
# Enable 2FA and generate app-specific password
```

### CORS errors
```bash
# Update FRONTEND_URL in backend/.env
FRONTEND_URL=http://localhost:3000
```

---

## 🤝 Support

- 📧 Email: support@aibuilder.com
- 💬 Discord: [Discord Server Link]
- 📚 Docs: https://docs.aibuilder.com
- 🐛 Issues: GitHub Issues

---

## 📄 License

Proprietary - See LICENSE file

---

**Ready to build amazing projects?** 🎉

Start with the signup page and follow the guided onboarding flow!
