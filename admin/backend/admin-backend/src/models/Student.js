import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    default: 'student123!',
  },
  phone: {
    type: String,
    default: '',
    trim: true,
  },
  branch: {
    type: String,
    enum: [
      'Computer Science',
      'Computer Science (AI)',
      'Information Technology',
      'Electronics',
      'Mechanical',
      'Civil',
      'Electrical'
    ],
    required: true,
    default: 'Computer Science',
  },
  batch: {
    type: Number,
    required: true,
    default: new Date().getFullYear(),
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    default: 8.5,
  },
  leetcode: {
    type: Number,
    min: 0,
    default: 150,
  },
  readiness: {
    type: Number,
    min: 0,
    max: 100,
    default: 80,
  },
  aptitude: {
    type: Number,
    min: 0,
    max: 100,
    default: 85,
  },
  communication: {
    type: Number,
    min: 0,
    max: 100,
    default: 80,
  },
  projects: {
    type: Number,
    min: 0,
    max: 100,
    default: 80,
  },
  status: {
    type: String,
    enum: ['Placed', 'Eligible', 'Not Eligible', 'In-Progress'],
    default: 'Eligible',
  },
  isEligible: {
    type: Boolean,
    default: true,
  },
  placementStatus: {
    type: String,
    enum: ['Placed', 'In-Progress', 'Unplaced', 'Eligible', 'Not Eligible'],
    default: 'Unplaced',
  },
  companyPlaced: {
    type: String,
    default: '',
  },
  salary: {
    type: Number,
    default: 0,
  },
  profileCompletion: {
    type: Number,
    default: 85,
    min: 0,
    max: 100,
  },
}, {
  timestamps: true,
});

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

studentSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);
export default Student;
