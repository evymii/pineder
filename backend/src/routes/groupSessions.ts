import express from "express";

// Group Session CRUD Controllers
import {
  getAllGroupSessions,
  getGroupSessionById,
  createGroupSession,
  updateGroupSession,
  deleteGroupSession,
} from "../controllers/groupSession/groupSessionController";

// Membership Controllers
import {
  joinGroupSession,
  leaveGroupSession,
} from "../controllers/groupSession/groupSessionMembershipController";

// Topic Management Controllers
import {
  getTopics,
  submitTopic,
  voteTopic,
} from "../controllers/groupSession/groupSessionTopicController";

const router = express.Router();

router.get("/", getAllGroupSessions);
router.get("/:id", getGroupSessionById);
router.post("/", createGroupSession);
router.put("/:id", updateGroupSession);
router.delete("/:id", deleteGroupSession);
router.post("/:id/join", joinGroupSession);
router.post("/:id/leave", leaveGroupSession);
router.get("/:id/topics", getTopics);
router.post("/:id/topics", submitTopic);
router.post("/:id/topics/:topicId/vote", voteTopic);

export default router;
