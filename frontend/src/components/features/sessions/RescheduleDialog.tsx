import { motion } from "framer-motion";
import { Button } from "../../../design/system/button";
import { Calendar, User, BookOpen, Clock } from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";
import { useState, useEffect } from "react";

interface RescheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  rescheduleReason: string;
  setRescheduleReason: (reason: string) => void;
  onSubmit: (newStartTime: string, newEndTime: string) => void;
}

export default function RescheduleDialog({
  isOpen,
  onClose,
  session,
  rescheduleReason,
  setRescheduleReason,
  onSubmit,
}: RescheduleDialogProps) {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  if (!isOpen || !session) return null;

  // Helper functions for time slot management
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
      "19:00",
      "20:00",
    ];
  };

  const isTimeAvailable = (day: string, time: string) => {
    // Check against mentor's actual availability
    if (!session?.mentor?.availability) return false;

    const dayMap: { [key: string]: number } = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 0,
    };

    const dayNumber = dayMap[day];
    const mentorAvailability = session.mentor.availability.find(
      (a: any) => a.dayOfWeek === dayNumber && a.isAvailable
    );

    if (!mentorAvailability) return false;

    const [hour] = time.split(":").map(Number);
    const startHour = new Date(mentorAvailability.startTime).getHours();
    const endHour = new Date(mentorAvailability.endTime).getHours();

    // Check if the time is within mentor's available hours
    const isWithinHours = hour >= startHour && hour < endHour;

    // Also check if this specific time slot is not already booked
    // This would require checking existing sessions for this mentor on this day/time
    // For now, we'll just check the time range
    return isWithinHours;
  };

  const handleSubmit = () => {
    if (selectedTime && rescheduleReason.trim()) {
      // Get the original session date and time
      const originalDate = new Date(session.date + " " + session.time);
      const dayOfWeek = originalDate.getDay();

      // Map day number to day name for availability check
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayName = dayNames[dayOfWeek];

      // Parse the selected time
      const [hour] = selectedTime.split(":").map(Number);
      if (isNaN(hour)) {
        alert("Invalid time selected. Please try again.");
        return;
      }

      // Create the start and end times for the same day
      const startTime = new Date(originalDate);
      startTime.setHours(hour, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setHours(hour + 1, 0, 0, 0);

      // Validate that the selected time is within mentor's availability
      const mentorAvailability = session?.mentor?.availability?.find(
        (a: any) => a.dayOfWeek === dayOfWeek && a.isAvailable
      );

      if (!mentorAvailability) {
        alert("Mentor is not available on this day.");
        return;
      }

      const startHour = new Date(mentorAvailability.startTime).getHours();
      const endHour = new Date(mentorAvailability.endTime).getHours();

      if (hour < startHour || hour >= endHour) {
        alert("Selected time is outside mentor's available hours.");
        return;
      }

      // Check if it's the same time as original
      if (selectedTime === session.time) {
        alert("Please select a different time than your current session.");
        return;
      }

      onSubmit(startTime.toISOString(), endTime.toISOString());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Request Reschedule
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg p-4 border border-gray-200 bg-gray-50">
              <h3 className="font-semibold mb-2 text-gray-900">
                Session Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">
                    {session.date} at {session.time}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">{session.mentor.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">{session.subject}</span>
                </div>
              </div>
            </div>

            {/* Same Day Time Selection */}
            <div>
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: colors.text.primary }}
              >
                Select New Time (Same Day) *
              </label>

              {/* Time Slots for the same day */}
              {(() => {
                // Get the original session date
                const originalDate = new Date(
                  session.date + " " + session.time
                );
                const dayOfWeek = originalDate.getDay();

                // Map day number to day name
                const dayNames = [
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ];
                const dayName = dayNames[dayOfWeek];

                // Check if mentor is available on this day
                const mentorAvailability = session?.mentor?.availability?.find(
                  (a: any) => a.dayOfWeek === dayOfWeek && a.isAvailable
                );

                // Count available time slots (excluding current time)
                const availableSlots = getAvailableTimes()
                  .slice(0, 12)
                  .filter((time) => {
                    const isAvailable = isTimeAvailable(dayName, time);
                    const isOriginalTime = time === session.time;
                    return isAvailable && !isOriginalTime;
                  });

                // If no available slots, show message
                if (!mentorAvailability || availableSlots.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <div className="text-gray-500 mb-4">
                        <Clock className="w-12 h-12 mx-auto mb-2" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                          No Available Times
                        </h3>
                        <p className="text-sm text-gray-600">
                          {!mentorAvailability
                            ? "Mentor is not available on this day."
                            : "All time slots on this day are either unavailable or already booked."}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>• Try rescheduling to a different day</p>
                        <p>• Contact the mentor directly</p>
                        <p>• Consider cancelling and booking a new session</p>
                      </div>
                    </div>
                  );
                }

                // Show available time slots
                return (
                  <>
                    <div className="grid grid-cols-4 gap-2">
                      {getAvailableTimes()
                        .slice(0, 12)
                        .map((time) => {
                          const isAvailable = isTimeAvailable(dayName, time);
                          const isSelected = selectedTime === time;
                          const isOriginalTime = time === session.time;

                          return (
                            <button
                              key={time}
                              onClick={() => {
                                if (isAvailable && !isOriginalTime) {
                                  setSelectedTime(time);
                                }
                              }}
                              disabled={!isAvailable || isOriginalTime}
                              className={`w-full text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                                isOriginalTime
                                  ? "cursor-not-allowed opacity-30 bg-gray-100"
                                  : !isAvailable
                                  ? "cursor-not-allowed opacity-50"
                                  : "cursor-pointer hover:scale-105"
                              }`}
                              style={{
                                backgroundColor: isSelected
                                  ? "rgba(120, 200, 65, 0.3)"
                                  : isOriginalTime
                                  ? "#F3F4F6"
                                  : colors.background.primary,
                                color: isSelected
                                  ? colors.text.primary
                                  : isOriginalTime
                                  ? "#9CA3AF"
                                  : isAvailable
                                  ? colors.text.primary
                                  : "#6B7280",
                                border: `2px solid ${
                                  isOriginalTime
                                    ? "#D1D5DB"
                                    : isAvailable
                                    ? "#78C841"
                                    : "#E5E7EB"
                                }`,
                              }}
                            >
                              {time}
                              {isOriginalTime && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Current
                                </div>
                              )}
                            </button>
                          );
                        })}
                    </div>

                    <div className="mt-3 text-xs text-gray-600">
                      <p>
                        • Select a different time on the same day as your
                        original session
                      </p>
                      <p>• Gray slots are unavailable or your current time</p>
                      <p>
                        • {availableSlots.length} available time slot
                        {availableSlots.length !== 1 ? "s" : ""} found
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                Reason for Rescheduling *
              </label>
              <textarea
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                placeholder="Please explain why you need to reschedule this session..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !selectedTime ||
                  !rescheduleReason.trim() ||
                  (() => {
                    // Check if there are any available time slots
                    const originalDate = new Date(
                      session.date + " " + session.time
                    );
                    const dayOfWeek = originalDate.getDay();
                    const dayNames = [
                      "Sun",
                      "Mon",
                      "Tue",
                      "Wed",
                      "Thu",
                      "Fri",
                      "Sat",
                    ];
                    const dayName = dayNames[dayOfWeek];

                    const availableSlots = getAvailableTimes()
                      .slice(0, 12)
                      .filter((time) => {
                        const isAvailable = isTimeAvailable(dayName, time);
                        const isOriginalTime = time === session.time;
                        return isAvailable && !isOriginalTime;
                      });

                    return availableSlots.length === 0;
                  })()
                }
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Send Request
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
