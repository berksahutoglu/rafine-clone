import moment from "moment/moment.js";
import Notification from "../models/Notification.js";
import jwt from "jsonwebtoken";

// Get all notifications
export const getNotifications = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      const notifications = await Notification.find().sort({ createdAt: -1 });
      res.status(200).json(notifications);
    } catch (err) {
      res.status(500).json(err);
    }
  });
};

// Add a new notification
export const addNotification = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      const newNotification = new Notification({
        message: req.body.message,
        postId: req.body.postId,
        createdAt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      });

      const savedNotification = await newNotification.save();
      res
        .status(200)
        .json({
          message: "Notification has been created",
          id: savedNotification._id,
        });
    } catch (err) {
      res.status(500).json(err);
    }
  });
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      const deletedNotification = await Notification.findOneAndDelete({
        _id: req.params.id,
        postId: req.params.postId,
      });
      if (!deletedNotification)
        return res.status(403).json("You can delete only your notification");
      res.status(200).json("Notification has been deleted.");
    } catch (err) {
      res.status(500).json(err);
    }
  });
};
