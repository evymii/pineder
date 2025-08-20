import express from "express";

// Community Controllers
import {
  getAllCommunities,
  getCommunityById,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
} from "../controllers/community/communityController";

// Post Controllers
import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
} from "../controllers/community/communityPostController";

// Comment Controllers
import {
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/community/communityCommentController";

const router = express.Router();

// Community routes
router.get("/", getAllCommunities);
router.get("/:id", getCommunityById);
router.post("/", createCommunity);
router.put("/:id", updateCommunity);
router.delete("/:id", deleteCommunity);

// Community membership
router.post("/:id/join", joinCommunity);
router.post("/:id/leave", leaveCommunity);

// Post routes
router.get("/:communityId/posts", getPosts);
router.post("/:communityId/posts", createPost);
router.get("/:communityId/posts/:postId", getPost);
router.put("/:communityId/posts/:postId", updatePost);
router.delete("/:communityId/posts/:postId", deletePost);
router.post("/:communityId/posts/:postId/like", likePost);

// Comment routes
router.post("/:communityId/posts/:postId/comments", addComment);
router.put("/:communityId/posts/:postId/comments/:commentId", updateComment);
router.delete("/:communityId/posts/:postId/comments/:commentId", deleteComment);

export default router;
