import { Request, Response } from "express";
import Session from "../../models/Session";
import Mentor from "../../models/Mentor";
import Student from "../../models/Student";
import TeacherAvailability from "../../models/TeacherAvailability";
import { AuthRequest } from "../../middleware/auth";
import zoomService from "../../services/zoomService";

// Create new session (booking)
export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Only students can book sessions
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        error: "Only students can book sessions",
      });
    }

    const sessionData = req.body;

    const mentor = await Mentor.findById(sessionData.mentorId);
    const student = await Student.findOne({ userId: req.user.id });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        error: "Mentor not found",
      });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student profile not found",
      });
    }

    const teacherAvailability = await TeacherAvailability.findOne({
      mentorId: sessionData.mentorId,
    });
    if (!teacherAvailability || !teacherAvailability.isActive) {
      return res.status(400).json({
        success: false,
        error: "Teacher is not available for sessions",
      });
    }

    const sessionStartTime = new Date(sessionData.startTime);
    const sessionEndTime = new Date(sessionData.endTime);
    const dayOfWeek = sessionStartTime.getDay();

    const weeklySlot = teacherAvailability.weeklySchedule.find(
      (slot) => slot.dayOfWeek === dayOfWeek && slot.isAvailable
    );

    if (!weeklySlot) {
      return res.status(400).json({
        success: false,
        error: "Teacher is not available on this day of the week",
      });
    }

    const sessionStartHour = sessionStartTime.getHours();
    const sessionStartMinute = sessionStartTime.getMinutes();
    const sessionEndHour = sessionEndTime.getHours();
    const sessionEndMinute = sessionEndTime.getMinutes();

    const [slotStartHour, slotStartMinute] = weeklySlot.startTime
      .split(":")
      .map(Number);
    const [slotEndHour, slotEndMinute] = weeklySlot.endTime
      .split(":")
      .map(Number);

    const sessionStartMinutes = sessionStartHour * 60 + sessionStartMinute;
    const sessionEndMinutes = sessionEndHour * 60 + sessionEndMinute;
    const slotStartMinutes = slotStartHour * 60 + slotStartMinute;
    const slotEndMinutes = slotEndHour * 60 + slotEndMinute;

    if (
      sessionStartMinutes < slotStartMinutes ||
      sessionEndMinutes > slotEndMinutes
    ) {
      return res.status(400).json({
        success: false,
        error: "Session time is outside teacher's available hours",
      });
    }

    const conflictingSession = await Session.findOne({
      mentorId: sessionData.mentorId,
      startTime: { $lt: sessionData.endTime },
      endTime: { $gt: sessionData.startTime },
      status: { $in: ["requested", "approved", "scheduled", "active"] },
    });

    if (conflictingSession) {
      return res.status(400).json({
        success: false,
        error: "Time slot conflicts with existing session",
      });
    }

    // Generate Zoom meeting link for the session
    const meetingLink = zoomService.generateSimpleMeetingLink(
      sessionData.mentorId + sessionData.startTime,
      undefined // Auto-generate password
    );

    const session = new Session({
      ...sessionData,
      studentId: student._id,
      status: "requested",
      meetingLink: meetingLink,
    });

    await session.save();

    res.status(201).json({
      success: true,
      data: session,
      message: "Session requested successfully. Meeting link will be shared upon approval.",
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create session",
    });
  }
};
