import express from "express";
import multer from "multer";

// Basic CRUD Controllers
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  syncUser,
  uploadAvatar,
} from "../controllers/user/userController";

// Profile & Settings Controllers
import {
  getUserProfile,
  getUserSettings,
  updateUserProfile,
  updateUserSettings,
} from "../controllers/user/userProfileController";

import {
  authMiddleware,
  requireStudent,
  requireMentor,
} from "../middleware/auth";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Public routes (no auth required)
router.get("/", getUsers);
router.get("/:id", getUserById);

// Protected routes (auth required)
router.post("/", authMiddleware, createUser); // Create user profile
router.post("/sync", authMiddleware, syncUser); // Sync user data after sign in
router.post("/avatar", authMiddleware, upload.single("avatar"), uploadAvatar); // Upload avatar
router.get("/profile", authMiddleware, getUserProfile); // Get own profile
router.get("/settings", authMiddleware, getUserSettings); // Get own settings
// Update routes
router.put("/profile", authMiddleware, updateUserProfile);
router.put("/settings", authMiddleware, updateUserSettings);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
