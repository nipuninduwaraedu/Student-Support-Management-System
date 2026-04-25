import express from "express";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";

const router = express.Router();
const PYTHON_API = "http://localhost:8000";

const upload = multer({ storage: multer.memoryStorage() });

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
    console.error("Chatbot query error:", err.message);

    // If the Python server responded with an error, forward that error message
    if (err.response) {
      const errorData = err.response.data;
      return res.status(err.response.status).json({
        answer:
          errorData.answer ||
          errorData.detail ||
          "The AI service encountered an error.",
        sources: [],
        error: true,
      });
    }

    // Otherwise it's a connection error or timeout
    return res.status(503).json({
      answer:
        "The AI service is currently unavailable. Please make sure the Python server is running on port 8000.",
      sources: [],
      error: true,
    });
  }
});

// POST /api/chatbot/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(`${PYTHON_API}/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return res.json(response.data);
  } catch (err) {
    console.error("Chatbot upload error:", err.message);

    if (err.response) {
      return res.status(err.response.status).json({
        error:
          err.response.data.detail || "Failed to upload file to AI service.",
        details: err.response.data.detail || err.message,
      });
    }

    return res.status(503).json({
      error: "The AI service is currently unavailable for uploads.",
      details: err.message,
    });
  }
});

export default router;
