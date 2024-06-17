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
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import notificationRoutes from "./routes/notification.js";

// Load environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware to set CORS headers
app.use(
  cors({
    origin: "https://rafine-clone.vercel.app", // Frontend URL'nizi buraya ekleyin
    methods: ["GET", "HEAD", "OPTIONS", "POST", "PUT"],
    credentials: true,
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("common"));

// Multer configuration
const storageEngine = multer.memoryStorage();
const upload = multer({ storage: storageEngine });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    console.log("No file received");
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("Received file:", file);
  const storageRef = ref(
    storage,
    `rafineee/${Date.now()}_${file.originalname}`
  );

  try {
    await uploadBytes(storageRef, file.buffer);
    const url = await getDownloadURL(storageRef);
    console.log("File uploaded successfully. URL:", url);
    res.status(200).json({ url });
  } catch (error) {
    console.error("Error uploading file", error);
    res.status(500).json({ error: "Error uploading file" });
  }
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// Start the server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`API working on port ${PORT}!`);
});
