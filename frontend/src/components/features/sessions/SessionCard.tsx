import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "../../../design/system/card";
import { Button } from "../../../design/system/button";
import { Badge } from "../../../design/system/badge";
import {
  Calendar,
  Clock,
  User,
  Star,
  Video,
  Clock3,
  Star as StarIcon,
  MessageCircle,
  X,
} from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface SessionCardProps {
  session: any;
  index: number;
  onJoinSession: (session: any) => void;
  onRequestReschedule: (session: any) => void;
  onRateSession: (session: any) => void;
  onCancelSession: (session: any) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

export default function SessionCard({
  session,
  index,
  onJoinSession,
  onRequestReschedule,
  onRateSession,
  onCancelSession,
  getStatusColor,
  getStatusIcon,
}: SessionCardProps) {
  const { colors } = useTheme();

  // Duolingo-style color scheme with signature green for main elements
  const getCardColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "from-[#58CC02] to-[#46A302]";
      case "completed":
        return "from-[#58CC02] to-[#46A302]";
      case "cancelled":
        return "from-red-400 to-pink-500";
      default:
        return "from-[#58CC02] to-[#46A302]";
    }
  };

  const openTeamsChat = () => {
    const mentor = session?.mentor || {};
    let teamsUrl = "https://teams.microsoft.com/";
    if (mentor.teamsId) {
      teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${mentor.teamsId}`;
    } else if (mentor.email) {
      teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${mentor.email}`;
    }
    window.open(teamsUrl, "_blank");
  };

  return (
    <motion.div
      key={session.id}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 * index, type: "spring" }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group"
    >
      <Card className="relative flex flex-col h-full overflow-hidden transition-all duration-300 border-0 shadow-xl hover:shadow-2xl">
        {/* Header section with white background */}
        <div className="relative p-3 overflow-hidden text-gray-800 bg-white border-b border-gray-200">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-16 h-16 translate-x-8 -translate-y-8 bg-gray-100 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 -translate-x-6 translate-y-6 bg-gray-100 rounded-full"></div>

          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                                          src={session.mentor.userId?.avatar || session.mentor.avatar}
                  alt={session.mentor.name}
                  className="object-cover w-32 border-2 border-gray-200 rounded-lg shadow-lg h-36"
                />
                <div className="flex flex-col space-y-1">
                  <Badge
                    className={`${getStatusColor(
                      session.status
                    )} border-2 border-gray-200 shadow-lg`}
                  >
                    <span className="flex items-center space-x-1 font-semibold text-gray-700">
                      {getStatusIcon(session.status)}
                      <span className="capitalize">{session.status}</span>
                    </span>
                  </Badge>
                  <h3 className="text-lg font-bold text-gray-800 drop-shadow-sm">
                    {session.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">
                    {session.mentor.name}
                  </p>
                  {/* Status badge */}
                </div>
              </div>
            </div>
          </CardHeader>
        </div>

        <CardContent className="flex flex-col flex-1 pt-6 bg-white">
          {/* Clean Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center p-4 space-x-3 transition-all duration-300 border border-gray-100 cursor-pointer bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:shadow-md group">
              <Calendar className="flex-shrink-0 w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-medium text-gray-700 transition-colors duration-300 group-hover:text-blue-700">
                {session.date}
              </span>
            </div>

            <div className="flex items-center p-4 space-x-3 transition-all duration-300 border border-gray-100 cursor-pointer bg-gray-50 rounded-xl hover:bg-green-50 hover:border-green-200 hover:shadow-md group">
              <User className="flex-shrink-0 w-5 h-5 text-green-600 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-medium text-gray-700 transition-colors duration-300 group-hover:text-green-700">
                {session.subject}
              </span>
            </div>
          </div>

          {/* Clean Student Choice */}
          <div className="p-4 mb-6 transition-all duration-300 border border-gray-100 cursor-pointer bg-gray-50 rounded-xl hover:bg-pink-50 hover:border-pink-200 hover:shadow-md group">
            <div className="flex items-center space-x-4">
              <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                {session.studentChoice === "ice cream" && "🍦"}
                {session.studentChoice === "coffee" && "☕"}
                {session.studentChoice === "free" && "🎁"}
              </span>
              <div>
                <span className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-pink-600">
                  Student Choice
                </span>
                <p className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-pink-700">
                  {session.studentChoice === "ice cream" && "Ice Cream"}
                  {session.studentChoice === "coffee" && "Coffee"}
                  {session.studentChoice === "free" && "Free"}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons with Duolingo green for primary action */}
          {(session.status === "upcoming" ||
            session.status === "approved" ||
            session.status === "scheduled" ||
            session.status === "requested") && (
            <div className="mt-auto space-y-3">
              {/* Join Session and Teams Chat buttons side by side */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => onJoinSession(session)}
                >
                  <Video className="w-5 h-5 mr-2" />
                  Join Session
                </Button>

                {/* Teams Chat Button (direct) */}
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-[#58CC02] text-[#58CC02] hover:bg-[#58CC02]/10 hover:border-[#58CC02] rounded-xl font-medium transition-all duration-300"
                  onClick={openTeamsChat}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Teams Chat
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-2 border-[#58CC02] text-[#58CC02] hover:bg-[#58CC02]/10 hover:border-[#58CC02] rounded-xl font-medium transition-all duration-300"
                  onClick={() => onRequestReschedule(session)}
                >
                  <Clock3 className="w-4 h-4 mr-1" />
                  Reschedule
                </Button>

                {/* Only show cancel button for sessions that can be cancelled */}
                {(session.status === "requested" ||
                  session.status === "approved") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-2 border-red-500 text-red-500 hover:bg-red-500/10 hover:border-red-500 rounded-xl font-medium transition-all duration-300"
                    onClick={() => onCancelSession(session)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Rating button for completed sessions */}
          {session.status === "completed" && !session.rating && (
            <div className="mt-auto">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:border-yellow-500 rounded-xl font-medium transition-all duration-300"
                onClick={() => onRateSession(session)}
              >
                <StarIcon className="w-4 h-4 mr-1" />
                Rate Session
              </Button>
            </div>
          )}

          {/* Show rating if already rated */}
          {session.status === "completed" && session.rating && (
            <div className="mt-auto text-center">
              <div className="flex items-center justify-center space-x-1 text-yellow-500">
                <StarIcon className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">
                  Rated: {session.rating}/5
                </span>
              </div>
            </div>
          )}

          {/* Completed session celebration with Duolingo green */}
          {session.status === "completed" && (
            <div className="mt-auto text-center">
              <div className="bg-[#58CC02]/10 p-4 rounded-xl border border-[#58CC02]/20">
                <div className="flex items-center justify-center space-x-2 text-[#58CC02]">
                  <span className="text-2xl">🎉</span>
                  <span className="text-lg font-bold">Session Completed!</span>
                  <span className="text-2xl">🎉</span>
                </div>
                <p className="text-[#58CC02] mt-1">Great job!</p>
              </div>
            </div>
          )}

          {/* Cancelled session indicator */}
          {session.status === "cancelled" && (
            <div className="mt-auto text-center">
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <div className="flex items-center justify-center space-x-2 text-red-600">
                  <span className="text-2xl">❌</span>
                  <span className="text-lg font-bold">Session Cancelled</span>
                </div>
                <p className="text-red-500 mt-1">
                  This session has been cancelled
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
