import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "../../../design/system/button";
import { TopicSubmissionForm } from "./TopicSubmissionForm";
import TopicVoting from "./TopicVoting";
import {
  TopicSubmission,
  TopicVote,
} from "../../../core/lib/data/groupSessions";

interface TopicsSectionProps {
  topics: TopicSubmission[];
  votes: TopicVote[];
  onTopicSubmit: (
    topic: Omit<TopicSubmission, "id" | "submittedAt" | "status">
  ) => void;
  onVote: (topicId: string, vote: "upvote" | "downvote") => void;
  onEdit?: (topic: TopicSubmission) => void;
  onDelete?: (topicId: string) => void;
}

export default function TopicsSection({
  topics,
  votes,
  onTopicSubmit,
  onVote,
  onEdit,
  onDelete,
}: TopicsSectionProps) {
  const [showTopicForm, setShowTopicForm] = useState(false);

  // Transform topics to match the expected interface
  const transformedTopics = topics.map((topic) => ({
    id: topic.id,
    topic: topic.topic,
    description: topic.description,
    studentName: topic.studentName,
    studentImage: topic.studentImage,
    category: topic.category,
    difficulty: topic.difficulty,
    status: topic.status,
    submittedAt: topic.submittedAt,
    studentLevel: topic.studentLevel,
    grade: topic.grade,
    interests: topic.interests,
    email: topic.email,
  }));

  const getVoteCount = (topicId: string, voteType: "upvote" | "downvote") => {
    const topicVotes = votes.filter((v) => v.topicId === topicId);
    return topicVotes.filter((v) => v.vote === voteType).length;
  };

  const getUserVote = (topicId: string) => {
    // For demo purposes, let's use the first student in the votes as the current user
    // In a real app, this would come from authentication context
    const userVote = votes.find(
      (v) => v.topicId === topicId && v.studentId === "student1"
    );

    // Debug logging
    console.log("getUserVote called for topic:", topicId);
    console.log("Available votes:", votes);
    console.log("Found user vote:", userVote);

    return userVote?.vote || null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Learning Topics
            </h2>
            <p className="text-gray-600">
              Vote on topics you&apos;d like to learn about in group sessions
            </p>
          </div>
          <Button
            onClick={() => setShowTopicForm(true)}
            className="bg-[#58CC02] hover:bg-[#46A302] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
          className="mb-8"
        >
          <TopicSubmissionForm
            onSubmit={onTopicSubmit}
            isOpen={showTopicForm}
            onClose={() => setShowTopicForm(false)}
          />
        </motion.div>
      )}

      {/* Topic Voting */}
      <TopicVoting
        topics={transformedTopics}
        onVote={onVote}
        onEdit={onEdit}
        onDelete={onDelete}
        getVoteCount={getVoteCount}
        getUserVote={getUserVote}
      />
    </motion.div>
  );
}
