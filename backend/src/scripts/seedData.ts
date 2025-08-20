import mongoose from "mongoose";
import dotenv from "dotenv";
import Community from "../models/Community";
import Mentor from "../models/Mentor";
import User from "../models/User";
import GroupSession from "../models/GroupSession";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/pineder";

const sampleUsers = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "hashedpassword123",
    role: "student",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    password: "hashedpassword123",
    role: "mentor",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
  },
  {
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    password: "hashedpassword123",
    role: "mentor",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
  },
];

const sampleCommunities = [
  {
    name: "Web Development Enthusiasts",
    description:
      "A community for web developers to share knowledge, ask questions, and collaborate on projects.",
    category: "Programming",
    members: [],
    topics: ["React", "Node.js", "TypeScript", "CSS", "JavaScript"],
    recentActivity: "2 hours ago",
    status: "active",
    createdBy: "",
    rules: [
      "Be respectful and inclusive",
      "Share knowledge and help others",
      "No spam or self-promotion",
      "Stay on topic",
    ],
    isPrivate: false,
    memberIds: [],
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
  },
  {
    name: "Data Science Learners",
    description:
      "Learn data science, machine learning, and AI together with peers and mentors.",
    category: "Data Science",
    members: [],
    topics: ["Python", "Machine Learning", "Statistics", "Data Visualization"],
    recentActivity: "1 day ago",
    status: "active",
    createdBy: "",
    rules: [
      "Respect intellectual property",
      "Share code and explanations",
      "Ask thoughtful questions",
      "Help others learn",
    ],
    isPrivate: false,
    memberIds: [],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
  },
];

const sampleMentors = [
  {
    userId: "",
    subjects: ["React", "Node.js", "JavaScript"],
    specialties: ["Frontend Development", "Backend Development", "Full Stack"],
    rating: 4.9,
    hourlyRate: 50,
    experience: 8,
    availability: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isAvailable: true }, // Monday
      { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isAvailable: true }, // Tuesday
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isAvailable: true }, // Wednesday
    ],
    bio: "Experienced software engineer with 8+ years in full-stack development. Specialized in React, Node.js, and cloud technologies.",
    education: ["Computer Science Degree"],
    certifications: ["AWS Certified Developer", "React Certified Developer"],
    languages: ["English"],
    timezone: "UTC",
    isVerified: true,
    totalSessions: 127,
    totalStudents: 45,
  },
  {
    userId: "",
    subjects: ["Python", "Machine Learning", "Data Science"],
    specialties: ["Machine Learning", "Data Science", "AI"],
    rating: 5.0,
    hourlyRate: 60,
    experience: 6,
    availability: [
      { dayOfWeek: 1, startTime: "10:00", endTime: "18:00", isAvailable: true }, // Monday
      { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isAvailable: true }, // Thursday
      { dayOfWeek: 5, startTime: "11:00", endTime: "19:00", isAvailable: true }, // Friday
    ],
    bio: "Senior data scientist specializing in machine learning and AI. Expert in Python, TensorFlow, and building scalable ML systems.",
    education: ["Masters in Data Science"],
    certifications: ["Google Cloud ML Engineer", "TensorFlow Developer"],
    languages: ["English"],
    timezone: "UTC",
    isVerified: true,
    totalSessions: 156,
    totalStudents: 67,
  },
];

const sampleGroupSessions = [
  {
    title: "React Performance Optimization",
    description: "Advanced React performance optimization techniques for production applications including React.memo, useMemo, useCallback, and code splitting.",
    mentorId: "",
    maxStudents: 15,
    currentStudents: 8,
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 7 days + 90 minutes
    status: "scheduled",
    subject: "Frontend Development",
    price: 25,
    currency: "USD",
    meetingLink: "https://zoom.us/j/123456789",
    students: [],
    topics: [
      {
        id: "topic1",
        title: "React Performance Optimization",
        description: "Learn advanced techniques to optimize React applications",
        votes: 12,
        submittedBy: "",
        status: "approved"
      }
    ]
  },
];

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Community.deleteMany({});
    await Mentor.deleteMany({});
    await GroupSession.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create users
    const createdUsers = await User.create(sampleUsers);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Update communities with creator IDs
    const updatedCommunities = sampleCommunities.map((community, index) => ({
      ...community,
      createdBy: createdUsers[index % createdUsers.length]._id,
      memberIds: [createdUsers[index % createdUsers.length]._id],
      members: [createdUsers[index % createdUsers.length]._id],
    }));

    // Create communities
    const createdCommunities = await Community.create(updatedCommunities);
    console.log(`🏘️  Created ${createdCommunities.length} communities`);

    // Update mentors with user IDs
    const updatedMentors = sampleMentors.map((mentor, index) => ({
      ...mentor,
      userId: createdUsers[index + 1]._id, // Skip first user (student)
    }));

    // Create mentors
    const createdMentors = await Mentor.create(updatedMentors);
    console.log(`👨‍🏫 Created ${createdMentors.length} mentors`);

    // Update group sessions with mentor ID and topic submitter
    const updatedGroupSessions = sampleGroupSessions.map((session, index) => ({
      ...session,
      mentorId: createdMentors[index % createdMentors.length]._id,
      topics: session.topics.map(topic => ({
        ...topic,
        submittedBy: createdUsers[0]._id // First user submits the topic
      }))
    }));

    // Create group sessions
    const createdGroupSessions = await GroupSession.create(
      updatedGroupSessions
    );
    console.log(`👥 Created ${createdGroupSessions.length} group sessions`);

    console.log("🎉 Database seeded successfully!");
    console.log("\n📊 Sample Data Summary:");
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Communities: ${createdCommunities.length}`);
    console.log(`- Mentors: ${createdMentors.length}`);
    console.log(`- Group Sessions: ${createdGroupSessions.length}`);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the seeding function
seedData();
