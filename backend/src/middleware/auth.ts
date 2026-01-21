import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

/**
 * AUTHENTICATION SETUP FOR PRODUCTION
 *
 * Current Setup:
 * - Development: Allows requests without Firebase auth (with warnings)
 * - Admin routes: No authentication required (development mode)
 *
 * Production Requirements:
 * 1. Set NODE_ENV=production
 * 2. Implement Firebase ID token verification
 * 3. Add admin authentication (API keys, IP whitelist, etc.)
 * 4. Configure Firebase Admin SDK for token verification
 *
 * Example Firebase token verification:
 * ```typescript
 * import * as admin from 'firebase-admin';
 *
 * const verifyFirebaseToken = async (token: string) => {
 *   try {
 *     const decodedToken = await admin.auth().verifyIdToken(token);
 *     return decodedToken;
 *   } catch (error) {
 *     throw new Error('Invalid Firebase token');
 *   }
 * };
 * ```
 */

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
    const isDevelopment = process.env.NODE_ENV !== 'production';

    // Extract Firebase authentication data
    let firebaseUid = req.headers['x-firebase-uid'] as string;
    let email = req.headers['x-user-email'] as string;
    let name = req.headers['x-user-name'] as string;

    // If not in headers, check body (for API calls that include user info)
    if (!firebaseUid && req.body && req.body.firebaseUid) {
      firebaseUid = req.body.firebaseUid;
      email = req.body.email || req.body.userEmail;
      name = req.body.name || req.body.userName;
    }

    // In production, require Firebase authentication
    if (!isDevelopment && !firebaseUid) {
      return res.status(401).json({
        message: 'Authentication required',
        error: 'Firebase authentication headers missing'
      });
    }

    // In development, allow requests but log warnings
    if (isDevelopment && !firebaseUid) {
      console.warn('⚠️ Development mode: No Firebase UID provided - allowing request');
      console.warn('   Consider implementing proper authentication for production');
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
    res.status(401).json({
      message: 'Authentication failed',
      error: error instanceof Error ? error.message : 'Unknown authentication error'
    });
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

// Admin access middleware - requires Firebase authentication and admin role
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    // Extract Firebase authentication data
    let firebaseUid = req.headers['x-firebase-uid'] as string;
    let email = req.headers['x-user-email'] as string;
    let name = req.headers['x-user-name'] as string;

    // If not in headers, check body (for API calls that include user info)
    if (!firebaseUid && req.body && req.body.firebaseUid) {
      firebaseUid = req.body.firebaseUid;
      email = req.body.email || req.body.userEmail;
      name = req.body.name || req.body.userName;
    }

    // Require authentication for admin routes
    if (!firebaseUid) {
      return res.status(401).json({
        message: 'Admin access requires authentication',
        error: 'Firebase authentication headers missing'
      });
    }

    // Find user in database
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // Create user if they don't exist (for first-time admins)
      user = new User({
        firebaseUid,
        email: email || `${firebaseUid}@firebase.local`,
        name: name || 'Firebase User',
        role: 'user' // Default to user, admin promotion needed
      });
      await user.save();
      console.log('👤 Created new user for admin access:', user._id);
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      // Auto-promote first user to admin for easy setup
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 0) {
        // First user accessing admin routes becomes admin
        user.role = 'admin';
        await user.save();
        console.log(`👑 Auto-promoted first user ${user.email} to admin role`);
      } else {
        // In development, allow access but log warning
        if (isDevelopment) {
          console.warn(`⚠️ Development mode: User ${user.email} accessing admin routes without admin role`);
          console.warn('   Consider promoting user to admin role for production');
        } else {
          return res.status(403).json({
            message: 'Admin access denied',
            error: 'Insufficient permissions - admin role required'
          });
        }
      }
    }

    // Attach authenticated user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    res.status(500).json({
      message: 'Admin authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};