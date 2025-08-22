import { Response } from "express";
import Session from "../../models/Session";
import Mentor from "../../models/Mentor";
import Student from "../../models/Student";
import User from "../../models/User";
import { AuthRequest } from "../../middleware/auth";
import { ZoomMeetingService } from "../../services/zoomMeetingService";

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

// POST - Book a session with mentor
export const bookSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ success: false, error: "Only students can book sessions" });
    }

    const { mentorId, date, time, topic, studentChoice, requestNotes } =
      req.body;

    // Validate required fields
    if (!mentorId || !date || !time || !topic || !studentChoice) {
      return badRequest(
        res,
        "Mentor ID, date, time, topic, and student choice are required"
      );
    }

    // Validate student choice
    if (!["free", "coffee", "ice-cream"].includes(studentChoice)) {
      return badRequest(
        res,
        "Invalid student choice. Must be 'free', 'coffee', or 'ice-cream'"
      );
    }

    // Check if mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return notFound(res, "Mentor");

    // Check if student exists and has completed profile
    console.log("=== SESSION BOOKING DEBUG ===");
    console.log("Request user:", req.user);
    console.log("Looking for user with email:", req.user.email);
    
    const user = await User.findOne({ email: req.user.email });
    console.log("Found user:", user ? "YES" : "NO");
    if (user) {
      console.log("User ID:", user._id);
      console.log("User role:", user.role);
    }
    
    if (!user) return notFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) {
      return badRequest(
        res,
        "Student profile not found. Please complete your profile first"
      );
    }

    // Parse date and time
    const [year, month, day] = date.split("-").map(Number);
    const [hour] = time.split(":").map(Number);

    const startTime = new Date(year, month - 1, day, hour, 0, 0);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour session

    // Validate session time (must be in the future)
    if (startTime <= new Date()) {
      return badRequest(res, "Session must be scheduled for a future time");
    }

    // Check if time slot is available
    const conflictingSession = await Session.findOne({
      mentorId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
      status: { $in: ["requested", "approved", "scheduled", "active"] },
    });

    if (conflictingSession) {
      return badRequest(res, "This time slot is not available");
    }

    // Check mentor availability for this day and time
    const dayOfWeek = startTime.getDay();
    const mentorAvailability = mentor.availability?.find(
      (a) => a.dayOfWeek === dayOfWeek
    );

    if (!mentorAvailability || !mentorAvailability.isAvailable) {
      return badRequest(res, "Mentor is not available on this day");
    }

    const availabilityStart = new Date(mentorAvailability.startTime);
    const availabilityEnd = new Date(mentorAvailability.endTime);

    if (
      hour < availabilityStart.getHours() ||
      hour >= availabilityEnd.getHours()
    ) {
      return badRequest(
        res,
        "Session time is outside mentor's available hours"
      );
    }

    // Create session
    const session = await Session.create({
      title: `${topic} Session`,
      description: requestNotes || `Session on ${topic}`,
      mentorId,
      studentId: student._id,
      startTime,
      endTime,
      subject: topic,
      studentChoice,
      requestNotes,
      status: "requested",
    });

    // Populate mentor and student details for response
    const populatedSession = await Session.findById(session._id)
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

    success(
      res,
      populatedSession,
      "Session booking request created successfully",
      201
    );
  } catch (error) {
    handleError(res, error, "book session");
  }
};
