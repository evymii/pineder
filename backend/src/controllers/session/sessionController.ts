// This file has been refactored into smaller, focused controllers:
// - sessionListingController.ts: getAllSessions, getUpcomingSessions, getSessionById
// - sessionManagementController.ts: updateSession, deleteSession, getTeamsChatUrl

// Re-export functions for backward compatibility
export {
  getAllSessions,
  getUpcomingSessions,
  getSessionById,
} from "./sessionListingController";
export {
  updateSession,
  deleteSession,
  getTeamsChatUrl,
} from "./sessionManagementController";
