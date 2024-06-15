import moment from "moment/moment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import jwt from "jsonwebtoken";

// Get all posts
export const getPosts = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      const posts = await Post.find()
        .populate("userId", "name profilePic")
        .sort({ createdAt: -1 });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });
};

// Add a new post
export const addPost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      const newPost = new Post({
        desc: req.body.desc,
        img: req.body.img,
        title: req.body.title,
        createdAt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userId: userInfo.id,
        content: req.body.content,
        isChecked: req.body.isChecked,
      });

      const savedPost = await newPost.save();
      res
        .status(200)
        .json({ message: "Post has been created", id: savedPost._id });
    } catch (err) {
      res.status(500).json(err);
    }
  });
};

// Update a post
export const updatePost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: req.params.id, userId: userInfo.id },
        { title: req.body.title, desc: req.body.desc },
        { new: true }
      );

      if (!updatedPost)
        return res.status(404).json("Post not found or not authorized");
      res.status(200).json("Post has been updated");
    } catch (err) {
      res.status(500).json(err);
    }
  });
};

// Delete a post
export const deletePost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      // Post'u sil
      const deletedPost = await Post.findOneAndDelete({
        _id: req.params.id,
        userId: userInfo.id,
      });
      if (!deletedPost)
        return res.status(403).json("You can delete only your post");

      // İlgili bildirimleri sil
      await Notification.deleteMany({ postId: req.params.id }); // <--- corrected

      res.status(200).json("Post and its notifications have been deleted.");
    } catch (err) {
      res.status(500).json(err);
    }
  });
};
