import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export const auth = async (req, res, next) => {
  try {
    const raw = req.headers.authorization || "";
    const token = raw.startsWith("Bearer ") ? raw.slice(7) : raw;
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const adminAuth = async (req, res, next) => {
  try {
    const raw = req.headers.authorization || "";
    const token = raw.startsWith("Bearer ") ? raw.slice(7) : raw;
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
