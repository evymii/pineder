import express from "express";
import {
  getAllMentors,
  getMentorById,
  getMentorByUserId,
  searchMentors,
  createMentor,
  updateMentor,
  deleteMentor,
} from "../controllers/mentor/mentorController";

const router = express.Router();

router.get("/", getAllMentors);
router.get("/search", searchMentors);
router.get("/user/:userId", getMentorByUserId);
router.get("/:id", getMentorById);
router.post("/", createMentor);
router.put("/:id", updateMentor);
router.delete("/:id", deleteMentor);

export default router;
