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
import { Mentor as UseMentorsMentor } from "../../../core/hooks/useMentors";
import { Mentor as DataMentor } from "../../../core/lib/data/mentors";

type Mentor = UseMentorsMentor | DataMentor | any;
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
  mentorId: string;
  startTime: string;
  endTime: string;
  topic: string;
  message?: string;
}

export function SessionBookingDialog({
  mentor,
  isOpen,
  onClose,
  onConfirm,
}: SessionBookingDialogProps) {
  // Temporary fix for type issues - return early if mentor is not the expected type
  if (!mentor || !("userId" in mentor)) {
    return null;
  }
  const { isDarkMode, colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [sessionType] = useState<"1on1" | "group">("1on1");
  const [topic, setTopic] = useState<string>("");
  const [selectedCompensation, setSelectedCompensation] = useState<string>("");

  if (!mentor) return null;

  // Debug: Log mentor availability
  console.log("SessionBookingDialog - Mentor:", mentor);
  console.log(
    "SessionBookingDialog - Mentor availability:",
    "availability" in mentor ? mentor.availability : "No availability data"
  );

  const handleConfirm = () => {
    if (selectedDate && selectedTime && topic) {
      try {
        // Get the next occurrence of the selected day
        const dayMap: { [key: string]: number } = {
          Mon: 1,
          Tue: 2,
          Wed: 3,
          Thu: 4,
          Fri: 5,
          Sat: 6,
          Sun: 0,
        };

        const selectedDayNumber = dayMap[selectedDate];
        if (selectedDayNumber === undefined) {
          alert("Invalid day selected. Please try again.");
          return;
        }

        // Find the next occurrence of this day
        const today = new Date();
        const currentDay = today.getDay();
        let daysToAdd = selectedDayNumber - currentDay;
        if (daysToAdd <= 0) daysToAdd += 7; // Next week if today or past

        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysToAdd);

        // Parse the time
        const [hour] = selectedTime.split(":").map(Number);
        if (isNaN(hour)) {
          alert("Invalid time selected. Please try again.");
          return;
        }

        const startTime = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate(),
          hour,
          0,
          0
        ).toISOString();
        const endTime = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate(),
          hour + 1,
          0,
          0
        ).toISOString();

        const sessionData: SessionData = {
          mentorId: "_id" in mentor ? mentor._id : mentor.id.toString(),
          startTime,
          endTime,
          topic,
          message: selectedCompensation
            ? `Compensation: ${selectedCompensation}`
            : undefined,
        };

        console.log("Creating session with data:", sessionData);
        onConfirm(sessionData);
        onClose();
      } catch (error) {
        console.error("Error creating session:", error);
        alert("Error creating session. Please try again.");
      }
    } else {
      alert("Please select a date, time, and enter a topic.");
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

  const getMentorAvailabilityForDay = (dayName: string) => {
    if (!mentor || !("availability" in mentor) || !mentor.availability)
      return [];

    // Map abbreviated day names to day numbers (1 = Monday, 2 = Tuesday, etc.)
    const dayMap: { [key: string]: number } = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 0,
    };

    const dayNumber = dayMap[dayName];
    if (dayNumber === undefined) return [];

    // Filter availability for this specific day
    const dayAvailability = mentor.availability.filter(
      (slot) => slot.dayOfWeek === dayNumber && slot.isAvailable
    );

    // Return unique start times
    return Array.from(
      new Set(dayAvailability.map((slot) => slot.startTime))
    ).sort();
  };

  const isTimeAvailable = (dayName: string, time: string) => {
    const availableTimes = getMentorAvailabilityForDay(dayName);
    return availableTimes.includes(time);
  };

  // Debug: Log available times for each day (after function is defined)
  if (mentor && "availability" in mentor && mentor.availability) {
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
      const availableTimes = getMentorAvailabilityForDay(day);
      console.log(`${day} available times:`, availableTimes);
    });
  }

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
              className="absolute z-20 w-12 h-12 p-0 transition-all duration-200 rounded-full top-4 right-4 hover:scale-110"
              style={{
                color: colors.text.primary,
                backgroundColor: colors.background.tertiary,
                borderColor: colors.border.primary,
              }}
            >
              <X className="w-6 h-6" />
            </Button>

            <div className="p-8">
              {/* Top Section - Teacher Profile and Information with Enhanced Styling */}
              <div
                className={`flex mb-8 border-b pb-8 transition-colors duration-200 ${
                  isDarkMode ? "border-white/20" : "border-gray-200"
                }`}
              >
                {/* Left side - Profile Picture with Enhanced Styling and Animations */}
                <div className="flex-shrink-0 w-52">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="w-full overflow-hidden transition-all duration-200 border-4 shadow-2xl h-72 rounded-2xl"
                      style={{
                        backgroundColor: colors.background.tertiary,
                        borderColor: colors.border.primary,
                      }}
                    >
                      <ImageWithFallback
                        src={
                          "userId" in mentor
                            ? mentor.userId.avatar
                            : mentor.image
                        }
                        alt={
                          "userId" in mentor
                            ? `${mentor.userId.firstName} ${mentor.userId.lastName}`
                            : mentor.name
                        }
                        className="object-cover w-full h-full"
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
                      {"userId" in mentor
                        ? `${mentor.userId.firstName} ${mentor.userId.lastName}`
                        : mentor.name}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className={`text-lg transition-colors duration-200 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {mentor.userId.title}
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
                        {mentor.rating.toFixed(1)}
                      </span>
                      <span
                        className="transition-colors duration-200"
                        style={{ color: colors.text.secondary }}
                      >
                        ({mentor.totalSessions} sessions)
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
                      {mentor.specialties &&
                        mentor.specialties.map((skill, index) => (
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
                      className="mb-3 text-lg font-semibold transition-colors duration-200"
                      style={{ color: colors.text.primary }}
                    >
                      About
                    </h3>
                    <p
                      className="leading-relaxed transition-colors duration-200"
                      style={{ color: colors.text.secondary }}
                    >
                      {mentor.userId.bio}
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
                  className="mb-4 text-xl font-semibold transition-colors duration-200"
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
                              // Use mentor's actual availability
                              const isAvailable = isTimeAvailable(day, time);
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
                  className="mb-4 text-xl font-semibold transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  Session Topic
                </h4>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What would you like to discuss in this session?"
                  className="w-full p-3 transition-all duration-200 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="mb-4 text-xl font-semibold transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  What would you like to offer the mentor?
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                      className="p-4 transition-all duration-200 border-2 rounded-lg cursor-pointer hover:shadow-xl"
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
                          className="flex items-center justify-center w-12 h-12 transition-all duration-200 rounded-full"
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
                  className="px-8 py-4 text-xl font-semibold text-white transition-all duration-200 transform shadow-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-105 active:scale-95"
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
