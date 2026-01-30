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
    index: true,
    default: undefined,
    set: (v: string | null | undefined) => (v == null || v === '' ? undefined : v),
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

// Avoid storing firebaseUid: null so sparse unique index allows multiple phone-only users (no firebaseUid).
// If you still see E11000 dup key: { firebaseUid: null }, run once in MongoDB:
//   db.users.updateMany({ firebaseUid: null }, { $unset: { firebaseUid: "" } })
//   db.users.dropIndex("firebaseUid_1")  // Mongoose will recreate it on next start
UserSchema.pre('save', function () {
  if (this.firebaseUid == null || this.firebaseUid === '') {
    this.firebaseUid = undefined;
  }
});

// Index for faster lookups (email already indexed by unique constraint)
UserSchema.index({ createdAt: -1 });

export default mongoose.model<IUser>('User', UserSchema);