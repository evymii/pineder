import express from "express";

// Basic CRUD Controllers
import {
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
} from "../controllers/session/sessionController";

// Booking Controller
import { createSession } from "../controllers/session/sessionBookingController";

// Approval Controllers
import {
  approveSession,
  rejectSession,
} from "../controllers/session/sessionApprovalController";

// Status Controllers
import {
  getPendingSessions,
  cancelSession,
  completeSession,
  addFeedback,
} from "../controllers/session/sessionStatusController";

import {
  authMiddleware,
  requireStudent,
  requireMentor,
} from "../middleware/auth";

const router = express.Router();

// Public routes (no auth required)
router.get("/", getAllSessions);
router.get("/:id", getSessionById);

// Protected routes (auth required)
// Session CRUD (students can book, users can update/delete own)
router.post("/", authMiddleware, requireStudent, createSession);
router.put("/:id", authMiddleware, updateSession);
router.delete("/:id", authMiddleware, deleteSession);

// Mentor-only routes
router.get(
  "/mentor/:mentorId/pending",
  authMiddleware,
  requireMentor,
  getPendingSessions
); // View pending sessions
// Mentor session management
router.post("/:id/approve", authMiddleware, requireMentor, approveSession);
router.post("/:id/reject", authMiddleware, requireMentor, rejectSession);
router.post("/:id/complete", authMiddleware, requireMentor, completeSession);

// General session management (mentor or student)
router.post("/:id/cancel", authMiddleware, cancelSession);
router.post("/:id/feedback", authMiddleware, addFeedback);

export default router;
