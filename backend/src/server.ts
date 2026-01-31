import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import os from 'os';
import connectDB from './config/database';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import otaRoutes from './routes/ota';
import { authenticateUser } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const isProduction = process.env.NODE_ENV === 'production';

// Connect to MongoDB
connectDB();

// Middleware
app.disable('x-powered-by');
app.set('trust proxy', isProduction ? 1 : 0);

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (!isProduction) return callback(null, true);
    
    // In production, check against allowed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(hpp());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Sherpa Momo API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', authenticateUser, userRoutes);

// OTA iOS install: install page + manifest; IPA files from public/
const publicDir = path.join(__dirname, '..', 'public');
app.use('/ipainstall/public', express.static(publicDir, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.ipa')) {
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment',
        'Cache-Control': 'public, max-age=86400'
      });
    }
  }
}));
app.use('/ipainstall', otaRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: !isProduction ? err.message : undefined
  });
});

// Get local IP address
function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

app.listen(PORT, () => {
  const localIP = getLocalIP();
  const ipaFilename = process.env.IPA_FILENAME || 'SherpaMoMo.ipa';
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Local:   http://localhost:${PORT}`);
  console.log(`📡 Network: http://${localIP}:${PORT}`);
  console.log(`📱 OTA install: http://${localIP}:${PORT}/ipainstall (put ${ipaFilename} in backend/public/)`);
});
