import React from "react";
import { motion } from "framer-motion";
import {
  X,
  Users,
  Calendar,
  Clock,
  MapPin,
  Video,
  ExternalLink,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../design/system/dialog";
import { Button } from "../../../design/system/button";
import { Badge } from "../../../design/system/badge";
import { GroupSession } from "../../../core/lib/data/groupSessions";

interface SessionDetailsDialogProps {
  session: GroupSession | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SessionDetailsDialog: React.FC<SessionDetailsDialogProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  if (!session) return null;

  const handleJoinZoom = () => {
    if (session.meetingLink) {
      window.open(session.meetingLink, "_blank");
    }
  };

  const copyZoomLink = () => {
    if (session.meetingLink) {
      navigator.clipboard.writeText(session.meetingLink);
      // You could add a toast notification here
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-0 shadow-2xl rounded-3xl p-0 max-w-2xl max-h-[85vh] overflow-hidden [&>button]:hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <DialogTitle className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                  {session.topic.topic}
                </DialogTitle>
                <p className="text-gray-600 text-base">{session.description}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-6 overflow-y-auto max-h-[calc(85vh-280px)]">
            {/* Mentor Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 text-blue-600 mr-2" />
                Mentor Information
              </h3>
              <div className="flex items-center space-x-4">
                <img
                  src={session.teacherImage || "/default-avatar.png"}
                  alt={`${session.teacherName || "Mentor"}'s profile`}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg"
                />
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {session.teacherName || "Mentor"}
                  </h4>
                  <p className="text-gray-600 mb-2">
                    {session.category} • {session.difficulty} level
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 border-blue-200"
                    >
                      Expert
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 border-green-200"
                    >
                      Available
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Session Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 text-gray-600 mr-2" />
                Session Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {session.scheduledDate
                        ? new Date(session.scheduledDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "TBD"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">
                      {session.scheduledTime || "TBD"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">
                      {session.duration} minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-medium text-gray-900">
                      {session.participants.length}/{session.maxParticipants}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Zoom Meeting */}
            {session.meetingLink && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Video className="w-5 h-5 text-green-600 mr-2" />
                  Zoom Meeting
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-green-200">
                    <div className="flex items-center space-x-3">
                      <Video className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">
                        Meeting Link
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyZoomLink}
                      className="text-green-600 border-green-300 hover:bg-green-50"
                    >
                      Copy Link
                    </Button>
                  </div>
                  <Button
                    onClick={handleJoinZoom}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl py-3 flex items-center justify-center space-x-2"
                  >
                    <Video className="w-5 h-5" />
                    <span>Join Zoom Meeting</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Participants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 text-purple-600 mr-2" />
                Participants ({session.participants.length}/
                {session.maxParticipants})
              </h3>
              <div className="space-y-3">
                {session.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-purple-200"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={participant.image}
                        alt={`${participant.name}'s profile`}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {participant.name}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {participant.role}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        participant.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : participant.status === "waitlist"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }
                    >
                      {participant.status}
                    </Badge>
                  </div>
                ))}
                {session.participants.length < session.maxParticipants && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-2">
                      {session.maxParticipants - session.participants.length}{" "}
                      spots available
                    </p>
                    <Button
                      variant="outline"
                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      Join Waitlist
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-6 bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 py-3"
              >
                Close
              </Button>
              <Button
                onClick={handleJoinZoom}
                className="flex-1 bg-[#58CC02] hover:bg-[#46A302] text-white font-semibold py-3"
              >
                Join Group Session
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
