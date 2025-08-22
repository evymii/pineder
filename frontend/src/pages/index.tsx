import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { PageLayout } from "../components/layout";
import { useTheme } from "../core/contexts/ThemeContext";
import { PostSignInRedirect } from "../components/features/auth/PostSignInRedirect";
import { Hero } from "../components/common/Hero";
import {
  Users,
  MessageSquare,
  Calendar,
  Clock,
  MapPin,
  Star,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  BookOpen,
  Plus,
} from "lucide-react";
import { mentorCategories } from "../core/lib/data/mentors";
import { TeacherCategory } from "../components/features/mentors/TeacherCategory";
import { EventSubmissionForm } from "../components/features/events/EventSubmissionForm";
import { useEvents, CreateEventData } from "../core/hooks/useEvents";
import { Button } from "../design/system/button";

export default function Home() {
  const { colors, isDarkMode } = useTheme();

  // Get recommended mentors from the first category (software engineers) for homepage
  const recommendedMentors = mentorCategories[0];

  // Mock data for topic discussions
  const trendingTopics = [
    {
      id: 1,
      title: "Building Scalable Microservices",
      category: "Architecture",
      participants: 24,
      replies: 18,
      lastActivity: "2 hours ago",
      tags: ["Microservices", "Scalability", "Best Practices"],
    },
    {
      id: 2,
      title: "Modern React Patterns in 2024",
      category: "Frontend",
      participants: 31,
      replies: 25,
      lastActivity: "4 hours ago",
      tags: ["React", "JavaScript", "Patterns"],
    },
    {
      id: 3,
      title: "AI in Software Development",
      category: "Emerging Tech",
      participants: 42,
      replies: 33,
      lastActivity: "6 hours ago",
      tags: ["AI", "Development", "Future"],
    },
  ];

  // State for event form
  const [showEventForm, setShowEventForm] = useState(false);

  // Use the events hook
  const { events, createEvent, loading } = useEvents();

  // Transform backend events to UI format
  const transformEventsForUI = (backendEvents: any[]) => {
    return backendEvents
      .filter((event) => new Date(event.startTime) >= new Date())
      .slice(0, 3)
      .map((event) => ({
        id: parseInt(event.eventId?.replace("#", "") || "0"),
        title: event.title,
        time: `${new Date(event.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${new Date(event.endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        mentor: `${event.mentorId?.userId?.firstName || ""} ${
          event.mentorId?.userId?.lastName || ""
        }`,
        participants: event.currentParticipants,
        maxParticipants: event.maxParticipants || 0,
        type:
          event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1),
        status:
          event.currentParticipants >= (event.maxParticipants || 0)
            ? "Full"
            : "Open",
      }));
  };

  // Get today's events for display
  const todaysEvents = transformEventsForUI(events);

  // Handler for event submission
  const handleEventSubmit = async (newEvent: CreateEventData) => {
    try {
      console.log("Submitting event:", newEvent);
      await createEvent(newEvent);
      alert("Event created successfully!");
      setShowEventForm(false);
    } catch (error) {
      console.error("Failed to create event:", error);
      alert(error instanceof Error ? error.message : "Failed to create event");
    }
  };

  return (
    <PageLayout>
      <PostSignInRedirect />
      <Hero />
      <Head>
        <title>Pineder - Mentorship Platform</title>
        <meta
          name="description"
          content="Connect with mentors and grow your skills"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Recommended Mentors Section */}
      <section
        className="py-20 transition-colors duration-300"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="flex items-center justify-center mb-4">
              <Users
                className="w-6 h-6 mr-3"
                style={{ color: colors.accent.primary }}
              />
              <span
                className="text-sm font-semibold tracking-wider uppercase"
                style={{ color: colors.text.secondary }}
              >
                Recommended Mentors
              </span>
            </div>
            <h2
              className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl"
              style={{ color: colors.text.primary }}
            >
              Learn from the
              <span
                className="block text-transparent bg-gradient-to-r bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(to right, ${colors.accent.primary}, ${colors.accent.secondary}, ${colors.accent.success})`,
                }}
              >
                Best in Tech
              </span>
            </h2>
            <p
              className="max-w-3xl mx-auto text-xl"
              style={{ color: colors.text.secondary }}
            >
              Connect with experienced professionals who are passionate about
              sharing their knowledge and helping you grow.
            </p>
          </div>

          <div className="w-full">
            {/* Full Width Mentor Categories */}
            <div className="w-full">
              <div
                className={`w-full p-6 border-0 shadow-lg transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20"
                    : "bg-white border border-black/20"
                } rounded-3xl`}
              >
                <div className="space-y-8">
                  <TeacherCategory
                    category={recommendedMentors}
                    isDarkMode={isDarkMode}
                    onTeacherClick={() => {}}
                    onBookSession={() => {}}
                    showViewAll={false}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/mentors"
              className="inline-flex items-center px-8 py-4 text-lg font-medium transition-all duration-300 rounded-xl hover:scale-105"
              style={{
                backgroundColor: "transparent",
                color: colors.accent.primary,
                border: `2px solid ${colors.accent.primary}`,
              }}
            >
              View All Mentors
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Topic Discussions Section */}
      <section
        className="py-20 transition-colors duration-300"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="flex items-center justify-center mb-4">
              <MessageSquare
                className="w-6 h-6 mr-3"
                style={{ color: colors.accent.secondary }}
              />
              <span
                className="text-sm font-semibold tracking-wider uppercase"
                style={{ color: colors.text.secondary }}
              >
                Trending Topics
              </span>
            </div>
            <h2
              className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl"
              style={{ color: colors.text.primary }}
            >
              Join the
              <span
                className="block text-transparent bg-gradient-to-r bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(to right, ${colors.accent.secondary}, ${colors.accent.success}, ${colors.accent.primary})`,
                }}
              >
                Conversation
              </span>
            </h2>
            <p
              className="max-w-3xl mx-auto text-xl"
              style={{ color: colors.text.secondary }}
            >
              Engage in meaningful discussions about the latest trends,
              challenges, and innovations in tech.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {trendingTopics.map((topic) => (
              <div
                key={topic.id}
                className="relative overflow-hidden transition-all duration-300 cursor-pointer group rounded-2xl hover:scale-105"
                style={{
                  backgroundColor: colors.background.card,
                  border: `1px solid ${colors.border.primary}`,
                  boxShadow: isDarkMode
                    ? colors.shadow.medium
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="px-3 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: `${colors.accent.secondary}20`,
                        color: colors.accent.secondary,
                      }}
                    >
                      {topic.category}
                    </span>
                    <div className="flex items-center space-x-3 text-sm">
                      <span style={{ color: colors.text.muted }}>
                        {topic.participants} participants
                      </span>
                    </div>
                  </div>

                  <h3
                    className="mb-3 text-xl font-semibold group-hover:underline"
                    style={{ color: colors.text.primary }}
                  >
                    {topic.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-md"
                        style={{
                          backgroundColor: `${colors.background.card}`,
                          color: colors.text.secondary,
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: colors.text.muted }}>
                      {topic.replies} replies
                    </span>
                    <span style={{ color: colors.text.muted }}>
                      {topic.lastActivity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Events Section */}
      <section
        className="py-20 transition-colors duration-300"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="flex items-center justify-center mb-4">
              <Calendar
                className="w-6 h-6 mr-3"
                style={{ color: colors.accent.success }}
              />
              <span
                className="text-sm font-semibold tracking-wider uppercase"
                style={{ color: colors.text.secondary }}
              >
                Today&apos;s Events
              </span>
            </div>
            <h2
              className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl"
              style={{ color: colors.text.primary }}
            >
              Don&apos;t Miss
              <span
                className="block text-transparent bg-gradient-to-r bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(to right, ${colors.accent.success}, ${colors.accent.primary}, ${colors.accent.secondary})`,
                }}
              >
                Today&apos;s Sessions
              </span>
            </h2>
            <p
              className="max-w-3xl mx-auto text-xl"
              style={{ color: colors.text.secondary }}
            >
              Join live sessions, workshops, and study groups happening today
              with our expert mentors.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading events...</p>
              </div>
            ) : todaysEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600">
                  No events available today
                </p>
              </div>
            ) : (
              todaysEvents.map((event) => (
                <div
                  key={event.id}
                  className="relative overflow-hidden transition-all duration-300 group rounded-2xl hover:scale-105"
                  style={{
                    backgroundColor: colors.background.card,
                    border: `1px solid ${colors.border.primary}`,
                    boxShadow: isDarkMode
                      ? colors.shadow.medium
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          event.status === "Open"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                        }`}
                      >
                        {event.status}
                      </span>
                      <span
                        className="px-3 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: `${colors.accent.primary}20`,
                          color: colors.accent.primary,
                        }}
                      >
                        {event.type}
                      </span>
                    </div>

                    <h3
                      className="mb-3 text-xl font-semibold"
                      style={{ color: colors.text.primary }}
                    >
                      {event.title}
                    </h3>

                    <div className="mb-6 space-y-3">
                      <div className="flex items-center">
                        <Clock
                          className="w-4 h-4 mr-2"
                          style={{ color: colors.text.muted }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {event.time}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users
                          className="w-4 h-4 mr-2"
                          style={{ color: colors.text.muted }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {event.mentor}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp
                          className="w-4 h-4 mr-2"
                          style={{ color: colors.text.muted }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {event.participants}/{event.maxParticipants}{" "}
                          participants
                        </span>
                      </div>
                    </div>

                    <button
                      className="w-full px-4 py-3 font-medium transition-all duration-200 rounded-xl hover:scale-105"
                      style={{
                        backgroundColor:
                          event.status === "Open"
                            ? colors.accent.success
                            : colors.accent.warning,
                        color: colors.text.inverse,
                      }}
                    >
                      {event.status === "Open"
                        ? "Join Session"
                        : "Join Waitlist"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Event Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={() => setShowEventForm(true)}
              className="inline-flex items-center px-8 py-4 text-lg font-medium transition-all duration-300 shadow-lg rounded-xl hover:scale-105 hover:shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${colors.accent.secondary}, ${colors.accent.success})`,
                color: colors.text.inverse,
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Event
            </Button>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/community/events"
              className="inline-flex items-center px-8 py-4 text-lg font-medium transition-all duration-300 rounded-xl hover:scale-105"
              style={{
                backgroundColor: "transparent",
                color: colors.accent.success,
                border: `2px solid ${colors.accent.success}`,
              }}
            >
              View All Events
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Event Submission Form */}
      <EventSubmissionForm
        isOpen={showEventForm}
        onClose={() => setShowEventForm(false)}
        onSubmit={handleEventSubmit}
      />
    </PageLayout>
  );
}
