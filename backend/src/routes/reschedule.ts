import express from "express";
import {
  authMiddleware,
  requireMentor,
  requireStudent,
} from "../middleware/auth";
import { getMentorAvailabilityForReschedule } from "../controllers/session/sessionRescheduleAvailabilityController";
import {
  requestReschedule,
  getRescheduleRequests,
} from "../controllers/session/sessionRescheduleRequestController";
import {
  approveReschedule,
  rejectReschedule,
} from "../controllers/session/sessionRescheduleApprovalController";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Student routes
router.get(
  "/:sessionId/availability",
  requireStudent,
  getMentorAvailabilityForReschedule
);
router.post("/:sessionId/request", requireStudent, requestReschedule);

// Mentor routes
router.get("/requests", requireMentor, getRescheduleRequests);
router.post("/:sessionId/approve", requireMentor, approveReschedule);
router.post("/:sessionId/reject", requireMentor, rejectReschedule);

export default router;
