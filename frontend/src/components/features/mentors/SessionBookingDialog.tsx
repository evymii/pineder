import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Star,
  Users,
  Video,
  MessageSquare,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { Mentor } from "../../../core/lib/data/mentors";
import { Button } from "../../../design/system/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../design/system/card";
import { Avatar, AvatarFallback } from "../../../design/system/avatar";
import { ImageWithFallback } from "../../common/figma/ImageWithFallback";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface SessionBookingDialogProps {
  mentor: Mentor | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (sessionData: SessionData) => void;
}

interface SessionData {
  mentorId: number;
  date: string;
  time: string;
  sessionType: "1on1"; // Only 1-on-1 sessions available
  topic: string;
  compensation: string;
}

export function SessionBookingDialog({
  mentor,
  isOpen,
  onClose,
  onConfirm,
}: SessionBookingDialogProps) {
  const { isDarkMode } = useTheme();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [sessionType] = useState<"1on1" | "group">("1on1");
  const [topic, setTopic] = useState<string>("");
  const [selectedCompensation, setSelectedCompensation] = useState<string>("");

  if (!mentor) return null;

  const handleConfirm = () => {
    if (selectedDate && selectedTime && topic) {
      const sessionData: SessionData = {
        mentorId: mentor.id,
        date: selectedDate,
        time: selectedTime,
        sessionType: "1on1",
        topic,
        compensation: selectedCompensation,
      };
      onConfirm(sessionData);
      onClose();
    }
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const getAvailableTimes = () => {
    return [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
    ];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const isDateAvailable = (date: Date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl transition-all duration-200 ${
              isDarkMode
                ? "bg-[#222222] border border-white/20"
                : "bg-white border border-black/20"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={`absolute top-4 right-4 h-10 w-10 p-0 z-20 transition-colors duration-200 ${
                isDarkMode
                  ? "hover:bg-white/10 text-white"
                  : "hover:bg-black/10 text-black"
              }`}
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="p-8">
              {/* Top Section - Teacher Profile and Information */}
              <div
                className={`flex mb-8 border-b pb-8 transition-colors duration-200 ${
                  isDarkMode ? "border-white/20" : "border-gray-200"
                }`}
              >
                {/* Left side - Profile Picture */}
                <div className="w-52 flex-shrink-0">
                  <div
                    className={`w-full h-72 border-4 border-green-500/20 rounded-2xl overflow-hidden shadow-lg transition-colors duration-200 ${
                      isDarkMode ? "bg-[#333333]" : "bg-gray-100"
                    }`}
                  >
                    <ImageWithFallback
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right side - Teacher Information */}
                <div className="flex-1 pl-8">
                  {/* Teacher Name and Role */}
                  <div className="mb-6">
                    <h2
                      className={`text-3xl font-bold mb-2 transition-colors duration-200 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {mentor.name}
                    </h2>
                    <p
                      className={`text-lg transition-colors duration-200 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {mentor.role} at {mentor.company}
                    </p>
                  </div>

                  {/* Rating/Stars */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2">
                      <Star className="w-6 h-6 text-yellow-500 fill-current" />
                      <span
                        className={`text-2xl font-bold transition-colors duration-200 ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {mentor.rating}
                      </span>
                      <span
                        className={`transition-colors duration-200 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        ({mentor.sessions} sessions)
                      </span>
                    </div>
                  </div>

                  {/* All Expertise Fields */}
                  <div className="mb-6">
                    <h3
                      className={`text-lg font-semibold mb-3 transition-colors duration-200 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise &&
                        mentor.expertise.map((skill, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors duration-200 ${
                              isDarkMode
                                ? "bg-green-900/20 text-green-400 border-green-700"
                                : "bg-green-50 text-green-600 border-green-200"
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Full Description */}
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-3 transition-colors duration-200 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      About
                    </h3>
                    <p
                      className={`leading-relaxed transition-colors duration-200 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {mentor.about}
                    </p>
                  </div>
                </div>
              </div>

              {/* Weekly Schedule - Direct Time Selection */}
              <div className="mb-8">
                <h4
                  className={`text-xl font-semibold mb-4 transition-colors duration-200 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Select Available Time
                </h4>

                {/* Week Header - Days of Week */}
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div
                      key={day}
                      className={`p-2 text-center text-sm font-medium transition-colors duration-200 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Weekly Schedule Grid - Direct Time Selection */}
                <div className="grid grid-cols-6 gap-2">
                  {getAvailableDates()
                    .slice(0, 6)
                    .map((date, index) => {
                      const isAvailable = isDateAvailable(date);
                      const isToday =
                        date.toDateString() === new Date().toDateString();
                      const dayName = date.toLocaleDateString("en-US", {
                        weekday: "short",
                      });
                      const isSelected = selectedDate === formatDate(date);

                      return (
                        <div
                          key={index}
                          className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 min-h-40 ${
                            isToday
                              ? isDarkMode
                                ? "bg-blue-900/20 border-blue-600"
                                : "bg-blue-50 border-blue-300"
                              : isAvailable
                              ? isDarkMode
                                ? "bg-[#333333] border-gray-600"
                                : "bg-gray-50 border-gray-200"
                              : isDarkMode
                              ? "bg-[#333333] border-gray-700 opacity-50"
                              : "bg-gray-50 border-gray-100 opacity-50"
                          }`}
                        >
                          <div className="text-center mb-2">
                            <div
                              className={`text-xs mb-1 transition-colors duration-200 ${
                                isToday
                                  ? isDarkMode
                                    ? "text-blue-400"
                                    : "text-blue-600"
                                  : isDarkMode
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              {dayName}
                            </div>
                            <div
                              className={`font-medium mb-2 transition-colors duration-200 ${
                                isToday
                                  ? isDarkMode
                                    ? "text-blue-300"
                                    : "text-blue-700"
                                  : isDarkMode
                                  ? "text-gray-200"
                                  : "text-gray-700"
                              }`}
                            >
                              {date.getDate()}
                            </div>
                          </div>

                          {isAvailable && (
                            <div className="space-y-1">
                              {getAvailableTimes()
                                .slice(0, 8)
                                .map((time) => (
                                  <button
                                    key={time}
                                    onClick={() => {
                                      setSelectedDate(formatDate(date));
                                      setSelectedTime(time);
                                    }}
                                    className={`w-full text-xs px-2 py-1 rounded transition-all duration-200 ${
                                      selectedDate === formatDate(date) &&
                                      selectedTime === time
                                        ? "bg-blue-500 text-white shadow-md"
                                        : isDarkMode
                                        ? "bg-green-900/20 text-green-400 hover:bg-green-800"
                                        : "bg-green-50 text-green-600 hover:bg-green-100"
                                    }`}
                                  >
                                    {time}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Session Topic */}
              <div className="mb-8">
                <h4
                  className={`text-xl font-semibold mb-4 transition-colors duration-200 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Session Topic
                </h4>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What would you like to discuss in this session?"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                    isDarkMode
                      ? "border-white/20 bg-black/60 text-white"
                      : "border-black/20 bg-gray-100 text-black"
                  }`}
                  rows={2}
                />
              </div>

              {/* Compensation Options */}
              <div className="mb-8">
                <h4
                  className={`text-xl font-semibold mb-4 transition-colors duration-200 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  What would you like to offer the mentor?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    onClick={() => setSelectedCompensation("ice-cream")}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      selectedCompensation === "ice-cream"
                        ? "border-blue-500 bg-black/80 shadow-md"
                        : "border-gray-600 hover:border-blue-400 bg-black/60 hover:bg-black/80"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selectedCompensation === "ice-cream"
                            ? "bg-blue-500/20"
                            : "bg-blue-500/20"
                        }`}
                      >
                        <span className="text-2xl">🍦</span>
                      </div>
                      <div>
                        <h5
                          className={`font-semibold transition-colors duration-200 ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          Free Ice Cream
                        </h5>
                        <p
                          className={`text-sm transition-colors duration-200 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Treat your mentor to a sweet session
                        </p>
                      </div>
                      {selectedCompensation === "ice-cream" && (
                        <CheckCircle className="w-6 h-6 text-blue-500 ml-auto" />
                      )}
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedCompensation("coffee")}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      selectedCompensation === "coffee"
                        ? "border-green-500 bg-black/80 shadow-md"
                        : "border-gray-600 hover:border-green-400 bg-black/60 hover:bg-black/80"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selectedCompensation === "coffee"
                            ? "bg-green-500/20"
                            : "bg-green-500/20"
                        }`}
                      >
                        <span className="text-2xl">☕</span>
                      </div>
                      <div>
                        <h5
                          className={`font-semibold transition-colors duration-200 ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          Free Coffee
                        </h5>
                        <p
                          className={`text-sm transition-colors duration-200 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Fuel your mentor&apos;s energy
                        </p>
                      </div>
                      {selectedCompensation === "coffee" && (
                        <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                      )}
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedCompensation("free")}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      selectedCompensation === "free"
                        ? "border-purple-500 bg-black/80 shadow-md"
                        : "border-gray-600 hover:border-purple-400 bg-black/60 hover:bg-black/80"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selectedCompensation === "free"
                            ? "bg-purple-500/20"
                            : "bg-purple-500/20"
                        }`}
                      >
                        <span className="text-2xl">🎁</span>
                      </div>
                      <div>
                        <h5
                          className={`font-semibold transition-colors duration-200 ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          Free Gift
                        </h5>
                        <p
                          className={`text-sm transition-colors duration-200 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          A small token of appreciation
                        </p>
                      </div>
                      {selectedCompensation === "free" && (
                        <CheckCircle className="w-6 h-6 text-purple-500 ml-auto" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <div className="text-center">
                <Button
                  onClick={handleConfirm}
                  disabled={
                    !selectedDate ||
                    !selectedTime ||
                    !topic ||
                    !selectedCompensation
                  }
                  className="px-8 py-4 text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <BookOpen className="w-6 h-6 mr-3" />
                  Confirm Booking
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
