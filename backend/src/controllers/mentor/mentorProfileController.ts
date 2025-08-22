import { Response } from "express";
import Mentor from "../../models/Mentor";
import User from "../../models/User";
import { logger } from "../../utils/logger";
import { sendSuccess, sendError } from "../../utils/helpers";
import { AuthRequest } from "../../middleware/auth";

/**
 * Create mentor profile
 * POST /api/mentors
 */
export const createMentorProfile = async (req: AuthRequest, res: Response) => {
  try {
    console.log("=== CREATE MENTOR PROFILE DEBUG ===");
    console.log("Request body:", req.body);
    console.log("Request user:", req.user);

    const { user: authUser } = req;

    if (!authUser) {
      return sendError(res, "User not authenticated", 401);
    }

    if (authUser.role !== "mentor") {
      return sendError(res, "Only mentors can create mentor profiles", 403);
    }

    console.log("Looking for user with email:", authUser.email);
    let dbUser = await User.findOne({ email: authUser.email });
    console.log("Found existing user:", dbUser ? "YES" : "NO");

    if (!dbUser) {
      console.log("Creating new user...");
      try {
        dbUser = await User.create({
          email: authUser.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          role: "mentor",
          bio: req.body.bio,
          title: req.body.title,
          avatar: req.body.avatar,
          backgroundImage: req.body.backgroundImage,
          profileCompleted: true,
        });
        console.log("Created user successfully:", dbUser._id);
      } catch (userError) {
        console.error("Failed to create user:", userError);
        throw userError;
      }
    } else {
      console.log("Updating existing user...");
      const userUpdates: any = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        title: req.body.title,
        bio: req.body.bio,
        avatar: req.body.avatar,
        backgroundImage: req.body.backgroundImage,
        profileCompleted: true,
      };
      dbUser = await User.findByIdAndUpdate(dbUser._id, userUpdates, {
        new: true,
        runValidators: true,
      });
      console.log("Updated user:", dbUser?._id);
    }

    // Check if mentor profile already exists
    const existingMentor = await Mentor.findOne({ userId: dbUser!._id });
    if (existingMentor) {
      console.log("Mentor profile already exists, updating...");
      // Update existing mentor profile
      const mentorUpdates = {
        specialties: req.body.specialties || [],
        bio: req.body.bio,
        mentorType: req.body.mentorType || "Software Engineer",
      };
      const updatedMentor = await Mentor.findByIdAndUpdate(
        existingMentor._id,
        mentorUpdates,
        { new: true, runValidators: true }
      );
      console.log("Updated existing mentor:", updatedMentor?._id);
      return sendSuccess(
        res,
        { user: dbUser, mentor: updatedMentor },
        "Mentor profile updated successfully"
      );
    }

    // Create new mentor profile
    console.log("Creating new mentor profile...");
    const mentorData = {
      userId: dbUser!._id,
      specialties: req.body.specialties || ["General"], // Provide default value
      bio: req.body.bio,
      experience: 1, // Default value
      hourlyRate: 50, // Default value
      mentorType: req.body.mentorType || "Software Engineer", // Add mentor type
      availability: [],
      subjects: ["General"], // Provide default value
      education: [],
      certifications: [],
      languages: ["English"],
      timezone: "UTC",
      isVerified: false,
      totalSessions: 0,
      totalStudents: 0,
      rating: 0,
    };

    console.log("Mentor data to create:", mentorData);
    const mentor = await Mentor.create(mentorData);
    console.log("Created mentor successfully:", mentor._id);

    console.log("Sending success response...");
    return sendSuccess(
      res,
      { user: dbUser, mentor },
      "Mentor profile created successfully"
    );
  } catch (error) {
    console.error("Error creating mentor profile:", error);
    console.error("Error stack:", (error as Error).stack);
    console.error("Error message:", (error as Error).message);
    return sendError(res, "Failed to create mentor profile", 500);
  }
};

/**
 * Get mentor profile
 * GET /api/mentors/profile
 */
export const getMentorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;

    if (!user) {
      return sendError(res, "User not authenticated", 401);
    }

    const mentor = await Mentor.findOne({ userId: user.dbId }).populate(
      "userId"
    );

    if (!mentor) {
      return sendError(res, "Mentor profile not found", 404);
    }

    return sendSuccess(res, mentor, "Mentor profile retrieved successfully");
  } catch (error) {
    logger.error("Get mentor profile failed", { error });
    return sendError(res, "Failed to get mentor profile", 500);
  }
};

/**
 * Update mentor profile
 * PUT /api/mentors/profile
 */
export const updateMentorProfile = async (req: AuthRequest, res: Response) => {
  try {
    console.log("=== UPDATE MENTOR PROFILE DEBUG ===");
    console.log("Request body:", req.body);
    console.log("Request user:", req.user);

    const { user: authUser } = req;

    if (!authUser) {
      return sendError(res, "User not authenticated", 401);
    }

    if (authUser.role !== "mentor") {
      return sendError(res, "Only mentors can update mentor profiles", 403);
    }

    const {
      firstName,
      lastName,
      title,
      bio,
      avatar,
      backgroundImage,
      specialties,
      mentorType,
    } = req.body;

    console.log("Looking for user with email:", authUser.email);
    const dbUser = await User.findOne({ email: authUser.email });
    if (!dbUser) {
      return sendError(res, "User not found", 404);
    }

    // Update user profile
    const userUpdates: any = {};
    if (firstName) userUpdates.firstName = firstName;
    if (lastName) userUpdates.lastName = lastName;
    if (title) userUpdates.title = title;
    if (bio !== undefined) userUpdates.bio = bio;
    if (avatar) userUpdates.avatar = avatar;
    if (backgroundImage) userUpdates.backgroundImage = backgroundImage;
    userUpdates.profileCompleted = true;

    console.log("User updates:", userUpdates);
    const updatedUser = await User.findByIdAndUpdate(dbUser._id, userUpdates, {
      new: true,
      runValidators: true,
    });

    // Update mentor profile
    const mentor = await Mentor.findOne({ userId: dbUser._id });
    if (mentor) {
      const mentorUpdates: any = {};
      if (specialties) mentorUpdates.specialties = specialties;
      if (bio !== undefined) mentorUpdates.bio = bio;
      if (mentorType) mentorUpdates.mentorType = mentorType;

      console.log("Mentor updates:", mentorUpdates);
      await Mentor.findByIdAndUpdate(mentor._id, mentorUpdates, {
        new: true,
        runValidators: true,
      });
    }

    console.log("Profile updated successfully");
    return sendSuccess(res, updatedUser, "Mentor profile updated successfully");
  } catch (error) {
    console.error("Error updating mentor profile:", error);
    console.error("Error stack:", (error as Error).stack);
    console.error("Error message:", (error as Error).message);
    return sendError(res, "Failed to update mentor profile", 500);
  }
};
