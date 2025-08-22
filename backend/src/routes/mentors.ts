import express from "express";
import {
  createMentorProfile,
  getMentorProfile,
  updateMentorProfile,
} from "../controllers/mentor/mentorProfileController";
import {
  updateMentorAvailability,
  getMentorById,
  getAllMentors,
} from "../controllers/mentor/mentorController";
import {
  getAllMentorsWithAvailability,
  getMentorForBooking,
} from "../controllers/mentor/mentorBookingController";

import { authMiddleware } from "../middleware/auth";
import { validateBody } from "../middleware/zodValidation";
import { z } from "zod";

// Mentor profile schema
const createMentorProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  title: z.string().min(1, "Professional title is required"),
  company: z.string().optional(),
  employeeId: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(1000, "Bio too long"),
  avatar: z.string().optional(),
  backgroundImage: z.string().optional(),
  hourlyRate: z.number().min(0, "Hourly rate cannot be negative"),
  specialties: z.array(z.string()).min(1, "At least one specialty is required"),
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  experience: z.number().min(0, "Experience cannot be negative").default(1),
  links: z
    .object({
      github: z.string().optional(),
      portfolio: z.string().optional(),
      linkedin: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
  availability: z
    .array(
      z.object({
        dayOfWeek: z.number().min(0).max(6),
        startTime: z.string(),
        endTime: z.string(),
        isAvailable: z.boolean().default(true),
      })
    )
    .optional(),
  education: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  timezone: z.string().default("UTC"),
});

const updateMentorProfileSchema = createMentorProfileSchema.partial();

const updateAvailabilitySchema = z.object({
  availability: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string(),
      endTime: z.string(),
      isAvailable: z.boolean().default(true),
    })
  ),
});

const router = express.Router();

// Mentor profile management (authenticated)
router.post(
  "/",
  authMiddleware,
  // validateBody(createMentorProfileSchema), // Temporarily disabled for debugging
  createMentorProfile
);
router.get("/profile", authMiddleware, getMentorProfile);
router.put(
  "/profile",
  authMiddleware,
  // validateBody(updateMentorProfileSchema), // Temporarily disabled for debugging
  updateMentorProfile
);
router.put(
  "/availability",
  authMiddleware,
  validateBody(updateAvailabilitySchema),
  updateMentorAvailability
);

// Public mentor profiles
router.get("/", getAllMentors);
router.get("/:id", getMentorById);

// Mentor booking routes
router.get("/booking/available", authMiddleware, getAllMentorsWithAvailability);
router.get("/booking/:mentorId", authMiddleware, getMentorForBooking);

export default router;
