import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT p.*, u.name, u.profilePic
    FROM posts p
    JOIN users u ON u.id = p.userId
    ORDER BY p.createdAt DESC;`;

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts (`desc`,`img`,`title`,`createdAt`,`userId`,`content`,`isChecked`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.img,
      req.body.title,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.content,
      req.body.isChecked,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res
        .status(200)
        .json({ message: "Post has been created", id: data.insertId });
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE posts SET `title` = ?, `desc` = ? WHERE `id` = ? AND `userId` = ?";

    const values = [req.body.title, req.body.desc, req.params.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows === 0)
        return res.status(404).json("Post not found or not authorized");
      return res.status(200).json("Post has been updated");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post");
    });
  });
};
