import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";

export const createComplaint = async (req, res) => {
  try {
    const { studentName, studentId, email, type, category, message } =
      req.body;
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

export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (complaint) {
      res.json(complaint);
    } else {
      res.status(404).json({ message: "Complaint not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      complaint.status = status;
      const updatedComplaint = await complaint.save();

      const notifTarget = complaint.email || complaint.studentId;
      if (notifTarget) {
        await Notification.create({
          studentId: notifTarget,
          message: `Your recent ${complaint.type} has been updated to: ${status}`,
          complaintId: complaint._id,
        });
      }

      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: "Complaint not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
