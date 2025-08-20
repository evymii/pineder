import { Request, Response } from "express";
import Mentor from "../../models/Mentor";
import User from "../../models/User";

// Get all mentors with basic filtering
export const getAllMentors = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 12, subject, rating } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (subject) filter.subjects = { $in: [subject] };
    if (rating) filter.rating = { $gte: Number(rating) };

    const mentors = await Mentor.find(filter)
      .populate("userId", "firstName lastName email avatar")
      .skip(skip)
      .limit(Number(limit))
      .sort({ rating: -1 });

    const total = await Mentor.countDocuments(filter);

    res.json({
      success: true,
      data: mentors,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch mentors",
    });
  }
};

// Get mentor by ID
export const getMentorById = async (req: Request, res: Response) => {
  try {
    const mentor = await Mentor.findById(req.params.id).populate(
      "userId",
      "firstName lastName email avatar bio"
    );

    if (!mentor) {
      return res.status(404).json({
        success: false,
        error: "Mentor not found",
      });
    }

    res.json({
      success: true,
      data: mentor,
    });
  } catch (error) {
    console.error("Error fetching mentor:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch mentor",
    });
  }
};

// Get mentor by user ID
export const getMentorByUserId = async (req: Request, res: Response) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.params.userId }).populate(
      "userId",
      "firstName lastName email avatar bio"
    );

    if (!mentor) {
      return res.status(404).json({
        success: false,
        error: "Mentor not found",
      });
    }

    res.json({
      success: true,
      data: mentor,
    });
  } catch (error) {
    console.error("Error fetching mentor by user ID:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch mentor",
    });
  }
};

// Create new mentor profile
export const createMentor = async (req: Request, res: Response) => {
  try {
    const mentorData = req.body;
    const mentor = await Mentor.create(mentorData);

    const populatedMentor = await Mentor.findById(mentor._id).populate(
      "userId",
      "firstName lastName email"
    );

    res.status(201).json({
      success: true,
      data: populatedMentor,
      message: "Mentor profile created successfully",
    });
  } catch (error) {
    console.error("Error creating mentor:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create mentor profile",
    });
  }
};

// Update mentor profile
export const updateMentor = async (req: Request, res: Response) => {
  try {
    const mentor = await Mentor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("userId", "firstName lastName email");

    if (!mentor) {
      return res.status(404).json({
        success: false,
        error: "Mentor not found",
      });
    }

    res.json({
      success: true,
      data: mentor,
      message: "Mentor profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating mentor:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update mentor profile",
    });
  }
};

// Delete mentor profile
export const deleteMentor = async (req: Request, res: Response) => {
  try {
    const mentor = await Mentor.findByIdAndDelete(req.params.id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        error: "Mentor not found",
      });
    }

    res.json({
      success: true,
      message: "Mentor profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting mentor:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete mentor profile",
    });
  }
};

// Search mentors by query
export const searchMentors = async (req: Request, res: Response) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const mentors = await Mentor.find({
      $or: [
        { bio: { $regex: query, $options: "i" } },
        { specialties: { $in: [new RegExp(query as string, "i")] } },
        { subjects: { $in: [new RegExp(query as string, "i")] } },
      ],
    })
      .populate("userId", "firstName lastName avatar")
      .limit(Number(limit))
      .sort({ rating: -1 });

    res.json({
      success: true,
      data: mentors,
      total: mentors.length,
    });
  } catch (error) {
    console.error("Error searching mentors:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search mentors",
    });
  }
};
