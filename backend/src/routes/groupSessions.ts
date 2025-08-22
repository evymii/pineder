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
  getTopTopics,
} from "../controllers/groupSession/groupSessionTopicController";
import {
  editTopic,
  deleteTopic,
  selectTopicForTeaching,
} from "../controllers/groupSession/topicManagementController";

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
router.put("/:id/topics/:topicId", editTopic);
router.delete("/:id/topics/:topicId", deleteTopic);
router.get("/:id/topics/top-voted", getTopTopics);
router.post("/:id/topics/:topicId/select", selectTopicForTeaching);

export default router;
