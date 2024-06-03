import express from "express";
const app = express();
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import notificationRoutes from "./routes/notification.js";
import { db } from "./connect.js";

import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

//middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/rafine/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/api/database/status", (req, res) => {
  const data = {
    Time: new Date().getTime(),
    DatabaseStatus: "",
  };

  db.query(
    "SELECT SettingValue FROM your_status_table WHERE SettingKey = 'DatabaseStatus'",
    (err, rows) => {
      if (err) {
        data.DatabaseStatus = "Down";
        return res.json(data);
      }

      const dbretval = rows[0]?.SettingValue;
      if (dbretval == 1) {
        data.DatabaseStatus = "Up";
      } else {
        data.DatabaseStatus = "Down";
      }

      res.json(data);
    }
  );
});

app.listen(8800, () => {
  console.log("API working!");
});
