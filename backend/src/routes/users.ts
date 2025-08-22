import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user/userController";
import {
  uploadProfilePhoto,
  updateProfile,
  getProfile,
  deleteProfilePhoto,
} from "../controllers/user/userProfileController";

const router = express.Router();

// Public routes (no auth required)
router.get("/", getUsers);
router.get("/:id", getUserById);

// Protected routes (auth required)
router.use(authMiddleware);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Profile routes
router.get("/profile/me", getProfile);
router.put("/profile/me", updateProfile);
router.post("/profile/photo", uploadProfilePhoto);
router.delete("/profile/photo", deleteProfilePhoto);

export default router;
