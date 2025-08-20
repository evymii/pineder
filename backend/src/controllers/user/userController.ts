import { Request, Response } from "express";
import User from "../../models/User";
import Mentor from "../../models/Mentor";
import Student from "../../models/Student";
import { AuthRequest } from "../../middleware/auth";
import CloudinaryService from "../../services/cloudinaryService";

const handleError = (res: Response, error: any, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ success: false, error: `Failed to ${message}` });
};

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, error: "Authentication required" });

const notFound = (res: Response, resource: string) =>
  res.status(404).json({ success: false, error: `${resource} not found` });

const forbidden = (res: Response, message: string) =>
  res.status(403).json({ success: false, error: message });

const badRequest = (res: Response, message: string) =>
  res.status(400).json({ success: false, error: message });

const success = (res: Response, data?: any, message?: string, status = 200) => {
  const response: any = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

const createRoleProfile = async (role: string, userId: any, bio?: string) => {
  const profiles = {
    mentor: () =>
      Mentor.create({
        userId,
        specialties: [],
        bio: bio || "Passionate about teaching and sharing knowledge",
        experience: 0,
        rating: 0,
        hourlyRate: 50,
        availability: [],
        subjects: [],
        education: [],
        certifications: [],
        languages: ["English"],
        timezone: "UTC",
        isVerified: false,
        totalSessions: 0,
        totalStudents: 0,
      }),
    student: () =>
      Student.create({
        userId,
        grade: "Beginner",
        subjects: [],
        goals: [],
      }),
  };

  return profiles[role as keyof typeof profiles]?.();
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { firstName, lastName, bio, location, phone, dateOfBirth } = req.body;

    const existingUser = await User.findOne({ email: req.user.email });
    if (existingUser) return badRequest(res, "User already exists");

    const user = await User.create({
      email: req.user.email,
      firstName,
      lastName,
      role: req.user.role,
      bio,
      location,
      phone,
      dateOfBirth,
      profileCompleted: !!(firstName && lastName && bio),
      preferences: { notifications: true, emailUpdates: true, language: "en" },
    });

    await createRoleProfile(req.user.role, user._id, bio);

    success(res, user, "User created successfully", 201);
  } catch (error) {
    handleError(res, error, "create user");
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-__v");
    res.json(users);
  } catch (error) {
    handleError(res, error, "fetch users");
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-__v");
    if (!user) return notFound(res, "User");
    success(res, user);
  } catch (error) {
    handleError(res, error, "fetch user");
  }
};

const verifyOwnership = (user: any, userId: string) =>
  user._id?.toString() === userId;

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, profileCompleted: true },
      { new: true, runValidators: true }
    );

    if (!user) return notFound(res, "User");
    if (!verifyOwnership(user, req.user.id)) {
      return forbidden(res, "Can only update your own profile");
    }

    success(res, user, "User updated successfully");
  } catch (error) {
    handleError(res, error, "update user");
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const user = await User.findById(req.params.id);
    if (!user) return notFound(res, "User");
    if (!verifyOwnership(user, req.user.id)) {
      return forbidden(res, "Can only delete your own profile");
    }

    const deletions = [
      User.findByIdAndDelete(req.params.id),
      user.role === "mentor"
        ? Mentor.findOneAndDelete({ userId: user._id })
        : Student.findOneAndDelete({ userId: user._id }),
    ];

    await Promise.all(deletions);
    success(res, null, "User deleted successfully");
  } catch (error) {
    handleError(res, error, "delete user");
  }
};

export const syncUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { firstName, lastName, avatar } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email: req.user.email });

    if (user) {
      // Update existing user with latest data from Clerk
      user = await User.findByIdAndUpdate(
        user._id,
        {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          avatar: avatar || user.avatar,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new user
      user = await User.create({
        email: req.user.email,
        firstName: firstName || "",
        lastName: lastName || "",
        role: req.user.role,
        avatar: avatar || "",
        profileCompleted: false,
        preferences: {
          notifications: true,
          emailUpdates: true,
          language: "en",
        },
      });

      // Create role-specific profile
      await createRoleProfile(req.user.role, user._id);
    }

    success(
      res,
      user,
      user ? "User synced successfully" : "User created successfully",
      201
    );
  } catch (error) {
    handleError(res, error, "sync user");
  }
};

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    if (!req.file) {
      return badRequest(res, "No image file provided");
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return notFound(res, "User");
    }

    // Upload to Cloudinary
    const uploadResult = await CloudinaryService.updateAvatar(
      req.file.buffer,
      user.avatarPublicId // This field exists in the User model now
    );

    // Update user with new avatar URL
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        avatar: uploadResult.secure_url,
        avatarPublicId: uploadResult.public_id,
      },
      { new: true }
    );

    success(
      res,
      {
        avatar: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
      "Avatar uploaded successfully"
    );
  } catch (error) {
    handleError(res, error, "upload avatar");
  }
};
