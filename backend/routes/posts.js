import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

import {
  addPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/posts.js";

const router = express.Router();

router.get("/",verifyToken, getPosts);
router.post("/",verifyToken, addPost);
router.put("/:id",verifyToken, updatePost);
router.delete("/:id",verifyToken, deletePost);

export default router;
