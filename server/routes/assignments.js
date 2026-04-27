import express from "express";
import Assignment from "../models/Assignment.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ deadline: 1 });
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }
    const { title, description, module, deadline } = req.body;

    const newAssignment = new Assignment({
      title,
      description,
      module,
      deadline,
    });
    const assignment = await newAssignment.save();
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ msg: "Assignment not found" });

    await assignment.deleteOne();
    res.json({ msg: "Assignment removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

export default router;
