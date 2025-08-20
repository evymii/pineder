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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../design/system/card";
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
  const { isDarkMode, colors } = useTheme();
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
          {/* Simple theme-aware background */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(0, 0, 0, 0.8)"
                  : "rgba(0, 0, 0, 0.1)",
              }}
            ></div>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30, rotateX: -15 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30, rotateX: -15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl transition-all duration-200 border"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: isDarkMode
                ? colors.background.secondary
                : colors.background.primary,
              borderColor: colors.border.primary,
              boxShadow: isDarkMode
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.8)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            }}
          >
            {/* Enhanced Close button with glow effect */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 h-12 w-12 p-0 z-20 transition-all duration-200 rounded-full hover:scale-110"
              style={{
                color: colors.text.primary,
                backgroundColor: colors.background.tertiary,
                borderColor: colors.border.primary,
              }}
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="p-8">
              {/* Top Section - Teacher Profile and Information with Enhanced Styling */}
              <div
                className={`flex mb-8 border-b pb-8 transition-colors duration-200 ${
                  isDarkMode ? "border-white/20" : "border-gray-200"
                }`}
              >
                {/* Left side - Profile Picture with Enhanced Styling and Animations */}
                <div className="w-52 flex-shrink-0">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="w-full h-72 border-4 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200"
                      style={{
                        backgroundColor: colors.background.tertiary,
                        borderColor: colors.border.primary,
                      }}
                    >
                      <ImageWithFallback
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Right side - Teacher Information with Enhanced Typography */}
                <div className="flex-1 pl-8">
                  {/* Teacher Name and Role with Enhanced Styling */}
                  <div className="mb-6">
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className={`text-3xl font-bold mb-2 transition-colors duration-200 bg-gradient-to-r bg-clip-text ${
                        isDarkMode
                          ? "text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300"
                          : "text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700"
                      }`}
                    >
                      {mentor.name}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className={`text-lg transition-colors duration-200 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {mentor.role} at {mentor.company}
                    </motion.p>
                  </div>

                  {/* Rating/Stars with Enhanced Styling and Animations */}
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Star className="w-6 h-6 text-yellow-500 fill-current" />
                      </div>
                      <span
                        className="text-2xl font-bold transition-colors duration-200"
                        style={{ color: colors.text.primary }}
                      >
                        {mentor.rating}
                      </span>
                      <span
                        className="transition-colors duration-200"
                        style={{ color: colors.text.secondary }}
                      >
                        ({mentor.sessions} sessions)
                      </span>
                    </div>
                  </motion.div>

                  {/* All Expertise Fields with Enhanced Styling and Animations */}
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
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
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.6 + index * 0.1,
                            }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 cursor-pointer"
                            style={{
                              backgroundColor: colors.background.secondary,
                              color: colors.text.primary,
                              borderColor: colors.border.primary,
                            }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                    </div>
                  </motion.div>

                  {/* Full Description with Enhanced Styling */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <h3
                      className="text-lg font-semibold mb-3 transition-colors duration-200"
                      style={{ color: colors.text.primary }}
                    >
                      About
                    </h3>
                    <p
                      className="leading-relaxed transition-colors duration-200"
                      style={{ color: colors.text.secondary }}
                    >
                      {mentor.about}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Weekly Schedule - Direct Time Selection with Enhanced Background and Animations */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h4
                  className="text-xl font-semibold mb-4 transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  Select Available Time
                </h4>

                {/* Week Days and Time Selection */}
                <div className="grid grid-cols-6 gap-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day, dayIndex) => (
                      <motion.div
                        key={day}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.9 + dayIndex * 0.1,
                        }}
                        className={`space-y-3 px-3 py-2 rounded-lg border-2 ${
                          dayIndex < 5 ? "border-r-2" : ""
                        }`}
                        style={{
                          borderColor: colors.border.primary,
                          backgroundColor: colors.background.secondary,
                        }}
                      >
                        {/* Day Header */}
                        <div className="text-center">
                          <div
                            className="text-sm font-medium transition-colors duration-200"
                            style={{ color: colors.text.primary }}
                          >
                            {day}
                          </div>
                        </div>

                        {/* Time Slots */}
                        <div className="space-y-2">
                          {getAvailableTimes()
                            .slice(0, 8)
                            .map((time, timeIndex) => {
                              // Create consistent availability based on day and time indices
                              const isAvailable =
                                (dayIndex + timeIndex) % 3 !== 0; // More consistent pattern
                              const isSelected =
                                selectedDate === day && selectedTime === time;

                              return (
                                <motion.button
                                  key={time}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: 1.5 + timeIndex * 0.05,
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    if (isAvailable) {
                                      setSelectedDate(day);
                                      setSelectedTime(time);
                                    }
                                  }}
                                  disabled={!isAvailable}
                                  className={`w-full text-xs px-2 py-1 rounded transition-all duration-200 ${
                                    !isAvailable
                                      ? "cursor-not-allowed"
                                      : "cursor-pointer"
                                  }`}
                                  style={{
                                    backgroundColor: isSelected
                                      ? "rgba(120, 200, 65, 0.3)"
                                      : colors.background.primary,
                                    color: isSelected
                                      ? colors.text.primary
                                      : isAvailable
                                      ? colors.text.primary
                                      : "#6B7280",
                                    border: `2px solid ${
                                      isAvailable ? "#78C841" : "#000000"
                                    }`,
                                  }}
                                >
                                  {time}
                                </motion.button>
                              );
                            })}
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              </motion.div>

              {/* Session Topic with Enhanced Styling and Animations */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <h4
                  className="text-xl font-semibold mb-4 transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  Session Topic
                </h4>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What would you like to discuss in this session?"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                  rows={2}
                />
              </motion.div>

              {/* Compensation Options with Enhanced Background Styling and Animations */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <h4
                  className="text-xl font-semibold mb-4 transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  What would you like to offer the mentor?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      key: "ice-cream",
                      icon: "🍦",
                      title: "Free Ice Cream",
                      description: "Treat your mentor to a sweet session",
                      color: "pink",
                    },
                    {
                      key: "coffee",
                      icon: "☕",
                      title: "Free Coffee",
                      description: "Fuel your mentor's energy",
                      color: "amber",
                    },
                    {
                      key: "free",
                      icon: "🎁",
                      title: "Free Gift",
                      description: "A small token of appreciation",
                      color: "purple",
                    },
                  ].map((option, index) => (
                    <motion.div
                      key={option.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      onClick={() => setSelectedCompensation(option.key)}
                      className="p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer hover:shadow-xl"
                      style={{
                        backgroundColor:
                          selectedCompensation === option.key
                            ? colors.background.secondary
                            : colors.background.primary,
                        borderColor:
                          selectedCompensation === option.key
                            ? colors.accent.primary
                            : colors.border.primary,
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
                          style={{
                            backgroundColor:
                              selectedCompensation === option.key
                                ? colors.background.tertiary
                                : colors.background.secondary,
                          }}
                        >
                          <span className="text-2xl">{option.icon}</span>
                        </div>
                        <div>
                          <h5
                            className="font-semibold transition-colors duration-200"
                            style={{ color: colors.text.primary }}
                          >
                            {option.title}
                          </h5>
                          <p
                            className="text-sm transition-colors duration-200"
                            style={{ color: colors.text.secondary }}
                          >
                            {option.description}
                          </p>
                        </div>
                        {selectedCompensation === option.key && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.3, type: "spring" }}
                          >
                            <CheckCircle
                              className="w-6 h-6 ml-auto"
                              style={{ color: colors.accent.primary }}
                            />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Confirm Button with Enhanced Styling and Animations */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
              >
                <Button
                  onClick={handleConfirm}
                  disabled={
                    !selectedDate ||
                    !selectedTime ||
                    !topic ||
                    !selectedCompensation
                  }
                  className="px-8 py-4 text-xl font-semibold text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: colors.accent.primary,
                  }}
                >
                  <BookOpen className="w-6 h-6 mr-3" />
                  Confirm Booking
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
