import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(400).json({
        message: "Only students have notifications right now",
      });
    }
    const sids = [req.user.studentId, req.user.email].filter(Boolean);
    const notifications = await Notification.find({
      studentId: { $in: sids },
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      notification.isRead = true;
      await notification.save();
      res.json(notification);
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
