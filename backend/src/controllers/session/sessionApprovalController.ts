import { Request, Response } from "express";
import Session from "../../models/Session";
import zoomService from "../../services/zoomService";
import { AuthRequest } from "../../middleware/auth";

// Approve session (with Zoom integration)
export const approveSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Only mentors can approve sessions
    if (req.user.role !== "mentor") {
      return res.status(403).json({
        success: false,
        error: "Only mentors can approve sessions",
      });
    }

    const { id } = req.params;
    const { notes } = req.body;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    // Verify mentor is approving their own session
    if (session.mentorId?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Can only approve your own sessions",
      });
    }

    if (session.status !== "requested") {
      return res.status(400).json({
        success: false,
        error: "Only requested sessions can be approved",
      });
    }

    let meetingLink = "";
    try {
      const zoomConfig = {
        topic: `${session.subject} Session`,
        start_time: new Date(session.startTime).toISOString(),
        duration: Math.ceil(
          (new Date(session.endTime).getTime() -
            new Date(session.startTime).getTime()) /
            (1000 * 60)
        ),
        timezone: "UTC",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          mute_upon_entry: false,
          watermark: false,
          use_pmi: false,
          approval_type: 0,
          audio: "both",
          auto_recording: "none",
        },
      };

      const zoomMeeting = await zoomService.createMeeting(zoomConfig);
      meetingLink = zoomMeeting.join_url;
    } catch (zoomError) {
      console.log(
        "Zoom API failed, generating simple meeting link:",
        zoomError
      );
      meetingLink = zoomService.generateSimpleMeetingLink(
        session._id?.toString() || "temp"
      );
    }

    session.status = "approved";
    session.notes = notes;
    session.approvedAt = new Date();
    session.meetingLink = meetingLink;
    await session.save();

    res.json({
      success: true,
      data: session,
      message: "Session approved successfully",
    });
  } catch (error) {
    console.error("Error approving session:", error);
    res.status(500).json({
      success: false,
      error: "Failed to approve session",
    });
  }
};

// Reject session
export const rejectSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Only mentors can reject sessions
    if (req.user.role !== "mentor") {
      return res.status(403).json({
        success: false,
        error: "Only mentors can reject sessions",
      });
    }

    const { id } = req.params;
    const { reason } = req.body;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    // Verify mentor is rejecting their own session
    if (session.mentorId?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Can only reject your own sessions",
      });
    }

    if (session.status !== "requested") {
      return res.status(400).json({
        success: false,
        error: "Only requested sessions can be rejected",
      });
    }

    session.status = "rejected";
    session.rejectionReason = reason;
    session.rejectedAt = new Date();
    await session.save();

    res.json({
      success: true,
      data: session,
      message: "Session rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting session:", error);
    res.status(500).json({
      success: false,
      error: "Failed to reject session",
    });
  }
};
