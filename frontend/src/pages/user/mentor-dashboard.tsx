import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../core/contexts/ThemeContext";
import { useUser } from "@clerk/nextjs";
import { Navigation } from "../../components/layout/Navigation";
import AvailabilityManager from "../../components/features/mentors/AvailabilityManager";
import { useMentorDashboard } from "../../core/hooks/useMentorDashboard";
import { useSessionBooking } from "../../core/hooks/useSessionBooking";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../design/system/card";
import { Button } from "../../design/system/button";
import { Badge } from "../../design/system/badge";
import {
  Users,
  Calendar,
  Star,
  User,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock3,
  TrendingUp,
  Heart,
  Check,
  X,
  Eye,
  Video,
} from "lucide-react";

interface Session {
  _id: string;
  studentId: {
    userId: {
      firstName: string;
      lastName: string;
      email: string;
      avatar: string;
    };
    grade: string;
    subjects: string[];
  };
  topic: string;
  startTime: string;
  endTime: string;
  status: "requested" | "approved" | "scheduled" | "completed" | "cancelled";
  duration: number;
  createdAt: string;
  zoomJoinUrl?: string;
  zoomStartUrl?: string;
  zoomMeetingId?: string;
  zoomPassword?: string;
  meetingProvider?: string;
}

interface SessionRequest {
  _id: string;
  studentId: {
    userId: {
      firstName: string;
      lastName: string;
      email: string;
      avatar: string;
    };
    grade: string;
    subjects: string[];
  };
  topic: string;
  startTime: string;
  endTime: string;
  status: "requested";
  duration: number;
  createdAt: string;
  message?: string;
}

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  totalSessions: number;
  completedSessions: number;
  progressPercentage: number;
  lastSession: string;
}

interface Analytics {
  totalSessions: number;
  completedSessions: number;
  totalStudents: number;
  averageRating: number;
  sessionHours: number;
  pendingRequests: number;
}

const MentorDashboard = () => {
  const { isDarkMode, colors } = useTheme();
  const { user } = useUser();
  const { sessions, sessionRequests, students, analytics, isLoading, error } =
    useMentorDashboard();
  const {
    acceptSession,
    denySession,
    isLoading: isProcessing,
  } = useSessionBooking();

  const cardBg = isDarkMode
    ? "bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border-white/20"
    : "bg-white border-black/20";

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Head>
          <title>Mentor Dashboard | Pineder</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <Navigation />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading dashboard...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <Head>
          <title>Mentor Dashboard | Pineder</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <Navigation />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Error Loading Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Helper functions for data formatting
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDuration = (durationMinutes: number) => {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    const result = await acceptSession(requestId);
    if (result.success) {
      alert(result.message);
      // Refresh the dashboard data
      window.location.reload();
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  const handleDenyRequest = async (requestId: string) => {
    const reason = prompt("Please provide a reason for denying this request:");
    if (reason !== null) {
      const result = await denySession(requestId, reason);
      if (result.success) {
        alert(result.message);
        // Refresh the dashboard data
        window.location.reload();
      } else {
        alert(`Error: ${result.message}`);
      }
    }
  };

  const handleJoinSession = (session: Session) => {
    // Use the Zoom meeting URL from the session data
    if (session.zoomJoinUrl) {
      window.open(session.zoomJoinUrl, "_blank");
    } else {
      alert("Meeting link not available. Please contact support.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "completed":
        return "bg-[#08CB00]/10 text-[#08CB00] dark:bg-[#08CB00]/20 dark:text-[#08CB00]";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const handleViewAllSessions = () => {
    // Add navigation logic here
  };

  const handleViewAllStudents = () => {
    // Add navigation logic here
  };

  const handleScheduleSession = () => {
    // Add scheduling logic here
  };

  return (
    <>
      <Head>
        <title>Mentor Dashboard | Pineder</title>
        <meta
          name="description"
          content="Professional mentor dashboard - Manage sessions, track students, and grow your mentoring practice."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`min-h-screen transition-colors duration-200 ${
          isDarkMode ? "bg-[#222222]" : "bg-white"
        }`}
      >
        <Navigation />

        {/* Main Content */}
        <div className="px-4 pt-32 pb-12">
          <div className="mx-auto max-w-7xl">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Card className={`${cardBg} shadow-lg border-0`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2 space-x-2">
                        <h1
                          className="text-3xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          Welcome back, {user?.firstName || "Mentor"}!
                        </h1>
                        {sessionRequests.length > 0 && (
                          <div className="relative">
                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                            <div className="absolute w-2 h-2 bg-red-500 rounded-full -top-1 -right-1 animate-ping"></div>
                          </div>
                        )}
                      </div>
                      <p style={{ color: colors.text.secondary }}>
                        Your role:{" "}
                        <span className="font-semibold text-[var(--pico-primary)]">
                          Professional Mentor
                        </span>
                      </p>
                      {sessionRequests.length > 0 && (
                        <p
                          className="text-sm mt-2"
                          style={{ color: colors.text.secondary }}
                        >
                          <span className="font-semibold text-orange-500">
                            {sessionRequests.length} new session request
                            {sessionRequests.length > 1 ? "s" : ""} waiting for
                            your response
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button
                        className="bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)] text-white"
                        onClick={handleScheduleSession}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Analytics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4"
            >
              <Card className={`${cardBg} shadow-lg border-0`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Total Sessions
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {analytics.totalSessions}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${cardBg} shadow-lg border-0`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Active Students
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {analytics.totalStudents}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#08CB00]">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${cardBg} shadow-lg border-0`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Average Rating
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {analytics.averageRating}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${cardBg} shadow-lg border-0`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Pending Requests
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {analytics.pendingRequests}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Session Requests - Integrated Notifications */}
            {sessionRequests.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <Card
                  className={`${cardBg} shadow-lg border-0 border-l-4 border-orange-500`}
                >
                  <CardHeader>
                    <CardTitle
                      className="flex items-center space-x-2"
                      style={{ color: colors.text.primary }}
                    >
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      <span>New Session Requests</span>
                      <Badge className="text-orange-800 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 animate-pulse">
                        {sessionRequests.length}
                      </Badge>
                    </CardTitle>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      Students are waiting for your response. Please review and
                      respond to these session requests.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sessionRequests.map((request) => (
                        <div
                          key={request._id}
                          className={`p-4 rounded-lg border transition-colors duration-200 ${
                            isDarkMode
                              ? "bg-[#333333] border-gray-700"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4
                              className="font-semibold"
                              style={{ color: colors.text.primary }}
                            >
                              {request.studentId.userId.firstName}{" "}
                              {request.studentId.userId.lastName}
                            </h4>
                            <span
                              className="text-sm"
                              style={{ color: colors.text.secondary }}
                            >
                              {getTimeAgo(request.createdAt)}
                            </span>
                          </div>
                          <p
                            className="text-sm mb-2"
                            style={{ color: colors.text.secondary }}
                          >
                            <strong>Topic:</strong> {request.topic}
                          </p>
                          <p
                            className="text-sm mb-2"
                            style={{ color: colors.text.secondary }}
                          >
                            <strong>Date:</strong>{" "}
                            {formatDate(request.startTime)} at{" "}
                            {formatTime(request.startTime)} (
                            {formatDuration(request.duration)})
                          </p>
                          {request.message && (
                            <p
                              className="text-sm mb-3"
                              style={{ color: colors.text.secondary }}
                            >
                              <strong>Message:</strong> {request.message}
                            </p>
                          )}
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              className="text-white bg-[#08CB00] hover:bg-[#06a800]"
                              onClick={() => handleAcceptRequest(request._id)}
                              disabled={isProcessing}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              {isProcessing ? "Processing..." : "Accept"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                              onClick={() => handleDenyRequest(request._id)}
                              disabled={isProcessing}
                            >
                              <X className="w-4 h-4 mr-1" />
                              {isProcessing ? "Processing..." : "Deny"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[var(--pico-primary)] text-[var(--pico-primary)] hover:bg-[var(--pico-primary)] hover:text-white"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <Card
                  className={`${cardBg} shadow-lg border-0 border-l-4 border-green-500`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <div>
                        <h3 className="font-semibold text-green-800 dark:text-green-300">
                          No Pending Requests
                        </h3>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          All session requests have been processed. Great job!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
              {/* Upcoming Sessions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className={`${cardBg} shadow-lg border-0`}>
                  <CardHeader>
                    <CardTitle
                      className="flex items-center space-x-2"
                      style={{ color: colors.text.primary }}
                    >
                      <Calendar className="w-5 h-5" />
                      <span>Upcoming Sessions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sessions.filter((session) =>
                        ["approved", "scheduled"].includes(session.status)
                      ).length > 0 ? (
                        sessions
                          .filter((session) =>
                            ["approved", "scheduled"].includes(session.status)
                          )
                          .map((session) => (
                            <div
                              key={session._id}
                              className={`p-4 rounded-lg border transition-colors duration-200 ${
                                isDarkMode
                                  ? "bg-[#333333] border-gray-700"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4
                                  className="font-semibold"
                                  style={{ color: colors.text.primary }}
                                >
                                  {session.studentId.userId.firstName}{" "}
                                  {session.studentId.userId.lastName}
                                </h4>
                                <Badge
                                  className={getStatusColor(session.status)}
                                >
                                  {session.status}
                                </Badge>
                              </div>
                              <p
                                className="text-sm mb-2"
                                style={{ color: colors.text.secondary }}
                              >
                                {session.topic}
                              </p>
                              <div className="flex items-center justify-between text-sm">
                                <span style={{ color: colors.text.secondary }}>
                                  {formatDate(session.startTime)} at{" "}
                                  {formatTime(session.startTime)}
                                </span>
                                <span style={{ color: colors.text.secondary }}>
                                  {formatDuration(session.duration)}
                                </span>
                              </div>
                              {/* Join Session Button for approved/scheduled sessions */}
                              <div className="mt-3">
                                <Button
                                  size="sm"
                                  className="w-full bg-[#58CC02] hover:bg-[#46A302] text-white font-bold"
                                  onClick={() => handleJoinSession(session)}
                                >
                                  <Video className="w-4 h-4 mr-2" />
                                  Join Session
                                </Button>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            No Upcoming Sessions
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            You don&apos;t have any upcoming sessions scheduled.
                          </p>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        className="w-full border-[var(--pico-primary)] text-[var(--pico-primary)] hover:bg-[var(--pico-primary)] hover:text-white"
                        onClick={handleViewAllSessions}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        View All Sessions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Students */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className={`${cardBg} shadow-lg border-0`}>
                  <CardHeader>
                    <CardTitle
                      className="flex items-center space-x-2"
                      style={{ color: colors.text.primary }}
                    >
                      <Users className="w-5 h-5" />
                      <span>Recent Students</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {students.length > 0 ? (
                        students.slice(0, 3).map((student) => (
                          <div
                            key={student._id}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#333333] transition-colors duration-200"
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--pico-primary)] to-[var(--pico-secondary)] flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4
                                className="font-semibold"
                                style={{ color: colors.text.primary }}
                              >
                                {student.firstName} {student.lastName}
                              </h4>
                              <p
                                className="text-sm"
                                style={{ color: colors.text.secondary }}
                              >
                                {student.completedSessions} sessions completed
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="w-16 h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                                <div
                                  className="h-full bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)]"
                                  style={{
                                    width: `${student.progressPercentage}%`,
                                  }}
                                />
                              </div>
                              <p
                                className="text-xs mt-1"
                                style={{ color: colors.text.secondary }}
                              >
                                {student.progressPercentage}%
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            No Students Yet
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            You haven&apos;t had any students yet. Start
                            mentoring to see students here!
                          </p>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        className="w-full border-[var(--pico-primary)] text-[var(--pico-primary)] hover:bg-[var(--pico-primary)] hover:text-white"
                        onClick={handleViewAllStudents}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        View All Students
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Availability Manager */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <AvailabilityManager />
            </motion.div>

            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className={`${cardBg} shadow-lg border-0`}>
                <CardHeader>
                  <CardTitle
                    className="flex items-center space-x-2"
                    style={{ color: colors.text.primary }}
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Performance Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--pico-primary)] to-[var(--pico-secondary)] flex items-center justify-center">
                        <Clock3 className="w-8 h-8 text-white" />
                      </div>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {analytics.sessionHours}h
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        This Month
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[#08CB00]">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {analytics.completedSessions}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Completed
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600">
                        <Star className="w-8 h-8 text-white" />
                      </div>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {analytics.averageRating}/5
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Rating
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {analytics.totalStudents}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Students
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorDashboard;
