import React, { useState } from "react";
import { Lightbulb } from "lucide-react";
import { TopicCard } from "./TopicCard";
import { TopicDetailsModal } from "./TopicDetailsModal";
import { TopicTabs } from "./TopicTabs";

interface Topic {
  id: string;
  topic: string;
  description: string;
  studentName: string;
  category: string;
  difficulty: string;
  status: string;
  submittedAt: string;
  studentImage?: string;
  studentLevel?: string;
  grade?: string;
  interests?: string;
}

interface TopicVotingProps {
  topics: Topic[];
  onVote: (topicId: string, voteType: "upvote" | "downvote") => void;
  onEdit?: (topic: Topic) => void;
  onDelete?: (topicId: string) => void;
  getVoteCount: (topicId: string, voteType: "upvote" | "downvote") => number;
  getUserVote: (topicId: string) => "upvote" | "downvote" | null;
}

const TopicVoting: React.FC<TopicVotingProps> = ({
  topics,
  onVote,
  onEdit,
  onDelete,
  getVoteCount,
  getUserVote,
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getMentorImage = (id: string) => {
    const images = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    ];
    return images[parseInt(id) % images.length];
  };

  const getFilteredTopics = () => {
    let filtered = topics;

    switch (activeTab) {
      case "frontend":
        filtered = filtered.filter(
          (topic) => topic.category === "Frontend Development"
        );
        break;
      case "backend":
        filtered = filtered.filter(
          (topic) => topic.category === "Backend Development"
        );
        break;
      case "fullstack":
        filtered = filtered.filter(
          (topic) => topic.category === "Full-Stack Development"
        );
        break;
      case "trending":
        filtered = filtered.filter(
          (topic) => getVoteCount(topic.id, "upvote") > 2
        );
        break;
      default:
        break;
    }

    return filtered;
  };

  const sortedTopics = getFilteredTopics().sort((a, b) => {
    const aVotes =
      getVoteCount(a.id, "upvote") - getVoteCount(a.id, "downvote");
    const bVotes =
      getVoteCount(b.id, "upvote") - getVoteCount(b.id, "downvote");
    return bVotes - aVotes;
  });

  const openDetails = (topic: Topic) => {
    setSelectedTopic(topic);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedTopic(null);
  };

  if (!topics || topics.length === 0) {
    return (
      <div className="text-center py-12">
        <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2 text-gray-600">
          No topics available
        </h3>
        <p className="text-gray-500">
          Be the first to submit a learning topic!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <TopicTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        topics={topics}
        getVoteCount={getVoteCount}
      />

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTopics.map((topic) => {
          const upvotes = getVoteCount(topic.id, "upvote");
          const downvotes = getVoteCount(topic.id, "downvote");
          const totalVotes = upvotes - downvotes;
          const userVote = getUserVote(topic.id);

          return (
            <TopicCard
              key={topic.id}
              topic={topic}
              upvotes={upvotes}
              downvotes={downvotes}
              totalVotes={totalVotes}
              userVote={userVote}
              onVote={onVote}
              onEdit={onEdit}
              onDelete={onDelete}
              getMentorImage={getMentorImage}
              responseCount={0}
            />
          );
        })}
      </div>

      {/* Details Modal */}
      <TopicDetailsModal
        topic={selectedTopic}
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        onVote={onVote}
        getVoteCount={getVoteCount}
        getMentorImage={getMentorImage}
      />
    </div>
  );
};

export default TopicVoting;
