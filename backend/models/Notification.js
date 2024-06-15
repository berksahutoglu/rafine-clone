import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", NotificationSchema);
