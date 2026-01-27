import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firebaseUid?: string;
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
  role?: 'user' | 'admin';
  authProvider?: 'firebase' | 'phone';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  address: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  authProvider: {
    type: String,
    enum: ['firebase', 'phone'],
    default: 'firebase'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster lookups (email already indexed by unique constraint)
UserSchema.index({ createdAt: -1 });

export default mongoose.model<IUser>('User', UserSchema);