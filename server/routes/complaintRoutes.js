import express from "express";
import upload from "../middleware/upload.js";
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
} from "../controllers/complaintController.js";

const router = express.Router();

router
  .route("/")
  .post(upload.single("file"), createComplaint)
  .get(getComplaints);

router.route("/:id").get(getComplaintById);

router.route("/:id/status").put(updateComplaintStatus);

export default router;
