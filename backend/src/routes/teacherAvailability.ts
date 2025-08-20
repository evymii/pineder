import express from "express";
import {
  getTeacherAvailability,
  createTeacherAvailability,
  updateTeacherAvailability,
  deleteTeacherAvailability,
  getAvailableTimeSlots,
} from "../controllers/mentor/mentorAvailabilityController";

const router = express.Router();

router.get("/:mentorId", getTeacherAvailability);
router.post("/:mentorId", createTeacherAvailability);
router.put("/:mentorId", updateTeacherAvailability);
router.delete("/:mentorId", deleteTeacherAvailability);
router.get("/:mentorId/slots", getAvailableTimeSlots);

export default router;
