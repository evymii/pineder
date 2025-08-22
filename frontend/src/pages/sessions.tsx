import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { useTheme } from "../core/contexts/ThemeContext";
import { useUser } from "@clerk/nextjs";
import { Layout } from "../components/layout/Layout";
import {
  SessionTabs,
  SessionGrid,
  GoogleCalendarSection,
  EmptyStateCard,
  RescheduleDialog,
  RatingDialog,
  CustomFooter,
} from "../components/features/sessions";
import { useSessions } from "../core/hooks/sessions/useSessions";

interface SessionData {
  id: string;
  title: string;
  mentor: {
    name: string;
    image: string;
    expertise: string[];
    rating: number;
  };
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  duration: string;
  subject: string;
  price: number;
  studentChoice: "ice cream" | "coffee" | "free";
  meetingLink?: string;
}

interface GroupSessionData {
  id: string;
  title: string;
  mentor: {
    name: string;
    image: string;
    expertise: string[];
    rating: number;
  };
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  duration: string;
  subject: string;
  price: number;
  studentChoice: "ice cream" | "coffee" | "free";
  meetingLink?: string;
  maxParticipants: number;
  currentParticipants: number;
  participants: string[];
}

type AnySession = SessionData | GroupSessionData;

export default function SessionsPage() {
  const { colors } = useTheme();
  const { user } = useUser();
  const {
    sessions,
    isLoading,
    upcomingSessions,
    completedSessions,
    cancelledSessions,
  } = useSessions();
  const [activeTab, setActiveTab] = useState<
    "group" | "oneonone" | "all" | "calendar"
  >("oneonone");
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<
    SessionData | GroupSessionData | null
  >(null);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");

  // Filter sessions based on active tab
  const filteredSessions = sessions.filter((session) => {
    if (activeTab === "all") return true;
    if (activeTab === "oneonone") return true; // Show all sessions in oneonone tab
    if (activeTab === "group") return false; // No group sessions for now
    return false;
  });

  const stats = {
    total: sessions.length,
    oneonone: sessions.length,
    group: 0, // No group sessions for now
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <span className="w-4 h-4">⏰</span>;
      case "completed":
        return <span className="w-4 h-4">✅</span>;
      case "cancelled":
        return <span className="w-4 h-4">❌</span>;
      default:
        return <span className="w-4 h-4">🕐</span>;
    }
  };

  const handleJoinSession = (session: SessionData | GroupSessionData) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, "_blank");
    } else {
      alert(
        "Meeting link not available yet. Please wait for the mentor to approve the session."
      );
    }
  };

  const handleRequestReschedule = (session: SessionData | GroupSessionData) => {
    setSelectedSession(session);
    setShowRescheduleDialog(true);
  };

  const handleCancelSession = (session: SessionData | GroupSessionData) => {
    if (confirm("Are you sure you want to cancel this session?")) {
      cancelSession(session.id);
    }
  };

  const cancelSession = async (sessionId: string) => {
    if (!user) {
      alert("Please sign in to cancel sessions");
      return;
    }

    try {
      // Determine user role based on email domain
      const email = user.emailAddresses[0]?.emailAddress || "";
      let role = "student"; // default
      if (email.endsWith("@gmail.com")) {
        role = "mentor";
      } else if (email.endsWith("@nest.edu.mn")) {
        role = "student";
      }

      console.log("Cancelling session:", {
        sessionId,
        email,
        role,
        userId: user.id
      });

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/sessions/bookings/${sessionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-user-role": role,
            "x-user-email": email,
            "x-user-id": user.id || "",
          },
        }
      );

      console.log("Cancel response status:", response.status);
      console.log("Cancel response ok:", response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("Cancel response data:", data);
        if (data.success) {
          alert("Session cancelled successfully!");
          // Refresh sessions
          window.location.reload();
        } else {
          alert(`Error: ${data.error}`);
        }
      } else {
        const errorText = await response.text();
        console.error("Cancel error response:", errorText);
        alert("Failed to cancel session");
      }
    } catch (error) {
      console.error("Error cancelling session:", error);
      alert("Failed to cancel session");
    }
  };

  const handleSubmitReschedule = (newStartTime: string, newEndTime: string) => {
    if (rescheduleReason.trim() && selectedSession) {
      // Call backend API to request reschedule
      requestReschedule(
        selectedSession.id,
        newStartTime,
        newEndTime,
        rescheduleReason
      );
      setShowRescheduleDialog(false);
      setRescheduleReason("");
      setSelectedSession(null);
    }
  };

  const requestReschedule = async (
    sessionId: string,
    newStartTime: string,
    newEndTime: string,
    reason: string
  ) => {
    if (!user) {
      alert("Please sign in to request reschedule");
      return;
    }

    try {
      // Determine user role based on email domain
      const email = user.emailAddresses[0]?.emailAddress || "";
      let role = "student"; // default
      if (email.endsWith("@gmail.com")) {
        role = "mentor";
      } else if (email.endsWith("@nest.edu.mn")) {
        role = "student";
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/reschedule/${sessionId}/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-role": role,
            "x-user-email": email,
            "x-user-id": user.id || "",
          },
          body: JSON.stringify({
            newStartTime,
            newEndTime,
            reason,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert("Reschedule request sent successfully!");
          // Refresh sessions
          window.location.reload();
        } else {
          alert(`Error: ${data.error}`);
        }
      } else {
        alert("Failed to send reschedule request");
      }
    } catch (error) {
      console.error("Error requesting reschedule:", error);
      alert("Failed to send reschedule request");
    }
  };

  const handleRateSession = (session: SessionData | GroupSessionData) => {
    setSelectedSession(session);
    setShowRatingDialog(true);
    setRating(0);
    setRatingComment("");
  };

  const handleSubmitRating = () => {
    if (rating > 0 && selectedSession) {
      // Call backend API to submit rating
      submitRating(selectedSession.id, rating, ratingComment);
      setShowRatingDialog(false);
      setRating(0);
      setRatingComment("");
      setSelectedSession(null);
    }
  };

  const submitRating = async (
    sessionId: string,
    rating: number,
    comment: string
  ) => {
    if (!user) {
      alert("Please sign in to submit ratings");
      return;
    }

    try {
      // Determine user role based on email domain
      const email = user.emailAddresses[0]?.emailAddress || "";
      let role = "student"; // default
      if (email.endsWith("@gmail.com")) {
        role = "mentor";
      } else if (email.endsWith("@nest.edu.mn")) {
        role = "student";
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/sessions/${sessionId}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-role": role,
            "x-user-email": email,
            "x-user-id": user.id || "",
          },
          body: JSON.stringify({
            rating,
            comment,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert("Rating submitted successfully!");
          // Refresh sessions
          window.location.reload();
        } else {
          alert(`Error: ${data.error}`);
        }
      } else {
        alert("Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating");
    }
  };

  const exportAllToGoogleCalendar = () => {
    if (sessions.length === 0) {
      alert("No sessions to export!");
      return;
    }

    const eventTitle = `Pineder Learning Sessions - ${sessions.length} Sessions`;
    const eventDescription = sessions
      .map(
        (session) =>
          `• ${session.title} with ${session.mentor.name} on ${session.date} at ${session.time} (${session.duration} min)`
      )
      .join("\n");

    const today = new Date();
    const startTime = new Date(today);
    startTime.setHours(9, 0, 0, 0);
    const endTime = new Date(today);
    endTime.setHours(17, 0, 0, 0);

    const formatDate = (date: Date) => {
      return date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventTitle
    )}&details=${encodeURIComponent(eventDescription)}&dates=${formatDate(
      startTime
    )}/${formatDate(endTime)}&location=${encodeURIComponent(
      "Pineder Learning Platform"
    )}&sf=true&output=xml`;

    window.open(googleCalendarUrl, "_blank");
  };

  const getCurrentSessions = () => {
    if (activeTab === "group") return [];
    if (activeTab === "oneonone") return filteredSessions;
    if (activeTab === "all") return filteredSessions;
    return [];
  };

  const getEmptyStateType = () => {
    if (activeTab === "group") return "group";
    if (activeTab === "oneonone") return "oneonone";
    return "all";
  };

  return (
    <Layout showFooter={false}>
      <Head>
        <title>My Sessions | Pineder</title>
        <meta
          name="description"
          content="Track your learning sessions, view upcoming appointments, and review completed sessions with mentors."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="px-4 py-8 sm:py-12 md:py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <SessionTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          stats={stats}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {activeTab === "calendar" ? (
            <GoogleCalendarSection
              onExportToCalendar={exportAllToGoogleCalendar}
            />
          ) : isLoading ? (
            <div className="text-center py-8 sm:py-12 md:py-16">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-green-600 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-base sm:text-lg text-gray-600">
                Loading your sessions...
              </p>
            </div>
          ) : getCurrentSessions().length === 0 ? (
            <EmptyStateCard type={getEmptyStateType()} />
          ) : (
            <SessionGrid
              sessions={getCurrentSessions()}
              onJoinSession={handleJoinSession}
              onRequestReschedule={handleRequestReschedule}
              onRateSession={handleRateSession}
              onCancelSession={handleCancelSession}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          )}
        </motion.div>
      </div>

      <RescheduleDialog
        isOpen={showRescheduleDialog}
        onClose={() => {
          setShowRescheduleDialog(false);
          setRescheduleReason("");
          setSelectedSession(null);
        }}
        session={selectedSession}
        rescheduleReason={rescheduleReason}
        setRescheduleReason={setRescheduleReason}
        onSubmit={handleSubmitReschedule}
      />

      <RatingDialog
        isOpen={showRatingDialog}
        onClose={() => {
          setShowRatingDialog(false);
          setRating(0);
          setRatingComment("");
          setSelectedSession(null);
        }}
        session={selectedSession}
        rating={rating}
        setRating={setRating}
        ratingComment={ratingComment}
        setRatingComment={setRatingComment}
        onSubmit={handleSubmitRating}
      />

      <CustomFooter />
    </Layout>
  );
}
