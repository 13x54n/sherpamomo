import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const OTP_SECRET = process.env.OTP_SECRET || 'dev-otp-secret';

export const normalizeCanadianPhone = (rawPhone: string): string | null => {
  if (!rawPhone) return null;
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  return null;
};

export const generateVerificationCode = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const hashVerificationCode = (code: string): string => {
  return crypto.createHash('sha256').update(`${code}:${OTP_SECRET}`).digest('hex');
};

export const signAuthToken = (userId: string): string => {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyAuthToken = (token: string): { sub: string } => {
  return jwt.verify(token, JWT_SECRET) as { sub: string };
};
