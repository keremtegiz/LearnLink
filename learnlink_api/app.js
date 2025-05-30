import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import chatroomRoutes from "./routes/chatroomRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import directMessageRoutes from "./routes/directMessageRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure CORS with specific options
app.use(
  cors({
    origin: [
      "https://golearnlink.com",
      "https://www.golearnlink.com",
      "https://learnlink-gui.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
const uploadsPath = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsPath, { recursive: true }); // Ensure the directory exists
app.use("/uploads", express.static(uploadsPath));

// Ensure all uploads subdirectories exist
["files", "images", "pdf"].forEach((dir) => {
  const dirPath = path.join(uploadsPath, dir);
  fs.mkdirSync(dirPath, { recursive: true });
});

// Add CORS headers for file downloads
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Add request logging middleware
app.use((req, res, next) => {
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chatrooms", chatroomRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/direct-messages", directMessageRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/assignments", assignmentRoutes);

// Root path handler for health checks - place it after all other routes
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "LearnLink API is running",
    timestamp: new Date().toISOString(),
  });
});

// Add a test route to check API connectivity
app.get("/api/test", (req, res) => {
  res.status(200).send("LearnLink backend is running");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Error handling request: ${req.method} ${req.originalUrl}`);
  console.error("Error details:", err);
  console.error("Error stack:", err.stack);

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
});

// Handle 404 errors - this must be the very last middleware
app.use("*", (req, res) => {
  res.status(404).json({
    error: {
      message: "Not Found",
      status: 404,
      path: req.originalUrl,
    },
  });
});

export default app;