import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getUser = (req, res) => {
  const user_id = req.params.user_id;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [user_id], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q =
      "UPDATE users SET `name`=?,`profilePic`=?,`password`=? WHERE id = ?";
    db.query(
      q,
      [req.body.name, req.body.profilePic, hashedPassword, userInfo.id],
      (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your account!");
      }
    );
  });
};
