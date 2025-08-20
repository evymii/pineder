import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, Clock, Target, User, BookOpen } from "lucide-react";
import { Card, CardContent } from "../../../design/system/card";
import { Button } from "../../../design/system/button";
import { Badge } from "../../../design/system/badge";
import { GroupSession } from "../../../core/lib/data/groupSessions";
import { SessionDetailsDialog } from "./SessionDetailsDialog";

interface SessionsSectionProps {
  groupSessions: GroupSession[];
  onSwitchToTopics: () => void;
}

export default function SessionsSection({
  groupSessions,
  onSwitchToTopics,
}: SessionsSectionProps) {
  const [selectedSession, setSelectedSession] = useState<GroupSession | null>(
    null
  );
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const handleDetailsClick = (session: GroupSession) => {
    setSelectedSession(session);
    setIsDetailsDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upcoming Group Sessions
        </h2>
        <p className="text-gray-600">Join scheduled group learning sessions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groupSessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
              scale: 1.03,
              y: -12,
              rotateX: 8,
              rotateY: 2,
              z: 40,
            }}
            whileTap={{ scale: 0.98 }}
            style={{ perspective: 1200 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-2xl h-full">
              <CardContent className="p-0 h-full flex flex-col">
                {/* Session Header with Mentor Info */}
                <div className="bg-white p-6 pb-4">
                  <div className="flex items-start space-x-4">
                    {/* Mentor Profile Picture */}
                    <div className="flex-shrink-0 relative">
                      <img
                        src={session.teacherImage || "/default-avatar.png"}
                        alt={`${session.teacherName || "Mentor"}'s profile`}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg"
                      />
                    </div>

                    {/* Session Title and Mentor Name */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                        {session.topic.topic}
                      </h3>
                      <p className="text-lg text-gray-600 font-medium mb-3">
                        {session.teacherName || "Mentor"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Session Details Grid */}
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Date */}
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700 font-medium">
                        {session.scheduledDate
                          ? new Date(session.scheduledDate).toLocaleDateString()
                          : "TBD"}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700 font-medium">
                        {session.scheduledTime || "TBD"}
                      </span>
                    </div>

                    {/* Category */}
                    <div
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                        session.category === "Frontend Development"
                          ? "bg-blue-50 border-blue-200"
                          : session.category === "Backend Development"
                          ? "bg-purple-50 border-purple-200"
                          : session.category === "Full-Stack Development"
                          ? "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <Target
                        className={`w-4 h-4 ${
                          session.category === "Frontend Development"
                            ? "text-blue-600"
                            : session.category === "Backend Development"
                            ? "text-purple-600"
                            : session.category === "Full-Stack Development"
                            ? "text-purple-600"
                            : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          session.category === "Frontend Development"
                            ? "text-blue-700"
                            : session.category === "Backend Development"
                            ? "text-purple-700"
                            : session.category === "Full-Stack Development"
                            ? "text-purple-700"
                            : "text-gray-700"
                        }`}
                      >
                        {session.category}
                      </span>
                    </div>

                    {/* Difficulty */}
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700 font-medium capitalize">
                        {session.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session Description */}
                <div className="px-6 pb-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {session.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{session.duration} min</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>
                              {session.participants.length}/
                              {session.maxParticipants}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 pb-6 mt-auto">
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      className="flex-1 bg-[#58CC02] hover:bg-[#46A302] text-white font-semibold rounded-xl"
                    >
                      Join Group Session
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDetailsClick(session)}
                      className="rounded-xl border-[#58CC02] text-[#58CC02] hover:bg-[#58CC02]/10"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {groupSessions.length === 0 && (
        <div className="py-16 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="mb-3 text-xl font-semibold text-gray-900">
            No upcoming sessions
          </h3>
          <p className="text-gray-600 mb-6">
            Check back later for new group learning opportunities.
          </p>
          <Button
            onClick={onSwitchToTopics}
            className="bg-[#58CC02] hover:bg-[#46A302] text-white font-semibold px-6 py-3 rounded-xl"
          >
            Submit a Topic
          </Button>
        </div>
      )}

      {/* Session Details Dialog */}
      <SessionDetailsDialog
        session={selectedSession}
        isOpen={isDetailsDialogOpen}
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setSelectedSession(null);
        }}
      />
    </motion.div>
  );
}
