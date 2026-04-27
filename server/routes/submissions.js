import express from "express";
import Submission from "../models/Submission.js";
import { auth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/assignment/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }
    const submissions = await Submission.find({
      assignment: req.params.id,
    }).populate("student", "name email");
    res.json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id }).populate(
      "assignment",
      "title deadline module"
    );
    res.json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/", [auth, upload.single("pdf")], async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const pdfUrl = req.file ? `/uploads/${req.file.filename}` : "";

    if (!pdfUrl) {
      return res.status(400).json({ msg: "PDF file is required" });
    }

    let submission = await Submission.findOne({
      assignment: assignmentId,
      student: req.user.id,
    });
    if (submission) {
      submission.pdfUrl = pdfUrl;
      submission.status = "submitted";
      await submission.save();
      return res.json(submission);
    }

    const newSubmission = new Submission({
      assignment: assignmentId,
      student: req.user.id,
      pdfUrl,
    });
    submission = await newSubmission.save();
    res.json(submission);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

export default router;
