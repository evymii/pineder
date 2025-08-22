import express from "express";
import {
  authMiddleware,
  requireMentor,
  requireStudent,
} from "../middleware/auth";
import {
  getAllSessions,
  getUpcomingSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getTeamsChatUrl,
} from "../controllers/session/sessionController";
import {
  getAvailableMentors,
  bookSession,
  getStudentBookings,
  cancelBooking,
  getSessionDetails,
} from "../controllers/session/sessionBookingController";
import {
  getPendingSessions,
  approveSession,
  rejectSession,
  getMentorSessions,
} from "../controllers/session/sessionApprovalController";
import {
  getSessionJoinInfo,
  startSession,
  endSession,
  getActiveSessions,
} from "../controllers/session/sessionJoinController";
import { rateMentor } from "../controllers/session/ratingController";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// General session routes
router.get("/", getAllSessions);
router.get("/upcoming", getUpcomingSessions);
router.get("/active", getActiveSessions);
router.get("/:id", getSessionById);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

// Booking routes (students)
router.get("/mentors/available", requireStudent, getAvailableMentors);
router.post("/book", requireStudent, bookSession);
router.get("/bookings/student", requireStudent, getStudentBookings);
router.delete("/bookings/:sessionId", requireStudent, cancelBooking);
router.get("/bookings/:sessionId/details", getSessionDetails);

// Approval routes (mentors)
router.get("/pending", requireMentor, getPendingSessions);
router.post("/:sessionId/approve", requireMentor, approveSession);
router.post("/:sessionId/reject", requireMentor, rejectSession);
router.get("/mentor/all", requireMentor, getMentorSessions);

// Join routes
router.get("/:sessionId/join", getSessionJoinInfo);
router.get("/:sessionId/teams-chat", getTeamsChatUrl);
router.post("/:sessionId/start", requireMentor, startSession);
router.post("/:sessionId/end", requireMentor, endSession);

// Rating routes
router.post("/:sessionId/rate", requireStudent, rateMentor);

export default router;
