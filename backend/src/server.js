import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

// Load environment variables early so imported modules see process.env
dotenv.config();

// Import routes dynamically after env is loaded so route modules (and any
// model managers they import) can read environment variables during their
// top-level initialization. Using dynamic import with top-level await.
let authRoutes, projectRoutes, aiRoutes, aiModelsRoutes, deploymentRoutes, dashboardRoutes, debugRoutes, reasoningRoutes;
try {
  authRoutes = (await import('./routes/auth.js')).default;
  projectRoutes = (await import('./routes/projects.js')).default;
  aiRoutes = (await import('./routes/ai.js')).default;
  aiModelsRoutes = (await import('./routes/aiModels.js')).default;
  deploymentRoutes = (await import('./routes/deployment.js')).default;
  dashboardRoutes = (await import('./routes/dashboard.js')).default;
  debugRoutes = (await import('./routes/debug.js')).default;
  reasoningRoutes = (await import('./routes/reasoning.js')).default;
} catch (e) {
  console.error('Failed to import route modules after loading env:', e && e.message ? e.message : e);
  // Exit early so startup doesn't continue in a half-broken state
  process.exit(1);
}

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ==================== MIDDLEWARE ====================

// Security Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// ==================== ROUTES ====================

// API Version 1
const apiV1 = express.Router();

// Authentication Routes
apiV1.use('/auth', authRoutes);

// Project Management Routes
apiV1.use('/projects', projectRoutes);

// AI Generation Routes
apiV1.use('/ai', aiRoutes);

// Multi-Model AI Routes (ChatGPT, Gemini, Claude)
apiV1.use('/ai-models', aiModelsRoutes);

// Reasoning & Advanced Logic Routes
apiV1.use('/reasoning', reasoningRoutes);

// Deployment Routes
apiV1.use('/deployment', deploymentRoutes);

// Dashboard & Analytics Routes
apiV1.use('/dashboard', dashboardRoutes);

// Health Check
apiV1.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Serve API docs if swagger spec exists
try {
  const swaggerPath = path.join(__dirname, '..', 'swagger.json');
  if (fs.existsSync(swaggerPath)) {
    const swaggerSpec = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
    apiV1.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }
} catch (e) {
  console.warn('Swagger UI not available:', e.message);
}

// Mount API routes
// Mount debug routes only in non-production (dev helper)
const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV !== 'production') {
  apiV1.use('/debug', debugRoutes);
}

app.use('/api/v1', apiV1);

// ==================== ERROR HANDLING ====================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==================== SERVER STARTUP ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════╗
    ║   AI BUILDER PLATFORM - BACKEND API    ║
    ╚════════════════════════════════════════╝
    
    📡 Server running on port: ${PORT}
    🌍 Environment: ${NODE_ENV}
    🔗 URL: http://localhost:${PORT}
    📚 API Docs: http://localhost:${PORT}/api/v1/docs
    
    ✅ Ready to accept requests!
  `);
});

export default app;
app.get('/', (req, res) => {
  return res.redirect('/api/v1');
});
