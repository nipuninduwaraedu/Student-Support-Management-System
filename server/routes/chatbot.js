import express from "express";
import axios from "axios";

const router = express.Router();
const PYTHON_API = "http://localhost:8000";

// POST /api/chatbot/ask
router.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ error: "Question cannot be empty." });
  }

  try {
    const response = await axios.post(
      `${PYTHON_API}/query`,
      { question },
      { timeout: 30000 },
    );
    return res.json(response.data);
  } catch (err) {
    console.error("Chatbot error:", err.message);
    return res.status(500).json({
      answer:
        "The AI service is currently unavailable. Please make sure the Python server is running on port 8000.",
      sources: [],
    });
  }
});

export default router;
