import mongoose, { Document, Schema } from 'mongoose';

export interface IMobileAuthCode extends Document {
  code: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

const MobileAuthCodeSchema = new Schema<IMobileAuthCode>(
  {
    code: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

MobileAuthCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index: remove doc when expiresAt passes
MobileAuthCodeSchema.index({ code: 1 });

export default mongoose.model<IMobileAuthCode>('MobileAuthCode', MobileAuthCodeSchema);
