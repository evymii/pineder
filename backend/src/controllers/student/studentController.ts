import { Request, Response } from "express";
import Student from "../../models/Student";
import User from "../../models/User";
import Session from "../../models/Session";

// Get all students with basic filtering
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, grade, subject } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (grade) filter.grade = grade;
    if (subject) filter.subjects = { $in: [subject] };

    const students = await Student.find(filter)
      .populate("userId", "firstName lastName email avatar")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(filter);

    res.json({
      success: true,
      data: students,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch students",
    });
  }
};

// Get student by ID
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "userId",
      "firstName lastName email avatar bio"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch student",
    });
  }
};

// Create new student profile
export const createStudent = async (req: Request, res: Response) => {
  try {
    const studentData = req.body;
    const student = await Student.create(studentData);

    const populatedStudent = await Student.findById(student._id).populate(
      "userId",
      "firstName lastName email"
    );

    res.status(201).json({
      success: true,
      data: populatedStudent,
      message: "Student profile created successfully",
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create student profile",
    });
  }
};

// Update student profile
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("userId", "firstName lastName email");

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
      message: "Student profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update student profile",
    });
  }
};

// Delete student profile
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete student profile",
    });
  }
};

// Get student's sessions
export const getStudentSessions = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { studentId: req.params.id };
    if (status) filter.status = status;

    const sessions = await Session.find(filter)
      .populate("mentorId", "firstName lastName")
      .skip(skip)
      .limit(Number(limit))
      .sort({ startTime: -1 });

    const total = await Session.countDocuments(filter);

    res.json({
      success: true,
      data: sessions,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Error fetching student sessions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch student sessions",
    });
  }
};
