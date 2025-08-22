import { Response } from "express";
import User from "../../models/User";
import Student from "../../models/Student";
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

// GET - Get student statistics
export const getStudentStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        error: "Only students can access student stats",
      });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return notFound(res, "Student profile");

    const stats = {
      totalSessions: student.totalSessions,
      totalMentors: student.totalMentors,
      averageRating: student.averageRating,
      grade: student.grade,
      subjectsCount: student.subjects.length,
      goalsCount: student.goals.length,
    };

    success(res, stats);
  } catch (error) {
    handleError(res, error, "fetch student stats");
  }
};

// PUT - Update student links
export const updateStudentLinks = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ success: false, error: "Only students can update links" });
    }

    const { github, portfolio, linkedIn } = req.body;

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const links: any = {};
    if (github !== undefined) links.github = github;
    if (portfolio !== undefined) links.portfolio = portfolio;
    if (linkedIn !== undefined) links.linkedIn = linkedIn;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { links },
      { new: true, runValidators: true }
    );

    success(res, updatedUser!.links, "Student links updated successfully");
  } catch (error) {
    handleError(res, error, "update student links");
  }
};
