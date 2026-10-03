import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin',
  },
  jobTitle: {
    type: String,
    default: 'Placement Officer',
  },
  phone: {
    type: String,
    default: '',
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  notificationPrefs: {
    emailAlerts: { type: Boolean, default: true },
    driveUpdates: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: false },
    studentApplications: { type: Boolean, default: true },
  },
  institution: {
    name: { type: String, default: 'Campus IQ University' },
    code: { type: String, default: 'CIQ-2025' },
    address: { type: String, default: '' },
    website: { type: String, default: '' },
  },
}, {
  timestamps: true,
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
