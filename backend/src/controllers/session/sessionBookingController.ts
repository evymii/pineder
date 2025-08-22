import { Response } from "express";
import Session from "../../models/Session";
import Mentor from "../../models/Mentor";
import Student from "../../models/Student";
import User from "../../models/User";
import { AuthRequest } from "../../middleware/auth";

const handleError = (res: Response, error: any, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ success: false, error: `Failed to ${message}` });
};

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, error: "Authentication required" });

const notFound = (res: Response, resource: string) =>
  res.status(404).json({ success: false, error: `${resource} not found` });

const badRequest = (res: Response, message: string) =>
  res.status(400).json({ success: false, error: message });

const success = (res: Response, data?: any, message?: string, status = 200) => {
  const response: any = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

// This file has been refactored into smaller, focused controllers:
// - mentorSelectionController.ts: getAvailableMentors
// - sessionCreationController.ts: bookSession

// Re-export functions for backward compatibility
export { getAvailableMentors } from "./mentorSelectionController";
export { bookSession } from "./sessionCreationController";

// GET - Get student's booking history
export const getStudentBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return notFound(res, "Student");

    const { status } = req.query;
    const filter: any = { studentId: student._id };

    if (status) {
      filter.status = status;
    }

    const sessions = await Session.find(filter)
      .populate("mentorId", "specialties bio rating")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .sort({ startTime: -1 });

    success(res, sessions);
  } catch (error) {
    handleError(res, error, "fetch student bookings");
  }
};

// PUT - Cancel a booking
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const { sessionId } = req.params;
    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return notFound(res, "Student");

    const session = await Session.findOne({
      _id: sessionId,
      studentId: student._id,
    });

    if (!session) return notFound(res, "Session");

    if (session.status !== "requested" && session.status !== "approved") {
      return badRequest(res, "Can only cancel requested or approved sessions");
    }

    session.status = "cancelled";
    await session.save();

    success(res, session, "Session cancelled successfully");
  } catch (error) {
    handleError(res, error, "cancel booking");
  }
};

// GET - Get session details
export const getSessionDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { sessionId } = req.params;

    const session = await Session.findById(sessionId)
      .populate("mentorId", "specialties bio rating")
      .populate("studentId", "grade subjects")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      });

    if (!session) return notFound(res, "Session");

    // Check if user is authorized to view this session
    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    const mentor = await Mentor.findOne({ userId: user._id });

    const isAuthorized =
      (student &&
        student._id?.toString() === session.studentId._id?.toString()) ||
      (mentor && mentor._id?.toString() === session.mentorId._id?.toString());

    if (!isAuthorized) {
      return res
        .status(403)
        .json({ success: false, error: "Not authorized to view this session" });
    }

    success(res, session);
  } catch (error) {
    handleError(res, error, "fetch session details");
  }
};
