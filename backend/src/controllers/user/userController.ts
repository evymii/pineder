import { Request, Response } from "express";
import { Document } from "mongoose";
import User, { IUser } from "../../models/User";
import Mentor from "../../models/Mentor";
import Student from "../../models/Student";
import { AuthRequest } from "../../middleware/auth";

const handleError = (res: Response, error: unknown, message: string) => {
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

const success = <T>(
  res: Response,
  data?: T,
  message?: string,
  status = 200
) => {
  const response: { success: true; data?: T; message?: string } = {
    success: true,
  };
  if (data !== undefined) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

const createRoleProfile = async (
  role: string,
  userId: string,
  bio?: string
) => {
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

    await createRoleProfile(req.user.role, (user._id as string), bio);

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

const verifyOwnership = (
  user: Document<unknown, {}, IUser> & IUser,
  userId: string
) => user._id?.toString() === userId;

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

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    return badRequest(res, "File upload functionality is currently disabled");
  } catch (error) {
    handleError(res, error, "upload avatar");
  }
};
