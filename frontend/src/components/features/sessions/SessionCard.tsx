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
} from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface SessionCardProps {
  session: any;
  index: number;
  onJoinSession: (session: any) => void;
  onRequestReschedule: (session: any) => void;
  onRateSession: (session: any) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

export default function SessionCard({
  session,
  index,
  onJoinSession,
  onRequestReschedule,
  onRateSession,
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

  return (
    <motion.div
      key={session.id}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 * index, type: "spring" }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group"
    >
      <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col overflow-hidden relative">
        {/* Header section with white background */}
        <div className="bg-white p-3 text-gray-800 relative overflow-hidden border-b border-gray-200">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gray-100 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-gray-100 rounded-full translate-y-6 -translate-x-6"></div>

          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={session.mentor.image}
                  alt={session.mentor.name}
                  className="w-32 h-36 rounded-lg object-cover border-2 border-gray-200 shadow-lg"
                />
                <div className="flex flex-col space-y-1">
                  <Badge
                    className={`${getStatusColor(
                      session.status
                    )} border-2 border-gray-200 shadow-lg`}
                  >
                    <span className="flex items-center space-x-1 text-gray-700 font-semibold">
                      {getStatusIcon(session.status)}
                      <span className="capitalize">{session.status}</span>
                    </span>
                  </Badge>
                  <h3 className="font-bold text-lg text-gray-800 drop-shadow-sm">
                    {session.title}
                  </h3>
                  <p className="text-gray-600 text-sm font-medium">
                    {session.mentor.name}
                  </p>
                  {/* Status badge */}
                </div>
              </div>
            </div>
          </CardHeader>
        </div>

        <CardContent className="pt-6 flex-1 flex flex-col bg-white">
          {/* Clean Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer group">
              <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-gray-700 font-medium group-hover:text-blue-700 transition-colors duration-300">
                {session.date}
              </span>
            </div>

            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:bg-amber-50 hover:border-amber-200 hover:shadow-md transition-all duration-300 cursor-pointer group">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-gray-700 font-medium group-hover:text-amber-700 transition-colors duration-300">
                {session.time}
              </span>
            </div>

            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:bg-green-50 hover:border-green-200 hover:shadow-md transition-all duration-300 cursor-pointer group">
              <User className="w-5 h-5 text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-gray-700 font-medium group-hover:text-green-700 transition-colors duration-300">
                {session.subject}
              </span>
            </div>

            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:bg-orange-50 hover:border-orange-200 hover:shadow-md transition-all duration-300 cursor-pointer group">
              <Star className="w-5 h-5 text-orange-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-gray-700 font-medium group-hover:text-orange-700 transition-colors duration-300">
                {session.mentor.rating}
              </span>
            </div>
          </div>

          {/* Clean Student Choice */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 hover:bg-pink-50 hover:border-pink-200 hover:shadow-md transition-all duration-300 cursor-pointer group">
            <div className="flex items-center space-x-4">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                {session.studentChoice === "ice cream" && "🍦"}
                {session.studentChoice === "coffee" && "☕"}
                {session.studentChoice === "free" && "🎁"}
              </span>
              <div>
                <span className="text-sm text-gray-500 font-medium group-hover:text-pink-600 transition-colors duration-300">
                  Student Choice
                </span>
                <p className="text-gray-800 font-semibold text-lg group-hover:text-pink-700 transition-colors duration-300">
                  {session.studentChoice === "ice cream" && "Ice Cream"}
                  {session.studentChoice === "coffee" && "Coffee"}
                  {session.studentChoice === "free" && "Free"}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons with Duolingo green for primary action */}
          {session.status === "upcoming" && (
            <div className="mt-auto space-y-3">
              <Button
                className="w-full bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                size="lg"
                onClick={() => onJoinSession(session)}
              >
                <Video className="w-5 h-5 mr-2" />
                Join Session
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-2 border-[#58CC02] text-[#58CC02] hover:bg-[#58CC02]/10 hover:border-[#58CC02] rounded-xl font-medium transition-all duration-300"
                  onClick={() => onRequestReschedule(session)}
                >
                  <Clock3 className="w-4 h-4 mr-2" />
                  Reschedule
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-2 border-[#58CC02] text-[#58CC02] hover:bg-[#58CC02]/10 hover:border-[#58CC02] rounded-xl font-medium transition-all duration-300"
                  onClick={() => onRateSession(session)}
                >
                  <StarIcon className="w-4 h-4 mr-2" />
                  Rate
                </Button>
              </div>
            </div>
          )}

          {/* Completed session celebration with Duolingo green */}
          {session.status === "completed" && (
            <div className="mt-auto text-center">
              <div className="bg-[#58CC02]/10 p-4 rounded-xl border border-[#58CC02]/20">
                <div className="flex items-center justify-center space-x-2 text-[#58CC02]">
                  <span className="text-2xl">🎉</span>
                  <span className="font-bold text-lg">Session Completed!</span>
                  <span className="text-2xl">🎉</span>
                </div>
                <p className="text-[#58CC02] mt-1">Great job!</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
