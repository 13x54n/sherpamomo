import express, { Request, Response } from 'express';
import PhoneVerification from '../models/PhoneVerification';
import User from '../models/User';
import {
  generateVerificationCode,
  hashVerificationCode,
  normalizeCanadianPhone,
  signAuthToken
} from '../utils/auth';

const router = express.Router();

const CODE_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;

// POST /api/auth/phone/request - send verification code
router.post('/phone/request', async (req: Request, res: Response) => {
  try {
    const rawPhone = String(req.body?.phone || '');
    const phone = normalizeCanadianPhone(rawPhone);

    if (!phone) {
      return res.status(400).json({
        message: 'Invalid phone number',
        error: 'Only Canadian phone numbers are supported'
      });
    }

    const existing = await PhoneVerification.findOne({ phone });
    if (existing && existing.requestedAt.getTime() > Date.now() - RESEND_COOLDOWN_MS) {
      return res.status(429).json({
        message: 'Please wait before requesting another code'
      });
    }

    const code = generateVerificationCode();
    const codeHash = hashVerificationCode(code);
    const expiresAt = new Date(Date.now() + CODE_TTL_MS);

    await PhoneVerification.findOneAndUpdate(
      { phone },
      {
        $set: {
          phone,
          codeHash,
          expiresAt,
          attempts: 0,
          requestedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    // TODO: Integrate SMS provider (Twilio, MessageBird, etc.)
    console.log(`📲 Verification code for ${phone}: ${code}`);

    const response: any = {
      message: 'Verification code sent',
      expiresIn: Math.floor(CODE_TTL_MS / 1000)
    };

    if (process.env.NODE_ENV !== 'production') {
      response.devCode = code;
    }

    res.json(response);
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/phone/verify - verify code and issue token
router.post('/phone/verify', async (req: Request, res: Response) => {
  try {
    const rawPhone = String(req.body?.phone || '');
    const code = String(req.body?.code || '').trim();
    const phone = normalizeCanadianPhone(rawPhone);

    if (!phone || code.length !== 6) {
      return res.status(400).json({
        message: 'Invalid verification request'
      });
    }

    const verification = await PhoneVerification.findOne({ phone });
    if (!verification) {
      return res.status(400).json({ message: 'Verification code expired or not found' });
    }

    if (verification.expiresAt.getTime() < Date.now()) {
      await PhoneVerification.deleteOne({ phone });
      return res.status(400).json({ message: 'Verification code expired' });
    }

    if (verification.attempts >= MAX_ATTEMPTS) {
      await PhoneVerification.deleteOne({ phone });
      return res.status(429).json({ message: 'Too many attempts. Request a new code.' });
    }

    const codeHash = hashVerificationCode(code);
    if (verification.codeHash !== codeHash) {
      verification.attempts += 1;
      await verification.save();
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    await PhoneVerification.deleteOne({ phone });

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({
        phone,
        authProvider: 'phone'
      });
      await user.save();
    }

    const token = signAuthToken(user._id.toString());

    res.json({
      message: 'Phone verified',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
