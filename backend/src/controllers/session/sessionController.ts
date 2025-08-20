import { Request, Response } from "express";
import Session from "../../models/Session";
import { AuthRequest } from "../../middleware/auth";

// Get all sessions with pagination and filters
export const getAllSessions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (req.query.subject) filters.subject = req.query.subject;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.mentorId) filters.mentorId = req.query.mentorId;
    if (req.query.studentId) filters.studentId = req.query.studentId;

    const sessions = await Session.find(filters)
      .skip(skip)
      .limit(limit)
      .populate("mentorId", "firstName lastName")
      .populate("studentId", "firstName lastName");

    const total = await Session.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: sessions,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch sessions",
    });
  }
};

// Get session by ID
export const getSessionById = async (req: Request, res: Response) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("mentorId", "firstName lastName")
      .populate("studentId", "firstName lastName");

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch session",
    });
  }
};

// Update session
export const updateSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const updates = req.body;
    const session = await Session.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    // Check if user can update this session
    const canUpdate =
      req.user.role === "admin" ||
      session.mentorId?.toString() === req.user.id ||
      session.studentId?.toString() === req.user.id;

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        error: "Can only update your own sessions",
      });
    }

    res.json({
      success: true,
      data: session,
      message: "Session updated successfully",
    });
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update session",
    });
  }
};

// Delete session
export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    // Check if user can delete this session
    const canDelete =
      req.user.role === "admin" ||
      session.mentorId?.toString() === req.user.id ||
      session.studentId?.toString() === req.user.id;

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        error: "Can only delete your own sessions",
      });
    }

    await Session.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete session",
    });
  }
};
