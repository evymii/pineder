import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { useTheme } from "../core/contexts/ThemeContext";
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
import { mentorCategories } from "../core/lib/data/mentors";

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
  const [oneOnOneSessions, setOneOnOneSessions] = useState<SessionData[]>([]);
  const [groupSessions, setGroupSessions] = useState<GroupSessionData[]>([]);
  const [activeTab, setActiveTab] = useState<
    "group" | "oneonone" | "all" | "calendar"
  >("group");
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<
    SessionData | GroupSessionData | null
  >(null);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateSessions = () => {
      const allMentors = mentorCategories.flatMap(
        (category) => category.mentors
      );

      // Generate 1 on 1 sessions (first 5 mentors)
      const mockOneOnOneSessions: SessionData[] = [];
      allMentors.forEach((mentor, index) => {
        if (index < 5) {
          mockOneOnOneSessions.push({
            id: `oneonone-${index}`,
            title: `${mentor.expertise[0]} 1-on-1 Session`,
            mentor: {
              name: mentor.name,
              image: mentor.image,
              expertise: mentor.expertise,
              rating: mentor.rating,
            },
            date: mentor.availableTimes[0],
            time: "2:00 PM",
            status: "upcoming" as const,
            duration: "1 hour",
            subject: mentor.expertise[0],
            price: 35 + index * 5,
            studentChoice: ["coffee", "free", "ice cream"][index % 3] as
              | "ice cream"
              | "coffee"
              | "free",
            meetingLink: `https://zoom.us/j/${200000000 + index}`,
          });
        }
      });

      setOneOnOneSessions(mockOneOnOneSessions);

      // Generate group sessions
      const mockGroupSessions: GroupSessionData[] = [];
      allMentors.forEach((mentor, index) => {
        if (index < 6) {
          mockGroupSessions.push({
            id: `group-${index}`,
            title: `${mentor.expertise[0]} Group Workshop`,
            mentor: {
              name: mentor.name,
              image: mentor.image,
              expertise: mentor.expertise,
              rating: mentor.rating,
            },
            date: mentor.availableTimes[1] || "Tomorrow",
            time: "4:00 PM",
            status: "upcoming" as const,
            duration: "2 hours",
            subject: mentor.expertise[0],
            price: 15 + index * 3,
            studentChoice: ["free", "ice cream", "coffee"][index % 3] as
              | "ice cream"
              | "coffee"
              | "free",
            meetingLink: `https://zoom.us/j/${300000000 + index}`,
            maxParticipants: 8,
            currentParticipants: 3 + Math.floor(Math.random() * 4),
            participants: ["You", "Student A", "Student B"],
          });
        }
      });

      setGroupSessions(mockGroupSessions);
      setIsLoading(false);
    };

    generateSessions();
  }, []);

  const filteredOneOnOneSessions = oneOnOneSessions.filter((session) => {
    if (activeTab === "all") return true;
    if (activeTab === "oneonone") return session.status === "upcoming";
    return false;
  });

  const filteredGroupSessions = groupSessions.filter((session) => {
    if (activeTab === "all") return true;
    if (activeTab === "group") return true;
    return false;
  });

  const stats = {
    total: oneOnOneSessions.length + groupSessions.length,
    oneonone: oneOnOneSessions.length,
    group: groupSessions.length,
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
      alert("Meeting link not available yet.");
    }
  };

  const handleRequestReschedule = (session: SessionData | GroupSessionData) => {
    setSelectedSession(session);
    setShowRescheduleDialog(true);
  };

  const handleSubmitReschedule = () => {
    if (rescheduleReason.trim()) {
      setShowRescheduleDialog(false);
      setRescheduleReason("");
      setSelectedSession(null);
    }
  };

  const handleRateSession = (session: SessionData | GroupSessionData) => {
    setSelectedSession(session);
    setShowRatingDialog(true);
    setRating(0);
    setRatingComment("");
  };

  const handleSubmitRating = () => {
    if (rating > 0) {
      setShowRatingDialog(false);
      setRating(0);
      setRatingComment("");
      setSelectedSession(null);
    }
  };

  const exportAllToGoogleCalendar = () => {
    const allSessions = [...oneOnOneSessions, ...groupSessions];

    if (allSessions.length === 0) {
      alert("No sessions to export!");
      return;
    }

    const eventTitle = `Pineder Learning Sessions - ${allSessions.length} Sessions`;
    const eventDescription = allSessions
      .map(
        (session) =>
          `• ${session.title} with ${session.mentor.name} on ${session.date} at ${session.time} (${session.duration})`
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
    if (activeTab === "group") return filteredGroupSessions;
    if (activeTab === "oneonone") return filteredOneOnOneSessions;
    if (activeTab === "all")
      return [...filteredOneOnOneSessions, ...filteredGroupSessions];
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
