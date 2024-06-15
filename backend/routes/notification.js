import express from "express";

import {
  addNotification,
  getNotifications,
  deleteNotification,
} from "../controllers/notifications.js";

const router = express.Router();

router.get("/", getNotifications);
router.post("/", addNotification);
router.delete("/:id", deleteNotification);

export default router;
