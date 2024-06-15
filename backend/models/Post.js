import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String },
  isChecked: { type: Boolean, default: false },
});

export default mongoose.model("Post", PostSchema);
