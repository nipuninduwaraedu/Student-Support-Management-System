const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Complaint', 'Feedback'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Academic', 'Facilities', 'Administration', 'Other'],
    },
    message: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
