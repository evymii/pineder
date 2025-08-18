import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "../core/contexts/ThemeContext";
import { Card, CardContent } from "../design/system/card";
import { Button } from "../design/system/button";
import { Badge } from "../design/system/badge";
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
        <title>Group Study Sessions | Pineder</title>
        <meta
          name="description"
          content="Join collaborative group study sessions, suggest topics, and learn together with peers and mentors."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SpotlightHero
        title="SESSIONS"
        subtitle="IN THE"
        description="Suggest topics, vote on what to learn, and join collaborative group sessions with peers and mentors."
        quote="EMBRACE YOUR MOMENT IN THE GLARE OF THE SPOTLIGHT, WHERE YOUR ACHIEVEMENTS ARE CAST IN RADIANT LIGHT."
        author="Pineder Community"
      />

      <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex justify-center space-x-1 p-1 rounded-lg bg-background/50 border border-border/50">
            <Button
              variant={activeTab === "topics" ? "default" : "ghost"}
              onClick={() => setActiveTab("topics")}
              className="rounded-md"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Topics & Voting
            </Button>
            <Button
              variant={activeTab === "sessions" ? "default" : "ghost"}
              onClick={() => setActiveTab("sessions")}
              className="rounded-md"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Upcoming Sessions
            </Button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "topics" && (
          <div className="space-y-8">
            {/* Topic Submission Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: colors.text.primary }}
                    >
                      Suggest a Topic
                    </h2>
                    <Button
                      onClick={() => setShowTopicForm(true)}
                      className="bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)] text-white border-0"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Topic
                    </Button>
                  </div>
                  <p style={{ color: colors.text.secondary }}>
                    Share what you want to learn and get feedback from the
                    community.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Topics List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <TopicVoting
                topics={sortedTopics}
                votes={votes}
                onVote={handleVote}
              />
            </motion.div>
          </div>
        )}

        {activeTab === "sessions" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {groupSessions.map((session) => (
                <Card key={session.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: colors.text.primary }}
                      >
                        {session.topic.topic}
                      </h3>
                      <Badge variant="secondary">{session.status}</Badge>
                    </div>
                    <p
                      className="mb-4 text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {session.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Users
                          className="w-4 h-4"
                          style={{ color: colors.text.secondary }}
                        />
                        <span style={{ color: colors.text.secondary }}>
                          {session.participants.length}/
                          {session.maxParticipants}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Topic Submission Form Modal */}
      {showTopicForm && (
        <TopicSubmissionForm
          isOpen={showTopicForm}
          onClose={() => setShowTopicForm(false)}
          onSubmit={handleTopicSubmit}
        />
      )}
    </Layout>
  );
}
