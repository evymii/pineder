import express from "express";
import { authMiddleware, requireStudent } from "../middleware/auth";
import {
  getStudentProfile,
  createStudentProfile,
  updateStudentProfile,
} from "../controllers/student/studentProfileController";
import {
  uploadProfilePhoto,
  deleteProfilePhoto,
} from "../controllers/student/studentPhotoController";
import {
  getStudentStats,
  updateStudentLinks,
} from "../controllers/student/studentStatsController";

const router = express.Router();

// All routes require authentication and student role
router.use(authMiddleware);
router.use(requireStudent);

// Profile CRUD operations
router.get("/", getStudentProfile);
router.post("/", createStudentProfile);
router.put("/", updateStudentProfile);

// Profile photo operations
router.post("/photo", uploadProfilePhoto);
router.delete("/photo", deleteProfilePhoto);

// Statistics
router.get("/stats", getStudentStats);

// Links management
router.put("/links", updateStudentLinks);

export default router;
