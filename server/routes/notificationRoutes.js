import express from "express";
import { getNotifications, markAsRead } from "../controllers/notificationController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(auth, getNotifications);

router.route("/:id/read").put(auth, markAsRead);

export default router;
