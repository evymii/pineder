// This file has been refactored into smaller, focused services:
// - zoomAuthService.ts: Authentication and token management
// - zoomMeetingService.ts: Meeting creation and management

// Re-export for backward compatibility
export { ZoomAuthService } from "./zoomAuthService";
export { ZoomMeetingService as ZoomService } from "./zoomMeetingService";
