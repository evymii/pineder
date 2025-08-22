import { Response } from "express";
import Session from "../../models/Session";
import Mentor from "../../models/Mentor";
import { AuthRequest } from "../../middleware/auth";
import { ZoomService } from "../../services/zoomService";
import { 
  sendSuccess, 
  sendError, 
  sendUnauthorized, 
  sendNotFound, 
  sendBadRequest,
  sendForbidden,
  validateRole 
} from "../../utils/responseHelpers";

export const getPendingSessions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendUnauthorized(res);
    if (!validateRole(req.user.role, "mentor")) {
      return sendForbidden(res);
    }

    const mentor = await Mentor.findOne({ userId: req.user.dbId });
    if (!mentor) return sendNotFound(res, "Mentor");

    const sessions = await Session.find({
      mentorId: mentor._id,
      status: "requested",
    })
      .populate("studentId", "grade subjects")
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .sort({ createdAt: -1 });

    sendSuccess(res, sessions);
  } catch (error) {
    sendError(res, "Failed to fetch pending sessions");
  }
};

export const approveSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendUnauthorized(res);
    if (!validateRole(req.user.role, "mentor")) {
      return sendForbidden(res);
    }

    const { sessionId } = req.params;
    const mentor = await Mentor.findOne({ userId: req.user.dbId });
    if (!mentor) return sendNotFound(res, "Mentor");

    const session = await Session.findOne({
      _id: sessionId,
      mentorId: mentor._id,
    });
    if (!session) return sendNotFound(res, "Session");

    if (session.status !== "requested") {
      return sendBadRequest(res, "Can only approve requested sessions");
    }

    // Check for time conflicts
    const conflictingSession = await Session.findOne({
      mentorId: mentor._id,
      _id: { $ne: session._id },
      startTime: { $lt: session.endTime },
      endTime: { $gt: session.startTime },
      status: { $in: ["requested", "approved", "scheduled", "active"] },
    });

    if (conflictingSession) {
      return sendBadRequest(res, "Time slot conflicts with another session");
    }

    // Create Zoom meeting
    try {
      const duration = Math.ceil(
        (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60)
      );

      const meetingData = await ZoomService.createMeeting({
        topic: `${session.subject} - ${session.title}`,
        startTime: session.startTime,
        duration: duration,
        timezone: "UTC",
      });

      // Update session with Zoom meeting info
      session.zoomMeetingId = meetingData.id;
      session.zoomJoinUrl = meetingData.join_url;
      session.zoomStartUrl = meetingData.start_url;
      session.zoomPassword = meetingData.password;
      session.meetingProvider = "zoom";

      console.log("Zoom meeting created for approved session", {
        sessionId: session._id,
        meetingId: meetingData.id,
      });
    } catch (zoomError) {
      console.error(
        "Failed to create Zoom meeting, using simple link:",
        zoomError
      );

      // Fallback to simple meeting link
      const simpleMeeting = ZoomService.generateSimpleMeetingLink(
        session.title,
        session.startTime
      );

      session.zoomMeetingId = simpleMeeting.id;
      session.zoomJoinUrl = simpleMeeting.join_url;
      session.zoomStartUrl = simpleMeeting.start_url;
      session.zoomPassword = simpleMeeting.password;
      session.meetingProvider = "simple";
    }

    session.status = "approved";
    session.approvedAt = new Date();
    await session.save();

    sendSuccess(
      res,
      session,
      "Session approved successfully with meeting link created"
    );
  } catch (error) {
    sendError(res, "Failed to approve session");
  }
};

export const rejectSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendUnauthorized(res);
    if (!validateRole(req.user.role, "mentor")) {
      return sendForbidden(res);
    }

    const { sessionId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return sendBadRequest(res, "Rejection reason is required");
    }

    const mentor = await Mentor.findOne({ userId: req.user.dbId });
    if (!mentor) return sendNotFound(res, "Mentor");

    const session = await Session.findOne({
      _id: sessionId,
      mentorId: mentor._id,
    });
    if (!session) return sendNotFound(res, "Session");

    if (session.status !== "requested") {
      return sendBadRequest(res, "Can only reject requested sessions");
    }

    session.status = "rejected";
    session.rejectionReason = rejectionReason;
    session.rejectedAt = new Date();
    await session.save();

    sendSuccess(res, session, "Session rejected successfully");
  } catch (error) {
    sendError(res, "Failed to reject session");
  }
};

export const getMentorSessions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendUnauthorized(res);
    if (!validateRole(req.user.role, "mentor")) {
      return sendForbidden(res);
    }

    const mentor = await Mentor.findOne({ userId: req.user.dbId });
    if (!mentor) return sendNotFound(res, "Mentor");

    const { status } = req.query;
    const filter: any = { mentorId: mentor._id };

    if (status) {
      filter.status = status;
    }

    const sessions = await Session.find(filter)
      .populate("studentId", "grade subjects")
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .sort({ startTime: -1 });

    sendSuccess(res, sessions);
  } catch (error) {
    sendError(res, "Failed to fetch mentor sessions");
  }
};
