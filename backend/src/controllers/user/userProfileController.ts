import { Request, Response } from "express";
import User from "../../models/User";
import Mentor from "../../models/Mentor";
import Student from "../../models/Student";
import { AuthRequest } from "../../middleware/auth";

// Get user profile with role-specific data
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const user = await User.findById(req.user.id).select("-__v");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Get corresponding profile data
    let profileData = {};
    if (user.role === "mentor") {
      const mentorProfile = await Mentor.findOne({ userId: user._id });
      profileData = { mentorProfile };
    } else if (user.role === "student") {
      const studentProfile = await Student.findOne({ userId: user._id });
      profileData = { studentProfile };
    }

    res.json({
      success: true,
      data: {
        user,
        ...profileData,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user profile",
    });
  }
};

// Get user settings
export const getUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const user = await User.findById(req.user.id).select("preferences");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user.preferences,
    });
  } catch (error) {
    console.error("Error fetching user settings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user settings",
    });
  }
};

// Update user profile
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...updates, profileCompleted: true },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user profile",
    });
  }
};

// Update user settings
export const updateUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const { preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user.preferences,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user settings",
    });
  }
};
