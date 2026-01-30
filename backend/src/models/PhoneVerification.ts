import mongoose, { Document, Schema } from 'mongoose';

export interface IPhoneVerification extends Document {
  phone: string;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  requestedAt: Date;
}

const PhoneVerificationSchema = new Schema<IPhoneVerification>({
  phone: { type: String, required: true, index: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: true, expires: 0 },
  attempts: { type: Number, default: 0 },
  requestedAt: { type: Date, required: true }
}, { timestamps: true });

PhoneVerificationSchema.index({ phone: 1, expiresAt: 1 });

export default mongoose.model<IPhoneVerification>('PhoneVerification', PhoneVerificationSchema);
