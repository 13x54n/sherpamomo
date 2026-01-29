import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const OTP_SECRET = process.env.OTP_SECRET || 'dev-otp-secret';

// Normalize Canadian phone numbers to E.164 format
export const normalizeCanadianPhone = (rawPhone: string): string | null => {
  if (!rawPhone) return null;

  // Remove all non-digit characters
  const digits = rawPhone.replace(/\D/g, '');

  // Canadian numbers: 10 digits or 11 digits starting with 1
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  return null;
};

// Generate a 6-digit verification code
export const generateVerificationCode = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

// Hash the verification code for storage
export const hashVerificationCode = (code: string): string => {
  return crypto.createHmac('sha256', OTP_SECRET).update(code).digest('hex');
};

// Sign a JWT for authenticated users
export const signAuthToken = (userId: string): string => {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify a JWT and return the payload
export const verifyAuthToken = (token: string): { sub: string } => {
  return jwt.verify(token, JWT_SECRET) as { sub: string };
};
