import React from "react";
import { motion } from "framer-motion";
import { Button } from "../../../design/system/button";
import { Lightbulb, Users } from "lucide-react";

interface GroupSessionsTabsProps {
  activeTab: "topics" | "sessions";
  setActiveTab: (tab: "topics" | "sessions") => void;
}

export default function GroupSessionsTabs({
  activeTab,
  setActiveTab,
}: GroupSessionsTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-8"
    >
      {/* Enhanced tabs with Duolingo green styling */}
      <div className="flex flex-wrap justify-center p-3 gap-3 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-3xl shadow-xl border border-gray-200/50 backdrop-blur-sm">
        <motion.div
          whileHover={{
            scale: 1.04,
            y: -6,
            rotateX: 8,
            rotateY: 3,
            z: 30,
          }}
          whileTap={{ scale: 0.96, y: -1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ perspective: 800 }}
        >
          <Button
            variant={activeTab === "topics" ? "default" : "ghost"}
            onClick={() => setActiveTab("topics")}
            className={`rounded-2xl transition-all duration-300 ease-out hover:scale-105 transform px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold ${
              activeTab === "topics"
                ? "bg-[#58CC02] hover:bg-[#46A302] text-white shadow-xl shadow-[#58CC02]/30 border-2 border-[#58CC02]"
                : "hover:bg-[#58CC02]/10 hover:shadow-md border-2 border-transparent hover:border-[#58CC02]/30"
            }`}
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            Topics & Voting
          </Button>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.04,
            y: -6,
            rotateX: 8,
            rotateY: 3,
            z: 30,
          }}
          whileTap={{ scale: 0.96, y: -1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ perspective: 800 }}
        >
          <Button
            variant={activeTab === "sessions" ? "default" : "ghost"}
            onClick={() => setActiveTab("sessions")}
            className={`rounded-2xl transition-all duration-300 ease-out hover:scale-105 transform px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold ${
              activeTab === "sessions"
                ? "bg-[#58CC02] hover:bg-[#46A302] text-white shadow-xl shadow-[#58CC02]/30 border-2 border-[#58CC02]"
                : "hover:bg-[#58CC02]/10 hover:shadow-md border-2 border-transparent hover:border-[#58CC02]/30"
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            Upcoming Sessions
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
