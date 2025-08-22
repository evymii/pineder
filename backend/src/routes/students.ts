import express from "express";
import {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
} from "../controllers/student/studentProfileController";
import { getStudentById } from "../controllers/student/studentController";

import { authMiddleware } from "../middleware/auth";
import { validateBody } from "../middleware/zodValidation";
import { z } from "zod";

// Student profile schema
const createStudentProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  major: z.string().min(1, "Class name is required"), // This will store the className
  studentCode: z.string().min(1, "Student code is required"),
  email: z.string().email("Valid email is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  avatar: z.string().optional(),
  backgroundImage: z.string().optional(),
  grade: z.string().default("Beginner"),
  subjects: z.array(z.string()).default([]),
  goals: z.array(z.string()).default([]),
});

const updateStudentProfileSchema = createStudentProfileSchema.partial();

const router = express.Router();

// Student profile management (authenticated)
router.post(
  "/",
  authMiddleware,
  // validateBody(createStudentProfileSchema), // Temporarily disabled for debugging
  createStudentProfile
);
router.get("/profile", authMiddleware, getStudentProfile);
router.put(
  "/profile",
  authMiddleware,
  validateBody(updateStudentProfileSchema),
  updateStudentProfile
);

// Public student profiles
router.get("/:id", getStudentById);

export default router;
