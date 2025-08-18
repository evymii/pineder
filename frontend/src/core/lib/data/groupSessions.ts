export interface TopicSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentImage: string;
  topic: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  submittedAt: string;
  status: "pending" | "approved" | "enhanced" | "rejected";
  teacherNotes?: string;
  enhancedTopic?: string;
  enhancedDescription?: string;
}

export interface GroupSession {
  id: string;
  topic: TopicSubmission;
  teacherId?: string;
  teacherName?: string;
  teacherImage?: string;
  maxParticipants: number;
  currentParticipants: number;
  participants: GroupParticipant[];
  status: "planning" | "voting" | "scheduled" | "active" | "completed" | "cancelled";
  scheduledDate?: string;
  scheduledTime?: string;
  duration: number;
  meetingLink?: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupParticipant {
  id: string;
  name: string;
  image: string;
  role: "student" | "teacher" | "assistant";
  joinedAt: string;
  status: "active" | "waitlist" | "left";
}

export interface TopicVote {
  id: string;
  topicId: string;
  studentId: string;
  studentName: string;
  vote: "upvote" | "downvote";
  createdAt: string;
}

export interface GroupSessionComment {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userImage: string;
  comment: string;
  createdAt: string;
}

// Mock data for development
export const mockTopicSubmissions: TopicSubmission[] = [
  {
    id: "1",
    studentId: "student1",
    studentName: "Alex Chen",
    studentImage: "/api/placeholder/32/32",
    topic: "React Performance Optimization",
    description: "I want to learn how to make my React apps faster and more efficient. Looking for practical tips and real-world examples.",
    category: "Frontend Development",
    difficulty: "intermediate",
    submittedAt: "2024-12-01T10:00:00Z",
    status: "enhanced",
    teacherNotes: "Great topic! This is essential for production apps.",
    enhancedTopic: "Advanced React: Performance Optimization, Memoization, and Code Splitting",
    enhancedDescription: "Learn advanced techniques to optimize React applications including React.memo, useMemo, useCallback, code splitting with React.lazy, and performance monitoring tools."
  },
  {
    id: "2",
    studentId: "student2",
    studentName: "Sarah Kim",
    studentImage: "/api/placeholder/32/32",
    topic: "MongoDB Aggregation Pipelines",
    description: "I need help understanding complex MongoDB aggregations for data analysis. The syntax is confusing me.",
    category: "Backend Development",
    difficulty: "advanced",
    submittedAt: "2024-12-01T11:30:00Z",
    status: "enhanced",
    teacherNotes: "Excellent choice! Aggregations are powerful but complex.",
    enhancedTopic: "MongoDB Mastery: Complex Aggregations and Data Analysis",
    enhancedDescription: "Master MongoDB aggregation pipelines for advanced data analysis, including $lookup, $group, $unwind, and custom aggregation functions."
  },
  {
    id: "3",
    studentId: "student3",
    studentName: "Mike Johnson",
    studentImage: "/api/placeholder/32/32",
    topic: "Next.js Authentication",
    description: "How to implement secure authentication in Next.js? I want to understand the best practices.",
    category: "Full-Stack Development",
    difficulty: "intermediate",
    submittedAt: "2024-12-01T14:15:00Z",
    status: "pending"
  }
];

export const mockGroupSessions: GroupSession[] = [
  {
    id: "1",
    topic: mockTopicSubmissions[0],
    teacherId: "teacher1",
    teacherName: "Dr. Emily Watson",
    teacherImage: "/api/placeholder/32/32",
    maxParticipants: 15,
    currentParticipants: 8,
    participants: [
      {
        id: "p1",
        name: "Alex Chen",
        image: "/api/placeholder/32/32",
        role: "student",
        joinedAt: "2024-12-01T10:00:00Z",
        status: "active"
      },
      {
        id: "p2",
        name: "Dr. Emily Watson",
        image: "/api/placeholder/32/32",
        role: "teacher",
        joinedAt: "2024-12-01T10:00:00Z",
        status: "active"
      }
    ],
    status: "scheduled",
    scheduledDate: "2024-12-15",
    scheduledTime: "14:00",
    duration: 90,
    meetingLink: "https://zoom.us/j/123456789",
    description: "Advanced React performance optimization techniques for production applications.",
    category: "Frontend Development",
    difficulty: "intermediate",
    tags: ["React", "Performance", "Optimization", "Frontend"],
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z"
  }
];

export const mockTopicVotes: TopicVote[] = [
  {
    id: "1",
    topicId: "1",
    studentId: "student1",
    studentName: "Alex Chen",
    vote: "upvote",
    createdAt: "2024-12-01T10:00:00Z"
  },
  {
    id: "2",
    topicId: "1",
    studentId: "student2",
    studentName: "Sarah Kim",
    vote: "upvote",
    createdAt: "2024-12-01T11:00:00Z"
  },
  {
    id: "3",
    topicId: "2",
    studentId: "student1",
    studentName: "Alex Chen",
    vote: "upvote",
    createdAt: "2024-12-01T12:00:00Z"
  }
]; 