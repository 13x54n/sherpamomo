import crypto from 'crypto';
import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import MobileAuthCode from '../models/MobileAuthCode';
import PhoneVerification from '../models/PhoneVerification';
import User from '../models/User';
import {
  generateVerificationCode,
  hashVerificationCode,
  normalizeCanadianPhone,
  signAuthToken
} from '../utils/auth';

const router = express.Router();

// Allowed redirect URIs for mobile Google sign-in (browser → app)
const ALLOWED_REDIRECT_SCHEMES = ['sherpamomo://', 'exp://'];
function isAllowedRedirectUri(uri: string): boolean {
  if (!uri || typeof uri !== 'string') return false;
  const trimmed = uri.trim().toLowerCase();
  return ALLOWED_REDIRECT_SCHEMES.some((scheme) => trimmed.startsWith(scheme));
}

// Test credentials for development/testing
// Use 555-0100 to 555-0199 (reserved for testing)
const TEST_PHONE = '+14167258527';
const TEST_CODE = '123456';

// Rate limiters
const requestLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 3,
  message: { message: 'Too many requests. Please wait a minute.' }
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  message: { message: 'Too many verification attempts. Please wait.' }
});

// POST /api/auth/phone/request - Request verification code
router.post('/phone/request', requestLimiter, async (req: Request, res: Response) => {
  try {
    const { phone: rawPhone } = req.body;

    if (!rawPhone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const phone = normalizeCanadianPhone(rawPhone);
    if (!phone) {
      return res.status(400).json({ message: 'Invalid Canadian phone number' });
    }

    // Handle test phone number - skip verification storage
    if (phone === TEST_PHONE) {
      console.log(`📲 Test phone detected. Use code: ${TEST_CODE}`);
      return res.json({
        message: 'Verification code sent',
        devCode: TEST_CODE
      });
    }

    // Delete any existing verification for this phone
    await PhoneVerification.deleteMany({ phone });

    // Generate and hash the code
    const code = generateVerificationCode();
    const codeHash = hashVerificationCode(code);

    // Store the verification
    const verification = new PhoneVerification({
      phone,
      codeHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      requestedAt: new Date()
    });
    await verification.save();

    // In development, log and return the code
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
      console.log(`📲 Verification code for ${phone}: ${code}`);
    }

    // TODO: In production, send SMS via Twilio or other provider
    // await sendSMS(phone, `Your Sherpa Momo code is ${code}`);

    res.json({
      message: 'Verification code sent',
      ...(isDev && { devCode: code }) // Only include in development
    });

  } catch (error) {
    console.error('Phone request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/phone/verify - Verify code and sign in
router.post('/phone/verify', verifyLimiter, async (req: Request, res: Response) => {
  try {
    const { phone: rawPhone, code } = req.body;

    if (!rawPhone || !code) {
      return res.status(400).json({ message: 'Phone and code are required' });
    }

    const phone = normalizeCanadianPhone(rawPhone);
    if (!phone) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // Handle test phone number - bypass verification lookup
    if (phone === TEST_PHONE) {
      if (code !== TEST_CODE) {
        return res.status(400).json({ message: 'Invalid code' });
      }
      // Test phone verified, skip to user creation below
    } else {
      // Find the verification record
      const verification = await PhoneVerification.findOne({
        phone,
        expiresAt: { $gt: new Date() }
      });

      if (!verification) {
        return res.status(400).json({ message: 'Code expired or not found. Request a new code.' });
      }

      // Check attempts
      if (verification.attempts >= 5) {
        await PhoneVerification.deleteOne({ _id: verification._id });
        return res.status(400).json({ message: 'Too many attempts. Request a new code.' });
      }

      // Verify the code
      const codeHash = hashVerificationCode(code);
      if (codeHash !== verification.codeHash) {
        verification.attempts += 1;
        await verification.save();
        return res.status(400).json({ message: 'Invalid code' });
      }

      // Code is valid - delete verification record
      await PhoneVerification.deleteOne({ _id: verification._id });
    }

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({
        phone,
        authProvider: 'phone'
      });
      await user.save();
      console.log('👤 New user created:', user._id);
    }

    // Sign JWT
    const token = signAuthToken(user._id.toString());

    res.json({
      message: 'Verified successfully',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Phone verify error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/mobile-code - Create one-time code for mobile app (called by web after Google sign-in)
// Body: { firebaseUid, email?, name?, redirect_uri }. redirect_uri must be sherpamomo:// or exp://
const mobileCodeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: { message: 'Too many requests.' }
});

router.post('/mobile-code', mobileCodeLimiter, async (req: Request, res: Response) => {
  try {
    const { firebaseUid, email, name, redirect_uri: redirectUri } = req.body;

    if (!firebaseUid || typeof firebaseUid !== 'string') {
      return res.status(400).json({ message: 'firebaseUid is required' });
    }
    if (!isAllowedRedirectUri(redirectUri)) {
      return res.status(400).json({
        message: 'redirect_uri is required and must start with sherpamomo:// or exp://'
      });
    }

    let user = await User.findOne({ firebaseUid });
    if (!user) {
      user = new User({
        firebaseUid,
        email: email || `${firebaseUid}@firebase.local`,
        name: name || 'User',
        authProvider: 'firebase'
      });
      await user.save();
      console.log('👤 New user created (mobile Google):', user._id);
    }

    const code = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await MobileAuthCode.create({ code, userId: user._id, expiresAt });

    res.json({ code, redirect_uri: redirectUri.trim() });
  } catch (error) {
    console.error('Mobile code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/mobile/callback - Exchange one-time code for JWT (called by mobile app)
router.post('/mobile/callback', mobileCodeLimiter, async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'code is required' });
    }

    const record = await MobileAuthCode.findOne({ code }).exec();
    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
    if (record.expiresAt < new Date()) {
      await MobileAuthCode.deleteOne({ _id: record._id });
      return res.status(400).json({ message: 'Code expired' });
    }

    const user = await User.findById(record.userId);
    if (!user) {
      await MobileAuthCode.deleteOne({ _id: record._id });
      return res.status(400).json({ message: 'User not found' });
    }

    await MobileAuthCode.deleteOne({ _id: record._id });

    const token = signAuthToken(user._id.toString());

    res.json({
      message: 'Signed in successfully',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Mobile callback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/status - Check auth status
router.get('/status', (req: Request, res: Response) => {
  res.json({
    authMethod: 'phone-jwt',
    configured: true
  });
});

export default router;
