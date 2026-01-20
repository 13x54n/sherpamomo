import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware to authenticate Firebase users
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // For development: Extract firebaseUid from headers or body
    // In production, you'd verify Firebase ID tokens
    let firebaseUid = req.headers['x-firebase-uid'] as string;
    let email = req.headers['x-user-email'] as string;
    let name = req.headers['x-user-name'] as string;

    // If not in headers, check body (for API calls that include user info)
    if (!firebaseUid && req.body && req.body.firebaseUid) {
      firebaseUid = req.body.firebaseUid;
      email = req.body.email || req.body.userEmail;
      name = req.body.name || req.body.userName;
    }

    if (!firebaseUid) {
      // For now, allow requests without auth for development
      // In production, return 401
      console.warn('⚠️ No Firebase UID provided - allowing request for development');
      return next();
    }

    // Find or create user in database
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // Create new user record
      user = new User({
        firebaseUid,
        email: email || `${firebaseUid}@firebase.local`,
        name: name || 'Firebase User',
      });
      await user.save();
      console.log('👤 Created new user record:', user._id);
    } else if (email && user.email !== email) {
      // Update email if it changed
      user.email = email;
      await user.save();
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Optional authentication (doesn't fail if no user)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const firebaseUid = req.headers['x-firebase-uid'] as string;

    if (firebaseUid) {
      const user = await User.findOne({ firebaseUid });
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next(); // Don't fail the request
  }
};

// Admin access middleware (no authentication required for admin app)
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // For admin routes, we allow access without authentication
    // In production, you might want to add IP whitelisting or API keys instead

    // Create or get admin user for reference
    let adminUser = await User.findOne({ email: 'admin@sherpamomo.com' });

    if (!adminUser) {
      adminUser = new User({
        firebaseUid: 'admin-user-123',
        email: 'admin@sherpamomo.com',
        name: 'Admin User',
        phone: '+1234567890'
      });
      await adminUser.save();
      console.log('👑 Created admin user for admin routes');
    }

    // Attach admin user to request for consistency
    req.user = adminUser;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Admin access error' });
  }
};