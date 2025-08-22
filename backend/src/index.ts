import express from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import { logger } from "./utils/logger";
import dotenv from "dotenv";
import {
  securityHeaders,
  rateLimiter,
  errorHandler,
  requestLogger,
  notFoundHandler,
} from "./middleware/security";
import userRoutes from "./routes/users";
import sessionRoutes from "./routes/sessions";
import mentorRoutes from "./routes/mentors";
import studentRoutes from "./routes/students";
import groupSessionRoutes from "./routes/groupSessions";
import eventRoutes from "./routes/events";
import ratingRoutes from "./routes/ratings";
import rescheduleRoutes from "./routes/reschedule";
import topicRoutes from "./routes/topics";
import mentorDashboardRoutes from "./routes/mentorDashboard";
import studentProfileRoutes from "./routes/studentProfile";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5555;

// Security middleware
app.use(securityHeaders);
app.use(rateLimiter);

// Request logging
if (process.env.NODE_ENV !== "test") {
  app.use(requestLogger);
}

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.FRONTEND_URL || "https://yourdomain.com"]
        : ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "x-user-id",
      "x-user-email",
      "x-user-role",
    ],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/group-sessions", groupSessionRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/reschedule", rescheduleRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/mentor-dashboard", mentorDashboardRoutes);
app.use("/api/student-profile", studentProfileRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend API is running successfully!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    database: "Connected",
  });
});

// API status endpoint
app.get("/api/status", (req, res) => {
  res.json({
    status: "OK",
    message: "API is ready for frontend connection",
    endpoints: {
      users: "/api/users",
      sessions: "/api/sessions",
      mentors: "/api/mentors",
      students: "/api/students",
      events: "/api/events",
      ratings: "/api/ratings",
      topics: "/api/topics",
      reschedule: "/api/reschedule",
    },
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Backend API is running with MVC architecture!",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      sessions: "/api/sessions",
      mentors: "/api/mentors",
      students: "/api/students",
      communities: "/api/communities",
      groupSessions: "/api/group-sessions",
      payments: "/api/payments",
      teacherAvailability: "/api/teacher-availability",
      events: "/api/events",
      ratings: "/api/ratings",
      studentProfile: "/api/student-profile",
    },
  });
});

// Test auth endpoint
app.get("/api/test-auth", (req, res) => {
  const userRole = req.headers["x-user-role"] as string;
  const userEmail = req.headers["x-user-email"] as string;
  const userId = req.headers["x-user-id"] as string;

  if (!userRole || !userEmail || !userId) {
    return res.status(401).json({
      success: false,
      error: "Authentication headers missing",
      required: ["x-user-role", "x-user-email", "x-user-id"],
    });
  }

  res.json({
    success: true,
    message: "Authentication successful",
    user: { id: userId, email: userEmail, role: userRole },
  });
});

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server started successfully`, {
        port: PORT,
        environment: process.env.NODE_ENV || "development",
      });
    });
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
};

startServer();
