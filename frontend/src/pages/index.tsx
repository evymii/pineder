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

  // Mock data for today&apos;s events
  const todaysEvents = [
    {
      id: 1,
      title: "React Performance Workshop",
      time: "2:00 PM - 4:00 PM",
      mentor: "Sarah Chen",
      participants: 12,
      maxParticipants: 20,
      type: "Workshop",
      status: "Open",
    },
    {
      id: 2,
      title: "System Design Interview Prep",
      time: "6:00 PM - 7:30 PM",
      mentor: "Marcus Rodriguez",
      participants: 8,
      maxParticipants: 15,
      type: "Study Group",
      status: "Open",
    },
    {
      id: 3,
      title: "Data Science Q&A Session",
      time: "8:00 PM - 9:00 PM",
      mentor: "Aisha Patel",
      participants: 15,
      maxParticipants: 25,
      type: "Q&A",
      status: "Almost Full",
    },
  ];

  // State for event form
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState(todaysEvents);

  // Handler for event submission
  const handleEventSubmit = (newEvent: any) => {
    const event = {
      ...newEvent,
      id: Date.now(),
      participants: 0,
      status: "Open" as const,
    };

    setEvents((prevEvents: any[]) => [event, ...prevEvents]);
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

          <div className="text-center mt-12">
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
                className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
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
                    className="text-xl font-semibold mb-3 group-hover:underline"
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
            {events.map((event) => (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105"
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
                    className="text-xl font-semibold mb-3"
                    style={{ color: colors.text.primary }}
                  >
                    {event.title}
                  </h3>

                  <div className="space-y-3 mb-6">
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
                    className="w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor:
                        event.status === "Open"
                          ? colors.accent.success
                          : colors.accent.warning,
                      color: colors.text.inverse,
                    }}
                  >
                    {event.status === "Open" ? "Join Session" : "Join Waitlist"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Event Button */}
          <div className="text-center mt-8">
            <Button
              onClick={() => setShowEventForm(true)}
              className="inline-flex items-center px-8 py-4 text-lg font-medium transition-all duration-300 rounded-xl hover:scale-105 shadow-lg hover:shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${colors.accent.secondary}, ${colors.accent.success})`,
                color: colors.text.inverse,
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Event
            </Button>
          </div>

          <div className="text-center mt-12">
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
