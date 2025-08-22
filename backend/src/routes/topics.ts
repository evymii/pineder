import express from "express";
import { authMiddleware, requireStudent } from "../middleware/auth";
import {
  submitTopic,
  getTopics,
  voteTopic,
  getTopTopics,
} from "../controllers/groupSession/groupSessionTopicController";
import {
  updateTopic,
  deleteTopic,
  editTopic,
  selectTopicForTeaching,
} from "../controllers/groupSession/topicManagementController";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Topic CRUD routes
router.post("/", requireStudent, submitTopic);
router.get("/", getTopics);
router.get("/top", getTopTopics);
router.put("/:topicId", requireStudent, updateTopic);
router.delete("/:topicId", requireStudent, deleteTopic);

// Voting route
router.post("/:topicId/vote", requireStudent, voteTopic);

export default router;
