import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import notificationRoutes from "./routes/notification.js";

// Load environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("common"));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../frontend/rafine/public/upload"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../frontend/rafine/build")));

// Catch-all handler to serve React's index.html for any unhandled routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/rafine/build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`API working on port ${PORT}!`);
});
