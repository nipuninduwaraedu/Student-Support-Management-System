const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
} = require('../controllers/complaintController');

router.route('/')
  .post(upload.single('file'), createComplaint)
  .get(getComplaints);

router.route('/:id')
  .get(getComplaintById);

router.route('/:id/status')
  .put(updateComplaintStatus);

module.exports = router;
