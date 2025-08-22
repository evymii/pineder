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

const success = (res: Response, data?: any, message?: string, status = 200) => {
  const response: any = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

// GET - Get Teams chat URL for session
export const getTeamsChatUrl = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { id } = req.params;

    const session = await Session.findById(id)
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

    // Check if user is authorized to access this session
    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    const mentor = await Mentor.findOne({ userId: user._id });

    const isAuthorized =
      (student &&
        student._id?.toString() === session.studentId._id?.toString()) ||
      (mentor && mentor._id?.toString() === session.mentorId._id?.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to access this session",
      });
    }

    // Generate Teams chat URL if not exists
    if (!session.teamsChatUrl) {
      const mentorEmail =
        (session.mentorId as any).userId?.email || "mentor@example.com";
      const teamsChatUrl = `https://teams.microsoft.com/l/chat/0/0?users=${mentorEmail}&topic=Session: ${session.title}`;

      await Session.findByIdAndUpdate(id, { teamsChatUrl });
      session.teamsChatUrl = teamsChatUrl;
    }

    success(res, { teamsChatUrl: session.teamsChatUrl });
  } catch (error) {
    handleError(res, error, "get teams chat url");
  }
};

// PUT - Update session
export const updateSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { id } = req.params;
    const updateData = req.body;

    const session = await Session.findById(id);
    if (!session) return notFound(res, "Session");

    // Check if user is authorized to update this session
    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    const mentor = await Mentor.findOne({ userId: user._id });

    const isAuthorized =
      (student && student._id?.toString() === session.studentId?.toString()) ||
      (mentor && mentor._id?.toString() === session.mentorId?.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this session",
      });
    }

    const updatedSession = await Session.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    success(res, updatedSession, "Session updated successfully");
  } catch (error) {
    handleError(res, error, "update session");
  }
};

// DELETE - Delete session
export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) return notFound(res, "Session");

    // Check if user is authorized to delete this session
    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    const mentor = await Mentor.findOne({ userId: user._id });

    const isAuthorized =
      (student && student._id?.toString() === session.studentId?.toString()) ||
      (mentor && mentor._id?.toString() === session.mentorId?.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this session",
      });
    }

    await Session.findByIdAndDelete(id);

    success(res, null, "Session deleted successfully");
  } catch (error) {
    handleError(res, error, "delete session");
  }
};
