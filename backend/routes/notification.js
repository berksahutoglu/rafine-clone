import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

import {
  addNotification,
  getNotifications,
  deleteNotification,
} from "../controllers/notifications.js";

const router = express.Router();

router.get("/",verifyToken, getNotifications);
router.post("/",verifyToken, addNotification);
router.delete("/:id",verifyToken, deleteNotification);

export default router;
