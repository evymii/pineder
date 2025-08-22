// This file has been refactored into smaller, focused controllers:
// - mentorProfileController.ts: createMentorProfile, getMentorProfile, updateMentorProfile
// - mentorAvailabilityController.ts: updateMentorAvailability
// - mentorListingController.ts: getMentorById, getAllMentors

// Re-export functions for backward compatibility
export {
  createMentorProfile,
  getMentorProfile,
  updateMentorProfile,
} from "./mentorProfileController";
export { updateMentorAvailability, getMentorAvailability } from "./mentorAvailabilityController";
export { getMentorById, getAllMentors } from "./mentorListingController";
