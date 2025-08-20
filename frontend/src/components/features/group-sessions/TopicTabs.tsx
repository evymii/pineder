import React from "react";
import { motion } from "framer-motion";
import { Target, BookOpen, Lightbulb, TrendingUp, Layers } from "lucide-react";
import { TopicSubmission } from "../../../core/lib/data/groupSessions";

interface TopicTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  topics: TopicSubmission[];
  getVoteCount: (topicId: string, voteType: "upvote" | "downvote") => number;
}

export const TopicTabs: React.FC<TopicTabsProps> = ({
  activeTab,
  setActiveTab,
  topics,
  getVoteCount,
}) => {
  const tabs = [
    { id: "all", label: "All Topics", icon: Lightbulb, count: topics.length },
    {
      id: "frontend",
      label: "Frontend",
      icon: Target,
      count: topics.filter((t) => t.category === "Frontend Development").length,
    },
    {
      id: "backend",
      label: "Backend",
      icon: BookOpen,
      count: topics.filter((t) => t.category === "Backend Development").length,
    },
    {
      id: "fullstack",
      label: "Fullstack",
      icon: Layers,
      count: topics.filter((t) => t.category === "Full-Stack Development")
        .length,
    },
    {
      id: "trending",
      label: "Trending",
      icon: TrendingUp,
      count: topics.filter((t) => getVoteCount(t.id, "upvote") > 2).length,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex pb-2 space-x-2 overflow-x-auto scrollbar-hide"
    >
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
            whileHover={{
              scale: 1.08,
              y: -6,
              rotateX: 10,
              rotateY: 3,
              z: 30,
            }}
            whileTap={{ scale: 0.95 }}
            style={{ perspective: 800 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-out whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id
                ? "bg-[#58CC02] text-white shadow-lg shadow-[#58CC02]/30"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-[#58CC02] hover:text-[#58CC02] hover:shadow-md"
            }`}
          >
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-4 h-4" />
            </motion.div>
            <span>{tab.label}</span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600 group-hover:bg-[#58CC02]/10 group-hover:text-[#58CC02]"
              }`}
            >
              {tab.count}
            </motion.span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};
