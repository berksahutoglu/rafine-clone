import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Get user by ID
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id).select("-password");
    if (!user) return res.status(404).json("User not found!");
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Update user by ID
export const updateUser = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      const { name, profilePic, password, newPassword, confirmNewPassword } =
        req.body;

      const user = await User.findById(userInfo.id);
      if (!user) return res.status(404).json("User not found!");

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json("Mevcut şifreniz doğru değil!");
      }

      if (newPassword && confirmNewPassword) {
        if (newPassword !== confirmNewPassword) {
          return res.status(400).json("Yeni şifreler eşleşmiyor!");
        }
      }

      let updateData = { name, profilePic };

      if (newPassword) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);
        updateData.password = hashedPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(
        userInfo.id,
        updateData,
        { new: true }
      ).select("-password");

      res.json("Updated!");
    } catch (err) {
      res.status(500).json(err);
      console.log("err", err);
    }
  });
};
