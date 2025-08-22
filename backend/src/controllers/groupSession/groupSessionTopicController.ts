import { Response } from "express";
import GroupSession from "../../models/GroupSession";
import Student from "../../models/Student";
import { AuthRequest } from "../../middleware/auth";

const handleError = (res: Response, error: unknown, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ success: false, error: `Failed to ${message}` });
};

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, error: "Authentication required" });

const notFound = (res: Response, resource: string) =>
  res.status(404).json({ success: false, error: `${resource} not found` });

const badRequest = (res: Response, message: string) =>
  res.status(400).json({ success: false, error: message });

const success = <T>(
  res: Response,
  data?: T,
  message?: string,
  status = 200
) => {
  const response: { success: true; data?: T; message?: string } = {
    success: true,
  };
  if (data !== undefined) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

export const submitTopic = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ success: false, error: "Only students can submit topics" });
    }

    const { groupSessionId, title, description, category } = req.body;

    if (!groupSessionId || !title) {
      return badRequest(res, "Group session ID and title are required");
    }

    const student = await Student.findOne({ userId: req.user.dbId });
    if (!student) return notFound(res, "Student");

    const groupSession = await GroupSession.findById(groupSessionId);
    if (!groupSession) return notFound(res, "Group session");

    const topicId = `topic_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const topic = {
      id: topicId,
      title,
      description: description || "",
      category: category || "General",
      votes: 0,
      submittedBy: student._id,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    groupSession.topics.push(topic as any);
    await groupSession.save();

    success(res, topic, "Topic submitted successfully", 201);
  } catch (error) {
    handleError(res, error, "submit topic");
  }
};

export const getTopics = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { groupSessionId } = req.params;
    const { status = "pending" } = req.query;

    const groupSession = await GroupSession.findById(groupSessionId);
    if (!groupSession) return notFound(res, "Group session");

    let topics = groupSession.topics;

    if (status) {
      topics = topics.filter((topic) => topic.status === status);
    }

    // Sort by votes (descending) and then by creation date
    topics.sort((a, b) => {
      if (b.votes !== a.votes) {
        return b.votes - a.votes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    success(res, topics);
  } catch (error) {
    handleError(res, error, "fetch topics");
  }
};

export const voteTopic = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ success: false, error: "Only students can vote" });
    }

    const { groupSessionId, topicId } = req.params;
    const { vote } = req.body; // 1 for upvote, -1 for downvote

    if (!vote || ![1, -1].includes(vote)) {
      return badRequest(res, "Vote must be 1 (upvote) or -1 (downvote)");
    }

    const student = await Student.findOne({ userId: req.user.dbId });
    if (!student) return notFound(res, "Student");

    const groupSession = await GroupSession.findById(groupSessionId);
    if (!groupSession) return notFound(res, "Group session");

    const topic = groupSession.topics.find((t) => t.id === topicId);
    if (!topic) return notFound(res, "Topic");

    // Simple voting - just increment/decrement votes
    topic.votes += vote;
    topic.updatedAt = new Date();

    await groupSession.save();

    success(res, topic, "Vote recorded successfully");
  } catch (error) {
    handleError(res, error, "vote topic");
  }
};

export const getTopTopics = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { groupSessionId } = req.params;
    const { limit = 5 } = req.query;

    const groupSession = await GroupSession.findById(groupSessionId);
    if (!groupSession) return notFound(res, "Group session");

    const topTopics = groupSession.topics
      .filter((topic) => topic.status === "pending")
      .sort((a, b) => b.votes - a.votes)
      .slice(0, Number(limit));

    success(res, topTopics);
  } catch (error) {
    handleError(res, error, "fetch top topics");
  }
};
