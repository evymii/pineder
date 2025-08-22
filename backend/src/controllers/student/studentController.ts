import { Request, Response } from 'express';
import Student from '../../models/Student';
import User from '../../models/User';
import { logger } from '../../utils/logger';
import { sendSuccess, sendError } from '../../utils/helpers';
import { AuthRequest } from '../../middleware/auth';

/**
 * Create student profile
 * POST /api/students
 */
export const createStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;
    
    if (!user) {
      return sendError(res, 'User not authenticated', 401);
    }

    if (user.role !== 'student') {
      return sendError(res, 'Only students can create student profiles', 403);
    }

    // Check if student profile already exists
    const existingStudent = await Student.findOne({ userId: user.id });
    if (existingStudent) {
      return sendError(res, 'Student profile already exists', 409);
    }

    // Create student profile
    const studentData = {
      userId: user.id,
      grade: req.body.grade,
      subjects: req.body.subjects || [],
      goals: req.body.goals || [],
      learningStyle: req.body.learningStyle || 'mixed',
      timezone: req.body.timezone || 'UTC',
      parentEmail: req.body.parentEmail,
      totalSessions: 0,
      totalHours: 0,
      averageRating: 0
    };

    const student = await Student.create(studentData);

    // Update user profile as completed
    await User.findByIdAndUpdate(user.id, { profileCompleted: true });

    logger.info('Student profile created', { userId: user.id, studentId: student._id });

    return sendSuccess(res, student, 'Student profile created successfully');
  } catch (error) {
    logger.error('Create student profile failed', { error });
    return sendError(res, 'Failed to create student profile', 500);
  }
};

/**
 * Get student profile
 * GET /api/students/profile
 */
export const getStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;
    
    if (!user) {
      return sendError(res, 'User not authenticated', 401);
    }

    const student = await Student.findOne({ userId: user.id }).populate('userId');
    
    if (!student) {
      return sendError(res, 'Student profile not found', 404);
    }

    return sendSuccess(res, student, 'Student profile retrieved successfully');
  } catch (error) {
    logger.error('Get student profile failed', { error });
    return sendError(res, 'Failed to get student profile', 500);
  }
};

/**
 * Update student profile
 * PUT /api/students/profile
 */
export const updateStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;
    
    if (!user) {
      return sendError(res, 'User not authenticated', 401);
    }

    const student = await Student.findOneAndUpdate(
      { userId: user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return sendError(res, 'Student profile not found', 404);
    }

    logger.info('Student profile updated', { userId: user.id });

    return sendSuccess(res, student, 'Student profile updated successfully');
  } catch (error) {
    logger.error('Update student profile failed', { error });
    return sendError(res, 'Failed to update student profile', 500);
  }
};

/**
 * Get student by ID (public profile)
 * GET /api/students/:id
 */
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findById(id).populate('userId', 'firstName lastName email avatar bio location');
    
    if (!student) {
      return sendError(res, 'Student not found', 404);
    }

    // Return public profile data only
    const publicProfile = {
      _id: student._id,
      user: student.userId,
      grade: student.grade,
      subjects: student.subjects,
      totalSessions: student.totalSessions,
      totalHours: (student as any).totalHours || 0,
      averageRating: student.averageRating,
      createdAt: student.createdAt
    };

    return sendSuccess(res, publicProfile, 'Student profile retrieved successfully');
  } catch (error) {
    logger.error('Get student by ID failed', { error });
    return sendError(res, 'Failed to get student profile', 500);
  }
};
