import { Response } from "express";
import User from "../../models/User";
import Student from "../../models/Student";
import { AuthRequest } from "../../middleware/auth";
import {
  sendSuccess,
  sendError,
  sendUnauthorized,
  sendNotFound,
  sendBadRequest,
  sendForbidden,
  validateRequiredFields,
  validateRole,
} from "../../utils/responseHelpers";

// GET - Get student profile
export const getStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendUnauthorized(res);
    if (!validateRole(req.user.role, "student")) {
      return sendForbidden(res);
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return sendNotFound(res, "User");

    const student = await Student.findOne({ userId: user._id });
    if (!student) return sendNotFound(res, "Student profile");

    // Combine user and student data
    const profile = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      phone: user.phone,
      studentCode: user.studentCode,
      major: user.major,
      links: user.links,
      grade: student.grade,
      subjects: student.subjects,
      goals: student.goals,
      totalSessions: student.totalSessions,
      totalMentors: student.totalMentors,
      averageRating: student.averageRating,
      profileCompleted: user.profileCompleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    sendSuccess(res, profile);
  } catch (error) {
    sendError(res, "Failed to fetch student profile");
  }
};

// POST - Create/Update student profile
export const createStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    console.log("=== CREATE STUDENT PROFILE DEBUG ===");
    console.log("Request body:", req.body);
    console.log("Request user:", req.user);

    if (!req.user) return sendUnauthorized(res);
    if (!validateRole(req.user.role, "student")) {
      return sendForbidden(res);
    }

    const {
      firstName,
      lastName,
      bio,
      studentCode,
      major,
      avatar,
      backgroundImage,
      grade,
      subjects,
      goals,
    } = req.body;

    // Validate required fields
    const missingField = validateRequiredFields(req.body, [
      "firstName",
      "lastName",
      "major",
      "studentCode",
    ]);
    if (missingField) {
      return sendBadRequest(res, missingField);
    }

    console.log("Looking for user with email:", req.user.email);
    let user = await User.findOne({ email: req.user.email });
    console.log("Found existing user:", user ? "YES" : "NO");

    if (!user) {
      console.log("Creating new user...");
      // Create new user if doesn't exist
      try {
        user = await User.create({
          email: req.user.email,
          firstName,
          lastName,
          role: "student",
          bio,
          studentCode,
          major,
          avatar,
          backgroundImage,
          profileCompleted: true,
        });
        console.log("Created user successfully:", user._id);
      } catch (userError) {
        console.error("Failed to create user:", userError);
        throw userError;
      }
    } else {
      console.log("Updating existing user...");
      // Update existing user profile
      const userUpdates: any = {
        firstName,
        lastName,
        bio,
        studentCode,
        major,
        avatar,
        backgroundImage,
        profileCompleted: true,
      };

      user = await User.findByIdAndUpdate(user._id, userUpdates, {
        new: true,
        runValidators: true,
      });
      console.log("Updated user:", user?._id);
    }

    // Create or update student profile
    console.log("Creating/updating student profile...");
    const studentUpdates: any = {
      grade: grade || "Beginner",
      subjects: subjects || [],
      goals: goals || [],
    };
    console.log("Student updates:", studentUpdates);

    let student = await Student.findOne({ userId: user!._id });
    console.log("Found existing student:", student ? "YES" : "NO");

    if (student) {
      console.log("Updating existing student...");
      student = await Student.findByIdAndUpdate(student._id, studentUpdates, {
        new: true,
        runValidators: true,
      });
      console.log("Updated student:", student?._id);
    } else {
      console.log("Creating new student...");
      console.log("User ID for student creation:", user!._id);
      console.log("User ID type:", typeof user!._id);
      try {
        student = await Student.create({
          userId: user!._id, // Use MongoDB ObjectId, not Clerk user ID
          ...studentUpdates,
        });
        console.log("Created student successfully:", student._id);
      } catch (studentError) {
        console.error("Failed to create student:", studentError);
        throw studentError;
      }
    }

    sendSuccess(
      res,
      { user: user, student },
      "Student profile created successfully",
      201
    );
  } catch (error) {
    console.error("Error creating student profile:", error);
    console.error("Error stack:", (error as Error).stack);
    console.error("Error message:", (error as Error).message);
    sendError(res, "Failed to create student profile");
  }
};

// PUT - Update student profile
export const updateStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendUnauthorized(res);
    if (!validateRole(req.user.role, "student")) {
      return sendForbidden(res);
    }

    const {
      firstName,
      lastName,
      bio,
      studentCode,
      major,
      avatar,
      backgroundImage,
      grade,
      subjects,
      goals,
    } = req.body;

    const user = await User.findOne({ email: req.user.email });
    if (!user) return sendNotFound(res, "User");

    // Update user profile
    const userUpdates: any = {};
    if (firstName) userUpdates.firstName = firstName;
    if (lastName) userUpdates.lastName = lastName;
    if (bio !== undefined) userUpdates.bio = bio;
    if (studentCode) userUpdates.studentCode = studentCode;
    if (major) userUpdates.major = major;
    if (avatar) userUpdates.avatar = avatar;
    if (backgroundImage) userUpdates.backgroundImage = backgroundImage;
    userUpdates.profileCompleted = true;

    const updatedUser = await User.findByIdAndUpdate(user._id, userUpdates, {
      new: true,
      runValidators: true,
    });

    // Update student profile
    const student = await Student.findOne({ userId: user._id });
    if (student) {
      const studentUpdates: any = {};
      if (grade) studentUpdates.grade = grade;
      if (subjects) studentUpdates.subjects = subjects;
      if (goals) studentUpdates.goals = goals;

      await Student.findByIdAndUpdate(student._id, studentUpdates, {
        new: true,
        runValidators: true,
      });
    }

    sendSuccess(res, updatedUser, "Student profile updated successfully");
  } catch (error) {
    sendError(res, "Failed to update student profile");
  }
};
