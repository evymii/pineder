import { z } from 'zod';

// Base schemas
export const emailSchema = z.string().email('Invalid email format');
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');
export const dateSchema = z.string().datetime().or(z.date());

// User schemas
export const createUserSchema = z.object({
  email: emailSchema,
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  role: z.enum(['student', 'mentor', 'admin']).default('student'),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
  location: z.string().max(100, 'Location too long').optional(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number').optional(),
  dateOfBirth: dateSchema.optional(),
  preferences: z.object({
    notifications: z.boolean().default(true),
    emailUpdates: z.boolean().default(true),
    language: z.string().default('en')
  }).optional()
});

export const updateUserSchema = createUserSchema.partial();

// Avatar update schema
export const updateAvatarSchema = z.object({
  avatarUrl: z.string().url('Invalid avatar URL'),
  avatarPublicId: z.string().optional()
});

export const userQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default(() => 1),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default(() => 10),
  role: z.enum(['student', 'mentor', 'admin']).optional(),
  search: z.string().optional()
});

// Session schemas
export const createSessionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  startTime: dateSchema,
  duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration must be under 8 hours'),
  maxParticipants: z.number().min(1, 'Must allow at least 1 participant').max(50, 'Too many participants').optional(),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  category: z.string().min(1, 'Category is required').max(50, 'Category too long'),
  mentorId: objectIdSchema,
  meetingLink: z.string().url('Invalid meeting link').optional(),
  status: z.enum(['scheduled', 'ongoing', 'completed', 'cancelled']).default('scheduled')
});

export const updateSessionSchema = createSessionSchema.partial();

export const sessionQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default(() => 1),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default(() => 10),
  status: z.enum(['scheduled', 'ongoing', 'completed', 'cancelled']).optional(),
  category: z.string().optional(),
  mentorId: objectIdSchema.optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional()
});

// Mentor schemas
export const createMentorSchema = z.object({
  userId: objectIdSchema,
  specialties: z.array(z.string().min(1, 'Specialty cannot be empty')).min(1, 'At least one specialty required'),
  experience: z.number().min(0, 'Experience cannot be negative').max(50, 'Experience too high'),
  hourlyRate: z.number().min(0, 'Hourly rate cannot be negative'),
  bio: z.string().max(1000, 'Bio too long').optional(),
  education: z.array(z.object({
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    year: z.number().min(1900, 'Invalid year').max(new Date().getFullYear(), 'Year cannot be in the future')
  })).optional(),
  certifications: z.array(z.string()).optional(),
  availability: z.array(z.object({
    day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
  })).optional()
});

export const updateMentorSchema = createMentorSchema.partial();

// Student schemas
export const createStudentSchema = z.object({
  userId: objectIdSchema,
  grade: z.number().min(1, 'Grade must be at least 1').max(12, 'Grade cannot exceed 12').optional(),
  interests: z.array(z.string().min(1, 'Interest cannot be empty')).optional(),
  goals: z.string().max(500, 'Goals too long').optional(),
  parentEmail: emailSchema.optional(),
  emergencyContact: z.object({
    name: z.string().min(1, 'Contact name is required'),
    phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number'),
    relationship: z.string().min(1, 'Relationship is required')
  }).optional()
});

export const updateStudentSchema = createStudentSchema.partial();

// Community schemas
export const createCommunitySchema = z.object({
  name: z.string().min(1, 'Community name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  category: z.string().min(1, 'Category is required').max(50, 'Category too long'),
  isPrivate: z.boolean().default(false),
  maxMembers: z.number().min(1, 'Must allow at least 1 member').max(1000, 'Too many members').optional(),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).max(10, 'Too many tags').optional()
});

export const updateCommunitySchema = createCommunitySchema.partial();

// Post schemas
export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
  communityId: objectIdSchema,
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).max(10, 'Too many tags').optional(),
  isPinned: z.boolean().default(false)
});

export const updatePostSchema = createPostSchema.partial();

// Comment schemas
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(1000, 'Comment too long'),
  postId: objectIdSchema,
  parentCommentId: objectIdSchema.optional()
});

export const updateCommentSchema = createCommentSchema.partial();

// Payment schemas
export const createPaymentSchema = z.object({
  sessionId: objectIdSchema,
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.enum(['USD', 'MNT']).default('MNT'),
  paymentMethod: z.enum(['card', 'bank_transfer', 'cash']),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']).default('pending')
});

export const updatePaymentSchema = createPaymentSchema.partial();

// Group Session schemas
export const createGroupSessionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  startTime: dateSchema,
  duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration must be under 8 hours'),
  maxParticipants: z.number().min(2, 'Group sessions need at least 2 participants').max(20, 'Too many participants'),
  category: z.string().min(1, 'Category is required').max(50, 'Category too long'),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  meetingLink: z.string().url('Invalid meeting link').optional(),
  topics: z.array(z.string().min(1, 'Topic cannot be empty')).min(1, 'At least one topic required')
});

export const updateGroupSessionSchema = createGroupSessionSchema.partial();

// Generic query schemas
export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default(() => 1),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default(() => 10)
});

export const searchSchema = z.object({
  search: z.string().min(1, 'Search term is required').max(100, 'Search term too long'),
  ...paginationSchema.shape
});

// Export types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type CreateMentorInput = z.infer<typeof createMentorSchema>;
export type UpdateMentorInput = z.infer<typeof updateMentorSchema>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
export type UpdateCommunityInput = z.infer<typeof updateCommunitySchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type CreateGroupSessionInput = z.infer<typeof createGroupSessionSchema>;
export type UpdateGroupSessionInput = z.infer<typeof updateGroupSessionSchema>;
