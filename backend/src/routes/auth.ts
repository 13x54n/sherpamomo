import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import PhoneVerification from '../models/PhoneVerification';
import User from '../models/User';
import {
  generateVerificationCode,
  hashVerificationCode,
  normalizeCanadianPhone,
  signAuthToken
} from '../utils/auth';

const router = express.Router();

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

// GET /api/auth/status - Check auth status
router.get('/status', (req: Request, res: Response) => {
  res.json({
    authMethod: 'phone-jwt',
    configured: true
  });
});

export default router;
