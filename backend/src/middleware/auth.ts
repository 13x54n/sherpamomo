import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { verifyAuthToken } from '../utils/auth';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware to authenticate users via JWT
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    // Extract Bearer token
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;

    // Also check legacy Firebase headers for web frontend compatibility
    const legacyFirebaseUid = req.headers['x-firebase-uid'] as string;

    if (token) {
      try {
        const decoded = verifyAuthToken(token);
        const user = await User.findById(decoded.sub);
        if (!user) {
          return res.status(401).json({
            message: 'Authentication required',
            error: 'User not found'
          });
        }
        req.user = user;
        return next();
      } catch (error) {
        return res.status(401).json({
          message: 'Authentication required',
          error: 'Invalid token'
        });
      }
    }

    // Legacy header-based auth (for web frontend with Firebase)
    if (legacyFirebaseUid) {
      const email = req.headers['x-user-email'] as string;
      const name = req.headers['x-user-name'] as string;

      let user = await User.findOne({ firebaseUid: legacyFirebaseUid });

      if (!user) {
        user = new User({
          firebaseUid: legacyFirebaseUid,
          email: email || `${legacyFirebaseUid}@firebase.local`,
          name: name || 'User',
          authProvider: 'firebase'
        });
        await user.save();
      }

      req.user = user;
      return next();
    }

    // Development mode: allow requests without auth
    if (isDevelopment) {
      console.warn('⚠️ Dev mode: No auth provided');
      return next();
    }

    return res.status(401).json({
      message: 'Authentication required',
      error: 'No valid token provided'
    });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      message: 'Authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Optional authentication
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
    const legacyFirebaseUid = req.headers['x-firebase-uid'] as string;

    if (token) {
      try {
        const decoded = verifyAuthToken(token);
        const user = await User.findById(decoded.sub);
        if (user) req.user = user;
      } catch {
        // Ignore invalid tokens for optional auth
      }
    } else if (legacyFirebaseUid) {
      const user = await User.findOne({ firebaseUid: legacyFirebaseUid });
      if (user) req.user = user;
    }

    next();
  } catch (error) {
    next();
  }
};

// Admin access middleware
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
    const legacyFirebaseUid = req.headers['x-firebase-uid'] as string;

    let user = null;

    if (token) {
      try {
        const decoded = verifyAuthToken(token);
        user = await User.findById(decoded.sub);
      } catch {
        return res.status(401).json({
          message: 'Admin access requires authentication',
          error: 'Invalid token'
        });
      }
    } else if (legacyFirebaseUid) {
      const email = req.headers['x-user-email'] as string;
      const name = req.headers['x-user-name'] as string;

      user = await User.findOne({ firebaseUid: legacyFirebaseUid });

      if (!user) {
        user = new User({
          firebaseUid: legacyFirebaseUid,
          email: email || `${legacyFirebaseUid}@firebase.local`,
          name: name || 'User',
          role: 'user',
          authProvider: 'firebase'
        });
        await user.save();
      }
    }

    if (!user) {
      return res.status(401).json({
        message: 'Admin access requires authentication'
      });
    }

    // Check admin role
    if (user.role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 0) {
        user.role = 'admin';
        await user.save();
        console.log(`👑 Auto-promoted first user to admin: ${user._id}`);
      } else if (!isDevelopment) {
        return res.status(403).json({
          message: 'Admin access denied'
        });
      } else {
        console.warn(`⚠️ Dev mode: Non-admin accessing admin route`);
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ message: 'Admin auth failed' });
  }
};
