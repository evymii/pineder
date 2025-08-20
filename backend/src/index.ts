import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import userRoutes from "./routes/users";
import sessionRoutes from "./routes/sessions";
import mentorRoutes from "./routes/mentors";
import studentRoutes from "./routes/students";
import communityRoutes from "./routes/communities";
import groupSessionRoutes from "./routes/groupSessions";
import paymentRoutes from "./routes/payments";
import teacherAvailabilityRoutes from "./routes/teacherAvailability";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5555;

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
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/group-sessions", groupSessionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/teacher-availability", teacherAvailabilityRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend API is running with MVC architecture!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
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


const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
