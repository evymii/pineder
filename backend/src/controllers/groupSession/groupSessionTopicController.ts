import { Request, Response } from "express";
import GroupSession from "../../models/GroupSession";

// Get all topics for a group session
export const getTopics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const groupSession = await GroupSession.findById(id);
    if (!groupSession) {
      return res.status(404).json({
        success: false,
        error: "Group session not found",
      });
    }

    res.json({
      success: true,
      data: groupSession.topics,
    });
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch topics",
    });
  }
};

// Submit a new topic for group session
export const submitTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, submittedBy } = req.body;

    const groupSession = await GroupSession.findById(id);
    if (!groupSession) {
      return res.status(404).json({
        success: false,
        error: "Group session not found",
      });
    }

    const topic = {
      id: Date.now().toString(),
      title: title as string,
      description: description as string,
      votes: 0,
      submittedBy: submittedBy as any,
      status: "pending" as const,
    };

    groupSession.topics.push(topic);
    await groupSession.save();

    res.json({
      success: true,
      data: topic,
      message: "Topic submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting topic:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit topic",
    });
  }
};

// Vote for a topic
export const voteTopic = async (req: Request, res: Response) => {
  try {
    const { id, topicId } = req.params;

    const groupSession = await GroupSession.findById(id);
    if (!groupSession) {
      return res.status(404).json({
        success: false,
        error: "Group session not found",
      });
    }

    const topic = groupSession.topics.find((t) => t.id === topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        error: "Topic not found",
      });
    }

    topic.votes += 1;
    await groupSession.save();

    res.json({
      success: true,
      data: topic,
      message: "Vote recorded successfully",
    });
  } catch (error) {
    console.error("Error voting on topic:", error);
    res.status(500).json({
      success: false,
      error: "Failed to record vote",
    });
  }
};
