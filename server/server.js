import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, branch: "ai-chatbot-scaffold" });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Future AI route
// app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});