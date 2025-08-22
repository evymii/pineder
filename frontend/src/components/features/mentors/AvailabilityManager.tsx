import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../design/system/card";
import { Button } from "../../../design/system/button";
import { Badge } from "../../../design/system/badge";
import { Clock, Plus, X, Save, Calendar, CheckCircle } from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface DayAvailability {
  dayOfWeek: number;
  dayName: string;
  shortName: string;
  timeSlots: TimeSlot[];
}

const AvailabilityManager: React.FC = () => {
  const { user } = useUser();
  const { isDarkMode, colors } = useTheme();
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const daysOfWeek = [
    { dayOfWeek: 1, dayName: "Monday", shortName: "Mon" },
    { dayOfWeek: 2, dayName: "Tuesday", shortName: "Tue" },
    { dayOfWeek: 3, dayName: "Wednesday", shortName: "Wed" },
    { dayOfWeek: 4, dayName: "Thursday", shortName: "Thu" },
    { dayOfWeek: 5, dayName: "Friday", shortName: "Fri" },
    { dayOfWeek: 6, dayName: "Saturday", shortName: "Sat" },
    { dayOfWeek: 0, dayName: "Sunday", shortName: "Sun" },
  ];

  const timeSlots = [
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

  useEffect(() => {
    // Initialize availability for all days
    const initialAvailability = daysOfWeek.map((day) => ({
      dayOfWeek: day.dayOfWeek,
      dayName: day.dayName,
      shortName: day.shortName,
      timeSlots: [],
    }));
    setAvailability(initialAvailability);

    // Fetch existing availability
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/mentors`,
        {
          headers: {
            "x-user-role": "mentor",
            "x-user-email": user?.emailAddresses[0]?.emailAddress || "",
            "x-user-id": user?.id || "",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched mentors data:", data);
        if (data.success && data.data && data.data.mentors) {
          // Find the current user's mentor profile
          const currentUserEmail = user?.emailAddresses[0]?.emailAddress;
          const currentMentor = data.data.mentors.find(
            (mentor: any) => mentor.userId?.email === currentUserEmail
          );

          if (currentMentor) {
            console.log("Found current mentor:", currentMentor);
            const existingSlots = currentMentor.availability || [];
            console.log("Existing slots from backend:", existingSlots);
            console.log("Number of existing slots:", existingSlots.length);

            const updatedAvailability = daysOfWeek.map((day) => {
              const daySlots = existingSlots.filter(
                (slot: any) => slot.dayOfWeek === day.dayOfWeek
              );
              console.log(
                `Day ${day.dayName} (${day.dayOfWeek}) slots from backend:`,
                daySlots
              );
              console.log(
                `Number of slots for ${day.dayName}:`,
                daySlots.length
              );

              const mappedSlots = daySlots.map((slot: any) => ({
                id: `${day.dayOfWeek}-${slot.startTime}-${slot.endTime}`,
                startTime: slot.startTime,
                endTime: slot.endTime,
                isAvailable: slot.isAvailable,
              }));

              console.log(`Mapped slots for ${day.dayName}:`, mappedSlots);

              return {
                dayOfWeek: day.dayOfWeek,
                dayName: day.dayName,
                shortName: day.shortName,
                timeSlots: mappedSlots,
              };
            });
            console.log("Final updated availability:", updatedAvailability);
            setAvailability(updatedAvailability);
          } else {
            console.log("Current user's mentor profile not found");
            const initialAvailability = daysOfWeek.map((day) => ({
              dayOfWeek: day.dayOfWeek,
              dayName: day.dayName,
              shortName: day.shortName,
              timeSlots: [],
            }));
            setAvailability(initialAvailability);
          }
        } else {
          console.log(
            "No mentors data returned from backend or success is false"
          );
          const initialAvailability = daysOfWeek.map((day) => ({
            dayOfWeek: day.dayOfWeek,
            dayName: day.dayName,
            shortName: day.shortName,
            timeSlots: [],
          }));
          setAvailability(initialAvailability);
        }
      } else {
        console.log("Response not ok, status:", response.status);
        const errorText = await response.text();
        console.log("Error response:", errorText);
        const initialAvailability = daysOfWeek.map((day) => ({
          dayOfWeek: day.dayOfWeek,
          dayName: day.dayName,
          shortName: day.shortName,
          timeSlots: [],
        }));
        setAvailability(initialAvailability);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTimeSlot = async (dayOfWeek: number, time: string) => {
    console.log(`Toggling time slot: Day ${dayOfWeek}, Time ${time}`);

    // Update local state immediately for UI responsiveness
    setAvailability((prev) => {
      const updatedAvailability = prev.map((day) => {
        if (day.dayOfWeek === dayOfWeek) {
          const existingSlot = day.timeSlots.find(
            (slot) => slot.startTime === time
          );

          if (existingSlot) {
            // Toggle existing slot
            const newTimeSlots = day.timeSlots.map((slot) =>
              slot.startTime === time
                ? { ...slot, isAvailable: !slot.isAvailable }
                : slot
            );
            console.log(
              `Toggled existing slot for ${day.dayName}:`,
              newTimeSlots
            );
            return {
              ...day,
              timeSlots: newTimeSlots,
            };
          } else {
            // Add new slot
            const newSlot = {
              id: `${dayOfWeek}-${time}-${Date.now()}`,
              startTime: time,
              endTime: time, // Will be updated to next hour
              isAvailable: true,
            };
            const newTimeSlots = [...day.timeSlots, newSlot];
            console.log(`Added new slot for ${day.dayName}:`, newSlot);
            return {
              ...day,
              timeSlots: newTimeSlots,
            };
          }
        }
        return day;
      });

      console.log("Updated availability state:", updatedAvailability);

      // Auto-save to database with updated availability
      autoSaveToDatabase(updatedAvailability);

      return updatedAvailability;
    });
  };

  const autoSaveToDatabase = async (currentAvailability: DayAvailability[]) => {
    try {
      setIsAutoSaving(true);

      console.log(
        "Auto-save started with current availability:",
        currentAvailability
      );

      // Filter only available slots
      const availableSlots = currentAvailability.map((day) => ({
        ...day,
        timeSlots: day.timeSlots.filter((slot) => slot.isAvailable),
      }));

      console.log("Available slots after filtering:", availableSlots);

      // Convert to backend format
      const backendAvailability = availableSlots.flatMap((day) =>
        day.timeSlots.map((slot) => ({
          dayOfWeek: day.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: true,
        }))
      );

      console.log("Backend availability format:", backendAvailability);
      console.log("User email:", user?.emailAddresses[0]?.emailAddress);
      console.log("User ID:", user?.id);

      const requestBody = {
        availability: backendAvailability,
      };

      console.log(
        "Sending request to:",
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/mentors/availability`
      );
      console.log("Request body:", requestBody);
      console.log("Request headers:", {
        "Content-Type": "application/json",
        "x-user-role": "mentor",
        "x-user-email": user?.emailAddresses[0]?.emailAddress || "",
        "x-user-id": user?.id || "",
      });

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/mentors/availability`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-role": "mentor",
            "x-user-email": user?.emailAddresses[0]?.emailAddress || "",
            "x-user-id": user?.id || "",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);
        if (data.success) {
          console.log("Auto-save successful");
        } else {
          console.error("Auto-save failed:", data.message);
        }
      } else {
        const errorText = await response.text();
        console.error("Auto-save failed:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error auto-saving availability:", error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const isTimeSlotAvailable = (dayOfWeek: number, time: string) => {
    const day = availability.find((d) => d.dayOfWeek === dayOfWeek);
    if (!day) return false;

    const slot = day.timeSlots.find((s) => s.startTime === time);
    return slot ? slot.isAvailable : false;
  };

  const saveAvailability = async () => {
    try {
      setIsSaving(true);

      // Convert to backend format - create slots for all available times
      const backendAvailability = availability.flatMap((day) =>
        day.timeSlots
          .filter((slot) => slot.isAvailable)
          .map((slot) => ({
            dayOfWeek: day.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: true,
          }))
      );

      console.log("Saving availability:", backendAvailability);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/mentors/availability`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-role": "mentor",
            "x-user-email": user?.emailAddresses[0]?.emailAddress || "",
            "x-user-id": user?.id || "",
          },
          body: JSON.stringify({
            availability: backendAvailability,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert("Availability updated successfully!");
        } else {
          throw new Error(data.message || "Failed to update availability");
        }
      } else {
        throw new Error("Failed to update availability");
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      alert("Failed to save availability. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading availability...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Manage Your Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weekly Schedule Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h4
            className="mb-4 text-xl font-semibold transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            Set Your Available Times
          </h4>

          {/* Week Days and Time Selection Grid */}
          <div className="grid grid-cols-7 gap-4">
            {daysOfWeek.map((day, dayIndex) => (
              <motion.div
                key={day.dayOfWeek}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.3 + dayIndex * 0.1,
                }}
                className={`space-y-3 px-3 py-2 rounded-lg border-2 ${
                  dayIndex < 6 ? "border-r-2" : ""
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
                    {day.shortName}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="space-y-2">
                  {timeSlots.map((time, timeIndex) => {
                    const isAvailable = isTimeSlotAvailable(
                      day.dayOfWeek,
                      time
                    );

                    return (
                      <motion.button
                        key={time}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.5 + timeIndex * 0.05,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleTimeSlot(day.dayOfWeek, time)}
                        className={`w-full text-xs px-2 py-1 rounded transition-all duration-200 cursor-pointer relative group`}
                        style={{
                          backgroundColor: isAvailable
                            ? "rgba(120, 200, 65, 0.3)"
                            : colors.background.primary,
                          color: isAvailable
                            ? colors.text.primary
                            : colors.text.secondary,
                          border: `2px solid ${
                            isAvailable ? "#78C841" : colors.border.primary
                          }`,
                        }}
                      >
                        {time}
                        {isAvailable && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1"
                          >
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="p-4 border rounded-lg"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <div className="flex items-start gap-3">
            <Clock
              className="w-5 h-5 mt-0.5"
              style={{ color: colors.text.secondary }}
            />
            <div>
              <h5
                className="mb-1 font-medium"
                style={{ color: colors.text.primary }}
              >
                How to set your availability:
              </h5>
              <ul
                className="space-y-1 text-sm"
                style={{ color: colors.text.secondary }}
              >
                <li>
                  • Click on any time slot to mark it as available (green)
                </li>
                <li>• Click again to mark it as unavailable (gray)</li>
                <li>• Available slots will show a green checkmark</li>
                <li>
                  • Click &quot;Save Availability&quot; when you&apos;re done
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Save Button and Auto-save Status */}
        <motion.div
          className="flex items-center justify-between pt-4 border-t"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          style={{ borderColor: colors.border.primary }}
        >
          {/* Auto-save Status */}
          <div className="flex items-center gap-2">
            {isAutoSaving && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                <span style={{ color: colors.text.secondary }}>
                  Auto-saving...
                </span>
              </div>
            )}
            {!isAutoSaving && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span style={{ color: colors.text.secondary }}>Auto-saved</span>
              </div>
            )}
          </div>

          {/* Manual Save Button */}
          <Button
            onClick={saveAvailability}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3"
            style={{
              backgroundColor: colors.accent.primary,
            }}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Availability"}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityManager;
