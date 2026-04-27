import express from "express";
import Event from "../models/Event.js";
import { auth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/", [auth, upload.single("image")], async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }
    const { title, description, date, time } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newEvent = new Event({ title, description, date, time, imageUrl });
    const event = await newEvent.save();
    res.json(event);
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
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    await event.deleteOne();
    res.json({ msg: "Event removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

export default router;
