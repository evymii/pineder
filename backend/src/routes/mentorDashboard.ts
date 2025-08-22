import express from "express";
import { authMiddleware, requireMentor } from "../middleware/auth";
import {
  getDashboardOverview,
  getMentorPerformance,
} from "../controllers/mentor/mentorOverviewController";
import {
  getNewSessionRequests,
  getUpcomingSessions,
  getRecentStudents,
} from "../controllers/mentor/mentorSessionsController";
import {
  getMentorAvailability,
  updateMentorAvailability,
} from "../controllers/mentor/mentorAvailabilityController";

const router = express.Router();

// All routes require authentication and mentor role
router.use(authMiddleware);
router.use(requireMentor);

// Dashboard overview
router.get("/overview", getDashboardOverview);

// Session requests
router.get("/session-requests", getNewSessionRequests);

// Upcoming sessions
router.get("/upcoming-sessions", getUpcomingSessions);

// Recent students
router.get("/recent-students", getRecentStudents);

// Performance statistics
router.get("/performance", getMentorPerformance);

// Availability management
router.get("/availability", getMentorAvailability);
router.put("/availability", updateMentorAvailability);

export default router;
