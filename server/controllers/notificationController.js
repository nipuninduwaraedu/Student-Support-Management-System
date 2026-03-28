const Notification = require('../models/Notification');

// @desc    Get logged in user's notifications
// @route   GET /api/notifications
// @access  Private (Student)
const getNotifications = async (req, res) => {
  try {
    // req.user contains the authenticated student
    if(req.user.role !== 'Student') {
      return res.status(400).json({ message: 'Only students have notifications right now' });
    }
    const notifications = await Notification.find({ studentId: req.user.studentId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if(notification) {
      notification.isRead = true;
      await notification.save();
      res.json(notification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotifications, markAsRead };
