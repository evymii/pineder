import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "../core/contexts/ThemeContext";
import { Card, CardContent } from "../design/system/card";
import { Button } from "../design/system/button";
import { Layout } from "../components/layout/Layout";
import { TopicSubmissionForm } from "../components/features/group-sessions/TopicSubmissionForm";
import { TopicVoting } from "../components/features/group-sessions/TopicVoting";
import { SpotlightHero } from "../components/shared/SpotlightHero";
import { Plus, Target, Users, Calendar, Lightbulb } from "lucide-react";
import {
  TopicSubmission,
  GroupSession,
  TopicVote,
  mockTopicSubmissions,
  mockGroupSessions,
  mockTopicVotes,
} from "../core/lib/data/groupSessions";

export default function GroupSessionsPage() {
  const { isDarkMode, colors } = useTheme();
  const [topics, setTopics] = useState<TopicSubmission[]>([]);
  const [groupSessions, setGroupSessions] = useState<GroupSession[]>([]);
  const [votes, setVotes] = useState<TopicVote[]>([]);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"topics" | "sessions">("topics");

  useEffect(() => {
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

  const handleTopicSubmit = (
    topic: Omit<TopicSubmission, "id" | "submittedAt" | "status">
  ) => {
    const newTopic: TopicSubmission = {
      ...topic,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
    const updatedTopics = [...topics, newTopic];
    setTopics(updatedTopics);

    if (typeof window !== "undefined") {
      localStorage.setItem("group-topics", JSON.stringify(updatedTopics));
    }

    setShowTopicForm(false);
  };

  const handleVote = (topicId: string, vote: "upvote" | "downvote") => {
    const updatedVotes = [...votes];
    const existingVoteIndex = updatedVotes.findIndex(
      (v) => v.topicId === topicId && v.studentId === "current-student"
    );

    if (existingVoteIndex >= 0) {
      updatedVotes[existingVoteIndex].vote = vote;
    } else {
      updatedVotes.push({
        id: Date.now().toString(),
        topicId,
        studentId: "current-student",
        studentName: "Current User",
        vote,
        createdAt: new Date().toISOString(),
      });
    }

    setVotes(updatedVotes);

    if (typeof window !== "undefined") {
      localStorage.setItem("group-votes", JSON.stringify(updatedVotes));
    }
  };

  const getVoteCount = (topicId: string) => {
    const topicVotes = votes.filter((v) => v.topicId === topicId);
    const upvotes = topicVotes.filter((v) => v.vote === "upvote").length;
    const downvotes = topicVotes.filter((v) => v.vote === "downvote").length;
    return upvotes - downvotes;
  };

  const sortedTopics = [...topics].sort(
    (a, b) => getVoteCount(b.id) - getVoteCount(a.id)
  );

  return (
    <Layout>
      <Head>
        <title>Group Sessions | Pineder</title>
        <meta
          name="description"
          content="Join group learning sessions and vote on topics with other students on Pineder."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SpotlightHero
        title="GROUP"
        subtitle="IN THE"
        description="Join collaborative learning sessions and vote on topics with other students on Pineder."
        quote="STAND WHERE TRIUMPH IS NOT ONLY SEEN BUT FELT, A BEACON TO THOSE WHO CHASE GREATNESS."
        author="Pineder Community"
      />

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Back to Sessions Link */}
        <div className="mb-6 flex justify-end">
          <Link href="/sessions">
            <Button variant="outline" size="sm">
              Back to Sessions
            </Button>
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px space-x-8">
              <button
                onClick={() => setActiveTab("topics")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "topics"
                    ? "border-[var(--pico-primary)] text-[var(--pico-primary)]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Topics & Voting
              </button>
              <button
                onClick={() => setActiveTab("sessions")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "sessions"
                    ? "border-[var(--pico-primary)] text-[var(--pico-primary)]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Upcoming Sessions
              </button>
            </nav>
          </div>
        </div>

        {/* Topics & Voting Tab */}
        {activeTab === "topics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Learning Topics
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vote on topics you&apos;d like to learn about in group
                    sessions
                  </p>
                </div>
                <Button
                  onClick={() => setShowTopicForm(true)}
                  className="bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)] text-white border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Topic
                </Button>
              </div>
            </div>

            {/* Topic Submission Form */}
            {showTopicForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6"
              >
                <TopicSubmissionForm
                  onSubmit={handleTopicSubmit}
                  isOpen={showTopicForm}
                  onClose={() => setShowTopicForm(false)}
                />
              </motion.div>
            )}

            {/* Topic Voting */}
            <TopicVoting
              topics={sortedTopics}
              votes={votes}
              onVote={handleVote}
            />
          </motion.div>
        )}

        {/* Upcoming Sessions Tab */}
        {activeTab === "sessions" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Group Sessions
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Join scheduled group learning sessions
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groupSessions.map((session) => (
                <Card
                  key={session.id}
                  className="transition-all duration-300 border-0 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3
                          className="text-lg font-semibold"
                          style={{ color: colors.text.primary }}
                        >
                          {session.topic.topic}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {session.topic.description}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar
                          className="w-4 h-4"
                          style={{ color: colors.text.secondary }}
                        />
                        <span style={{ color: colors.text.secondary }}>
                          {session.scheduledDate
                            ? new Date(
                                session.scheduledDate
                              ).toLocaleDateString()
                            : "TBD"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users
                          className="w-4 h-4"
                          style={{ color: colors.text.secondary }}
                        />
                        <span style={{ color: colors.text.secondary }}>
                          {session.participants.length}/
                          {session.maxParticipants}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        className="flex-1 bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)] text-white border-0"
                      >
                        Join Session
                      </Button>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {groupSessions.length === 0 && (
              <div className="py-12 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3
                  className="mb-2 text-xl font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  No upcoming sessions
                </h3>
                <p style={{ color: colors.text.secondary }}>
                  Check back later for new group learning opportunities.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
