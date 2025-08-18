import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
// Merged imports - preserving your organized structure while incorporating teammate's improvements
import { useTheme } from "../../core/contexts/ThemeContext";
import { Card, CardContent } from "../../design/system/card";
import { Button } from "../../design/system/button";
import { Layout } from "../../components/layout/Layout";
import { TopicSubmissionForm } from "../../components/features/group-sessions/TopicSubmissionForm";
import { TopicVoting } from "../../components/features/group-sessions/TopicVoting";
import { Plus, Target, Users, Calendar, Lightbulb } from "lucide-react";
import {
  TopicSubmission,
  GroupSession,
  TopicVote,
  mockTopicSubmissions,
  mockGroupSessions,
  mockTopicVotes,
} from "../../core/lib/data/groupSessions";

export default function GroupSessionsPage() {
  const { isDarkMode, colors } = useTheme();
  const [topics, setTopics] = useState<TopicSubmission[]>([]);
  const [groupSessions, setGroupSessions] = useState<GroupSession[]>([]);
  const [votes, setVotes] = useState<TopicVote[]>([]);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"topics" | "sessions">("topics");

  // Preserve teammate's existing theme logic
  useEffect(() => {
    // Load and apply saved theme preferences on mount
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("pico-theme");
      const savedDarkMode = localStorage.getItem("pico-dark-mode");
      const defaultTheme = localStorage.getItem("pico-default-theme");
      const defaultDarkMode = localStorage.getItem("pico-default-dark-mode");

      const root = document.documentElement;

      // Apply saved theme, or default theme, or fallback to theme 4 (Forest)
      let themeId = 4; // Fallback
      if (savedTheme) {
        themeId = parseInt(savedTheme);
      } else if (defaultTheme) {
        themeId = parseInt(defaultTheme);
      }
      root.className = `theme-${themeId}`;

      // Apply saved dark mode, or default dark mode, or fallback to true (dark mode)
      let isDark = true; // Fallback
      if (savedDarkMode !== null) {
        isDark = savedDarkMode === "true";
      } else if (defaultDarkMode !== null) {
        isDark = defaultDarkMode === "true";
      }
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, []);

  useEffect(() => {
    // Load topics and votes from localStorage
    if (typeof window !== "undefined") {
      const savedTopics = localStorage.getItem("group-topics");
      const savedVotes = localStorage.getItem("group-votes");
      const savedGroupSessions = localStorage.getItem("group-sessions");

      if (savedTopics) {
        setTopics(JSON.parse(savedTopics));
      } else {
        setTopics(mockTopicSubmissions);
      }
      if (savedVotes) {
        setVotes(JSON.parse(savedVotes));
      } else {
        setVotes(mockTopicVotes);
      }
      if (savedGroupSessions) {
        setGroupSessions(JSON.parse(savedGroupSessions));
      } else {
        setGroupSessions(mockGroupSessions);
      }
    }
  }, []);

  // Preserve teammate's theme change listener
  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      if (typeof window !== "undefined") {
        const savedDarkMode = localStorage.getItem("pico-dark-mode");
        // Note: We're using the useTheme hook for this now
      }
    };

    // Initial check
    checkDarkMode();

    // Listen for storage changes (when theme is toggled)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "pico-dark-mode") {
        checkDarkMode();
      }
    };

    // Set up periodic check for theme changes
    const interval = setInterval(checkDarkMode, 1000);

    // Add event listeners
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
    }

    // Cleanup
    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange);
      }
    };
  }, []);

  const handleTopicSubmit = (
    newTopic: Omit<TopicSubmission, "id" | "submittedAt" | "status">
  ) => {
    const topic: TopicSubmission = {
      ...newTopic,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    const updatedTopics = [topic, ...topics];
    setTopics(updatedTopics);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("group-topics", JSON.stringify(updatedTopics));
    }
  };

  const handleVote = (topicId: string, voteType: "upvote" | "downvote") => {
    // Remove existing vote by this user
    const filteredVotes = votes.filter(
      (v) => !(v.topicId === topicId && v.studentId === "current-student")
    );

    // Add new vote
    const newVote: TopicVote = {
      id: Date.now().toString(),
      topicId,
      studentId: "current-student",
      studentName: "Current Student",
      vote: voteType,
      createdAt: new Date().toISOString(),
    };

    const updatedVotes = [...filteredVotes, newVote];
    setVotes(updatedVotes);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("group-votes", JSON.stringify(updatedVotes));
    }
  };

  const textColor = isDarkMode ? "text-white" : "text-black";
  const mutedTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";

  return (
    <Layout>
      <Head>
        <title>Group Sessions - Pineder</title>
        <meta
          name="description"
          content="Join group study sessions and vote on learning topics on Pineder"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="min-h-screen"
        style={{ backgroundColor: colors.background.primary }}
      >
        {/* Header - Minimalist Big Font Design */}
        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h1
              className="text-8xl md:text-9xl font-black tracking-tight leading-none mb-8"
              style={{ color: colors.text.primary }}
            >
              GROUP
            </h1>
            <h2
              className="text-9xl md:text-[12rem] font-black tracking-tightest leading-none mb-12 acumin-style"
              style={{
                color: colors.text.primary,
                fontSize: "clamp(6rem, 12vw, 14rem)",
                lineHeight: "0.6",
              }}
            >
              SESSIONS
            </h2>
            <p
              className="text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide"
              style={{ color: colors.text.secondary }}
            >
              Collaborative learning experiences where knowledge meets
              community. Join forces with peers to explore topics, share
              insights, and grow together.
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card
              className="text-center border shadow-lg"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
              }}
            >
              <CardContent className="p-6">
                <Lightbulb
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: colors.accent.primary }}
                />
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: colors.text.primary }}
                >
                  {topics.length}
                </div>
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  Topics Suggested
                </p>
              </CardContent>
            </Card>

            <Card
              className="text-center border shadow-lg"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
              }}
            >
              <CardContent className="p-6">
                <Target
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: colors.accent.success }}
                />
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: colors.text.primary }}
                >
                  {votes.length}
                </div>
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  Total Votes
                </p>
              </CardContent>
            </Card>

            <Card
              className="text-center border shadow-lg"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
              }}
            >
              <CardContent className="p-6">
                <Users
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: colors.accent.info }}
                />
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: colors.text.primary }}
                >
                  {groupSessions.length}
                </div>
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  Active Sessions
                </p>
              </CardContent>
            </Card>

            <Card
              className="text-center border shadow-lg"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
              }}
            >
              <CardContent className="p-6">
                <Calendar
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: colors.accent.warning }}
                />
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: colors.text.primary }}
                >
                  {groupSessions.filter((s) => s.status === "scheduled").length}
                </div>
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  Scheduled
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => setShowTopicForm(true)}
              className="h-14 text-lg px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              style={{
                background: `linear-gradient(to right, ${colors.accent.secondary}, ${colors.accent.success})`,
                color: colors.text.inverse,
              }}
            >
              <Plus className="w-6 h-6 mr-2" />
              Suggest New Topic
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div
              className="flex space-x-1 p-1 rounded-xl"
              style={{ backgroundColor: colors.background.tertiary }}
            >
              <button
                onClick={() => setActiveTab("topics")}
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200"
                style={{
                  backgroundColor:
                    activeTab === "topics"
                      ? colors.background.primary
                      : "transparent",
                  color:
                    activeTab === "topics"
                      ? colors.text.primary
                      : colors.text.secondary,
                }}
              >
                <Target className="w-4 h-4 inline mr-2" />
                Topic Voting
              </button>
              <button
                onClick={() => setActiveTab("sessions")}
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200"
                style={{
                  backgroundColor:
                    activeTab === "sessions"
                      ? colors.background.primary
                      : "transparent",
                  color:
                    activeTab === "sessions"
                      ? colors.text.primary
                      : colors.text.secondary,
                }}
              >
                <Users className="w-4 h-6 inline mr-2" />
                Group Sessions
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "topics" ? (
              <TopicVoting topics={topics} votes={votes} onVote={handleVote} />
            ) : (
              <div className="text-center py-12">
                <Users
                  className="w-16 h-16 mx-auto mb-4"
                  style={{ color: colors.text.muted }}
                />
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Group Sessions Coming Soon
                </h3>
                <p style={{ color: colors.text.secondary }}>
                  Once topics are voted on and approved, group sessions will be
                  created here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Topic Submission Form */}
        <TopicSubmissionForm
          isOpen={showTopicForm}
          onClose={() => setShowTopicForm(false)}
          onSubmit={handleTopicSubmit}
        />
      </div>
    </Layout>
  );
}
