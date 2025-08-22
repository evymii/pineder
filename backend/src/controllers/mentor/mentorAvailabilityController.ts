import { Response } from "express";
import Mentor from "../../models/Mentor";
import User from "../../models/User";
import { logger } from "../../utils/logger";
import { sendSuccess, sendError } from "../../utils/helpers";
import { AuthRequest } from "../../middleware/auth";

/**
 * Get mentor availability
 * GET /api/mentors/availability
 */
export const getMentorAvailability = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    console.log("=== GET MENTOR AVAILABILITY DEBUG ===");
    console.log("Request user:", req.user);

    const { user: authUser } = req;

    if (!authUser) {
      return sendError(res, "User not authenticated", 401);
    }

    if (authUser.role !== "mentor") {
      return sendError(res, "Only mentors can view availability", 403);
    }

    // Try to find mentor directly by email first
    console.log("Looking for mentor with email:", authUser.email);
    const mentor = await Mentor.findOne().populate({
      path: 'userId',
      match: { email: authUser.email }
    });

    if (!mentor) {
      console.log("Mentor not found, trying alternative approach");
      // Alternative: find user first, then mentor
      const dbUser = await User.findOne({ email: authUser.email });
      if (!dbUser) {
        return sendError(res, "User not found", 404);
      }
      
      const mentorByUserId = await Mentor.findOne({ userId: dbUser._id });
      if (!mentorByUserId) {
        return sendError(res, "Mentor profile not found", 404);
      }
      
      console.log("Found mentor profile:", mentorByUserId._id);
      return sendSuccess(res, {
        availability: mentorByUserId.availability || [],
      });
    }

    console.log("Found mentor profile:", mentor._id);
    return sendSuccess(res, {
      availability: mentor.availability || [],
    });
  } catch (error) {
    console.error("Error getting mentor availability:", error);
    return sendError(res, "Failed to get mentor profile", 500);
  }
};

/**
 * Update mentor availability
 * PUT /api/mentors/availability
 */
export const updateMentorAvailability = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    console.log("=== UPDATE MENTOR AVAILABILITY DEBUG ===");
    console.log("Request body:", req.body);
    console.log("Request user:", req.user);

    const { user: authUser } = req;

    if (!authUser) {
      return sendError(res, "User not authenticated", 401);
    }

    if (authUser.role !== "mentor") {
      return sendError(res, "Only mentors can update availability", 403);
    }

    const { availability } = req.body;

    if (!availability || !Array.isArray(availability)) {
      return sendError(res, "Availability data is required", 400);
    }

    console.log("Looking for user with email:", authUser.email);
    const dbUser = await User.findOne({ email: authUser.email });
    if (!dbUser) {
      return sendError(res, "User not found", 404);
    }

    console.log("Looking for mentor with userId:", dbUser._id);
    const mentor = await Mentor.findOne({ userId: dbUser._id });
    if (!mentor) {
      return sendError(res, "Mentor profile not found", 404);
    }

    console.log("Updating mentor availability:", availability);
    const updatedMentor = await Mentor.findByIdAndUpdate(
      mentor._id,
      { availability },
      { new: true, runValidators: true }
    );

    console.log("Availability updated successfully");
    return sendSuccess(
      res,
      { availability: updatedMentor?.availability },
      "Availability updated successfully"
    );
  } catch (error) {
    console.error("Error updating mentor availability:", error);
    console.error("Error stack:", (error as Error).stack);
    console.error("Error message:", (error as Error).message);
    return sendError(res, "Failed to update availability", 500);
  }
};
