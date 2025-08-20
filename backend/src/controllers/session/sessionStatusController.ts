import { Request, Response } from "express";
import Session from "../../models/Session";
import { AuthRequest } from "../../middleware/auth";

const handleError = (res: Response, error: any, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ success: false, error: `Failed to ${message}` });
};

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, error: "Authentication required" });

const notFound = (res: Response, resource: string) =>
  res.status(404).json({ success: false, error: `${resource} not found` });

const forbidden = (res: Response, message: string) =>
  res.status(403).json({ success: false, error: message });

const badRequest = (res: Response, message: string) =>
  res.status(400).json({ success: false, error: message });

const success = (res: Response, data?: any, message?: string) => {
  const response: any = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  res.json(response);
};

const verifyRole = (userRole: string, allowedRoles: string[]) =>
  allowedRoles.includes(userRole);

const verifySessionOwnership = (
  session: any,
  userId: string,
  role?: string
) => {
  if (role === "admin") return true;
  return (
    session.mentorId?.toString() === userId ||
    session.studentId?.toString() === userId
  );
};

const verifyMentorOwnership = (session: any, userId: string) =>
  session.mentorId?.toString() === userId;

export const getPendingSessions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (!verifyRole(req.user.role, ["mentor"])) {
      return forbidden(res, "Only mentors can view pending sessions");
    }

    const { mentorId } = req.params;
    if (mentorId !== req.user.id) {
      return forbidden(res, "Can only view your own pending sessions");
    }

    const sessions = await Session.find({
      mentorId,
      status: "requested",
    }).populate("studentId", "firstName lastName");

    success(res, sessions);
  } catch (error) {
    handleError(res, error, "fetch pending sessions");
  }
};

export const cancelSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { id } = req.params;
    const { reason } = req.body;

    const session = await Session.findById(id);
    if (!session) return notFound(res, "Session");

    if (!verifySessionOwnership(session, req.user.id, req.user.role)) {
      return forbidden(res, "Can only cancel your own sessions");
    }

    session.status = "cancelled";
    if (reason) session.notes = reason;
    await session.save();

    success(res, session, "Session cancelled successfully");
  } catch (error) {
    handleError(res, error, "cancel session");
  }
};

export const completeSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (!verifyRole(req.user.role, ["mentor"])) {
      return forbidden(res, "Only mentors can complete sessions");
    }

    const session = await Session.findById(req.params.id);
    if (!session) return notFound(res, "Session");

    if (!verifyMentorOwnership(session, req.user.id)) {
      return forbidden(res, "Can only complete your own sessions");
    }

    if (!["approved", "scheduled"].includes(session.status)) {
      return badRequest(
        res,
        "Only approved or scheduled sessions can be completed"
      );
    }

    session.status = "completed";
    await session.save();

    success(res, session, "Session completed successfully");
  } catch (error) {
    handleError(res, error, "complete session");
  }
};

export const addFeedback = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { id } = req.params;
    const { feedback, rating } = req.body;

    const session = await Session.findById(id);
    if (!session) return notFound(res, "Session");

    if (!verifySessionOwnership(session, req.user.id)) {
      return forbidden(res, "Can only add feedback to your own sessions");
    }

    if (session.status !== "completed") {
      return badRequest(
        res,
        "Feedback can only be added to completed sessions"
      );
    }

    session.feedback = feedback;
    if (rating) session.rating = rating;
    await session.save();

    success(res, session, "Feedback added successfully");
  } catch (error) {
    handleError(res, error, "add feedback");
  }
};
