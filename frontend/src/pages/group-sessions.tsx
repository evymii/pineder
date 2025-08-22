import { useState, useEffect } from "react";
import Head from "next/head";
import { DashboardLayout } from "../components/layout/Layout";
import GroupSessionsTabs from "../components/features/group-sessions/GroupSessionsTabs";
import TopicsSection from "../components/features/group-sessions/TopicsSection";
import SessionsSection from "../components/features/group-sessions/SessionsSection";
import { TopicEditModal } from "../components/features/group-sessions/TopicEditModal";
import CustomFooter from "../components/features/sessions/CustomFooter";
import {
  TopicSubmission,
  GroupSession,
  TopicVote,
  mockTopicSubmissions,
  mockGroupSessions,
  mockTopicVotes,
} from "../core/lib/data/groupSessions";

export default function GroupSessionsPage() {
  const [topics, setTopics] = useState<TopicSubmission[]>([]);
  const [groupSessions, setGroupSessions] = useState<GroupSession[]>([]);
  const [votes, setVotes] = useState<TopicVote[]>([]);
  const [activeTab, setActiveTab] = useState<"topics" | "sessions">("topics");
  const [editingTopic, setEditingTopic] = useState<TopicSubmission | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
  };

  const handleVote = (topicId: string, vote: "upvote" | "downvote") => {
    console.log("handleVote called:", { topicId, vote });

    const updatedVotes = [...votes];
    const existingVoteIndex = updatedVotes.findIndex(
      (v) => v.topicId === topicId && v.studentId === "student1"
    );

    if (existingVoteIndex >= 0) {
      console.log("Updating existing vote at index:", existingVoteIndex);
      updatedVotes[existingVoteIndex].vote = vote;
    } else {
      console.log("Adding new vote");
      updatedVotes.push({
        id: Date.now().toString(),
        topicId,
        studentId: "student1",
        studentName: "Alex Chen",
        vote,
        createdAt: new Date().toISOString(),
      });
    }

    console.log("Updated votes:", updatedVotes);
    setVotes(updatedVotes);

    if (typeof window !== "undefined") {
      localStorage.setItem("group-votes", JSON.stringify(updatedVotes));
    }
  };

  const handleEdit = (topic: TopicSubmission) => {
    console.log("handleEdit called:", { topic });
    setEditingTopic(topic);
    setIsEditModalOpen(true);
  };

  const handleDelete = (topicId: string) => {
    console.log("handleDelete called:", { topicId });

    const updatedTopics = topics.filter((topic) => topic.id !== topicId);
    setTopics(updatedTopics);

    if (typeof window !== "undefined") {
      localStorage.setItem("group-topics", JSON.stringify(updatedTopics));
    }
  };

  const handleSaveEdit = (updatedTopic: TopicSubmission) => {
    console.log("handleSaveEdit called:", { updatedTopic });

    const updatedTopics = topics.map((topic) =>
      topic.id === updatedTopic.id ? topic : updatedTopic
    );
    setTopics(updatedTopics);

    if (typeof window !== "undefined") {
      localStorage.setItem("group-topics", JSON.stringify(updatedTopics));
    }

    setEditingTopic(null);
    setIsEditModalOpen(false);
  };

  const handleSessionCreate = (
    newSession: Omit<
      GroupSession,
      "id" | "createdAt" | "updatedAt" | "participants" | "currentParticipants"
    >
  ) => {
    const session: GroupSession = {
      ...newSession,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      participants: [
        {
          id: "mentor1",
          name: newSession.teacherName || "Mentor",
          image: newSession.teacherImage || "",
          role: "teacher",
          joinedAt: new Date().toISOString(),
          status: "active",
        },
      ],
      currentParticipants: 1,
    };

    const updatedSessions = [...groupSessions, session];
    setGroupSessions(updatedSessions);

    if (typeof window !== "undefined") {
      localStorage.setItem("group-sessions", JSON.stringify(updatedSessions));
    }
  };

  const handleSessionDelete = (sessionId: string) => {
    const updatedSessions = groupSessions.filter(
      (session) => session.id !== sessionId
    );
    setGroupSessions(updatedSessions);

    if (typeof window !== "undefined") {
      localStorage.setItem("group-sessions", JSON.stringify(updatedSessions));
    }
  };

  const handleSessionEdit = (
    sessionId: string,
    updatedSession: Partial<GroupSession>
  ) => {
    const updatedSessions = groupSessions.map((session) =>
      session.id === sessionId
        ? { ...session, ...updatedSession, updatedAt: new Date().toISOString() }
        : session
    );
    setGroupSessions(updatedSessions);

    if (typeof window !== "undefined") {
      localStorage.setItem("group-sessions", JSON.stringify(updatedSessions));
    }
  };

  const sortedTopics = [...topics].sort((a, b) => {
    const aVotes =
      votes.filter((v) => v.topicId === a.id && v.vote === "upvote").length -
      votes.filter((v) => v.topicId === a.id && v.vote === "downvote").length;
    const bVotes =
      votes.filter((v) => v.topicId === b.id && v.vote === "upvote").length -
      votes.filter((v) => v.topicId === b.id && v.vote === "downvote").length;
    return bVotes - aVotes;
  });

  return (
    <DashboardLayout>
      <Head>
        <title>Group Sessions | Pineder</title>
        <meta
          name="description"
          content="Join group learning sessions and vote on topics with other students on Pineder."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <GroupSessionsTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {activeTab === "topics" && (
            <TopicsSection
              topics={sortedTopics}
              votes={votes}
              onTopicSubmit={handleTopicSubmit}
              onVote={handleVote}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {activeTab === "sessions" && (
            <SessionsSection
              groupSessions={groupSessions}
              onSwitchToTopics={() => setActiveTab("topics")}
              availableTopics={sortedTopics}
              onSessionCreate={handleSessionCreate}
              onSessionDelete={handleSessionDelete}
              onSessionEdit={handleSessionEdit}
            />
          )}
        </div>
      </div>

      {/* Edit Topic Modal */}
      <TopicEditModal
        topic={editingTopic}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTopic(null);
        }}
        onSave={handleSaveEdit}
      />

      {/* Custom Footer */}
      <CustomFooter />
    </DashboardLayout>
  );
}
