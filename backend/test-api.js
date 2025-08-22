// Simple test script to verify API endpoints
const axios = require("axios");

const API_BASE_URL = "http://localhost:3001";

// Test data
const testStudentData = {
  firstName: "John",
  lastName: "Doe",
  major: "Computer Science",
  studentCode: "STU2024001",
  email: "john.doe@nest.edu.mn",
  phone: "+1 (555) 123-4567",
  location: "Stanford, CA",
  bio: "Computer science student passionate about AI and machine learning.",
  avatar: "https://example.com/avatar.jpg",
  links: {
    github: "https://github.com/johndoe",
    portfolio: "https://johndoe.dev",
    linkedin: "https://linkedin.com/in/johndoe",
  },
  grade: "Intermediate",
  subjects: ["Computer Science", "Mathematics"],
  goals: ["Learn AI/ML", "Build scalable applications"],
};

const testMentorData = {
  firstName: "Jane",
  lastName: "Smith",
  title: "Senior Software Engineer",
  email: "jane.smith@gmail.com",
  phone: "+1 (555) 987-6543",
  location: "San Francisco, CA",
  bio: "Experienced software engineer with 8+ years in full-stack development.",
  avatar: "https://example.com/avatar.jpg",
  hourlyRate: 75,
  specialties: ["React", "Node.js", "Python"],
  subjects: ["React", "Node.js", "Python", "JavaScript"],
  experience: 8,
  links: {
    github: "https://github.com/janesmith",
    portfolio: "https://janesmith.dev",
    linkedin: "https://linkedin.com/in/janesmith",
    website: "https://janesmith.com",
  },
  availability: [],
  education: ["BS Computer Science"],
  certifications: ["AWS Certified Developer"],
  languages: ["English", "Spanish"],
  timezone: "America/Los_Angeles",
};

// Test headers
const studentHeaders = {
  "Content-Type": "application/json",
  "x-user-role": "student",
  "x-user-email": "john.doe@nest.edu.mn",
  "x-user-id": "test-student-id",
};

const mentorHeaders = {
  "Content-Type": "application/json",
  "x-user-role": "mentor",
  "x-user-email": "jane.smith@gmail.com",
  "x-user-id": "test-mentor-id",
};

async function testStudentAPI() {
  console.log("Testing Student API...");

  try {
    // Test student profile creation
    const createResponse = await axios.post(
      `${API_BASE_URL}/api/students`,
      testStudentData,
      { headers: studentHeaders }
    );
    console.log("✅ Student profile creation:", createResponse.data);

    // Test get student profile
    const getResponse = await axios.get(
      `${API_BASE_URL}/api/students/profile`,
      { headers: studentHeaders }
    );
    console.log("✅ Get student profile:", getResponse.data);
  } catch (error) {
    console.error(
      "❌ Student API test failed:",
      error.response?.data || error.message
    );
  }
}

async function testMentorAPI() {
  console.log("\nTesting Mentor API...");

  try {
    // Test mentor profile creation
    const createResponse = await axios.post(
      `${API_BASE_URL}/api/mentors`,
      testMentorData,
      { headers: mentorHeaders }
    );
    console.log("✅ Mentor profile creation:", createResponse.data);

    // Test get mentor profile
    const getResponse = await axios.get(`${API_BASE_URL}/api/mentors/profile`, {
      headers: mentorHeaders,
    });
    console.log("✅ Get mentor profile:", getResponse.data);
  } catch (error) {
    console.error(
      "❌ Mentor API test failed:",
      error.response?.data || error.message
    );
  }
}

async function runTests() {
  console.log("🚀 Starting API Tests...\n");

  await testStudentAPI();
  await testMentorAPI();

  console.log("\n✨ API Tests completed!");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testStudentAPI, testMentorAPI };
