import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // Email formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json("Geçerli bir adres girin.");
    }

    // CHECK IF USER EXISTS
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(409).json("User already exists!");

    // CREATE A NEW USER
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });

    await newUser.save();
    return res.status(200).json("User has been created.");
  } catch (err) {
    return res.status(500).json(err);
  }
};
export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found!");

    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordValid)
      return res.status(400).json("Wrong password or email!");

    const token = jwt.sign({ id: user._id }, "secretkey");

    const { password, ...others } = user._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};
