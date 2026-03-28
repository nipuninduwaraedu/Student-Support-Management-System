const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

// @desc    Create a new complaint/feedback
// @route   POST /api/complaints
// @access  Public (in a real app might be private, but instructions imply student submission)
const createComplaint = async (req, res) => {
  try {
    const { studentName, studentId, email, type, category, message } = req.body;
    let fileUrl = null;

    if (req.file) {
      fileUrl = `uploads/${req.file.filename}`;
    }

    const complaint = new Complaint({
      studentName,
      studentId,
      email,
      type,
      category,
      message,
      fileUrl,
    });

    const createdComplaint = await complaint.save();
    res.status(201).json(createdComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Public (Admin in real app)
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Public
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (complaint) {
      res.json(complaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Public (Admin in real app)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      complaint.status = status;
      const updatedComplaint = await complaint.save();

      // Create a notification for the student
      if (complaint.studentId) {
        await Notification.create({
          studentId: complaint.studentId,
          message: `Your recent ${complaint.type} has been updated to: ${status}`,
          complaintId: complaint._id
        });
      }

      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
};
