import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Placement Alert', 'Assessment', 'Workshop', 'General', 'Deadline'],
      default: 'Placement Alert',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Normal'],
      default: 'Medium',
    },
    targetBranches: {
      type: [String],
      default: ['All'],
    },
    postedBy: {
      type: String,
      default: 'Training & Placement Officer',
    },
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.model('Notice', noticeSchema);
export default Notice;
