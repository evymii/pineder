import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Camera,
  BookOpen,
  Video,
  Mic,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../design/system/button";
import { Layout } from "../../components/layout/Layout";
import { SpotlightHero } from "../../components/shared/SpotlightHero";
import { useState } from "react";
import { useTheme } from "../../core/contexts/ThemeContext";

export default function CommunityEvents() {
  const { isDarkMode, colors } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 11, 1)); // December 2024
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("week");

  const events = [
    {
      id: 1,
      title: "pinequest",
      startTime: "09:00",
      endTime: "10:30",
      date: new Date(2024, 11, 4), // December 4th
      endDate: new Date(2024, 11, 4), // Single day event
      type: "Blog Post",
      status: "Published",
      icon: BookOpen,
      description: "How to create engaging content for developers",
      location: "Online",
      attendees: 45,
      category: "Content",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "demo",
      startTime: "14:00",
      endTime: "15:00",
      date: new Date(2024, 11, 7), // December 7th
      endDate: new Date(2024, 11, 7), // Single day event
      type: "Video",
      status: "In Review",
      icon: Video,
      description: "Live coding session: Building a React app",
      location: "Online",
      attendees: 23,
      category: "Workshop",
      color: "bg-orange-500",
    },
    {
      id: 3,
      title: "teachers day",
      startTime: "10:00",
      endTime: "12:00",
      date: new Date(2024, 11, 10), // December 10th
      endDate: new Date(2024, 11, 10), // Single day event
      type: "Event",
      status: "Scheduled",
      icon: Calendar,
      description: "Annual celebration and recognition of educators",
      location: "Main Campus",
      attendees: 120,
      category: "Event",
      color: "bg-[#08CB00]",
    },
    {
      id: 4,
      title: "how to leap",
      startTime: "16:00",
      endTime: "17:30",
      date: new Date(2024, 11, 13), // December 13th
      endDate: new Date(2024, 11, 14), // Two day event
      type: "Podcast",
      status: "Idea",
      icon: Mic,
      description: "Career advancement strategies for developers",
      location: "Online",
      attendees: 67,
      category: "Learning",
      color: "bg-purple-500",
    },
    {
      id: 5,
      title: "group study session",
      startTime: "19:00",
      endTime: "21:00",
      date: new Date(2024, 11, 15), // December 15th
      endDate: new Date(2024, 11, 15), // Single day event
      type: "Workshop",
      status: "In Progress",
      icon: Users,
      description: "Collaborative learning session on advanced topics",
      location: "Study Hall",
      attendees: 15,
      category: "Learning",
      color: "bg-indigo-500",
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getWeekDays = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekDays;
  };

  const getMonthName = (date: Date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[date.getMonth()];
  };

  const getYear = (date: Date) => {
    return date.getFullYear();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = event.date;
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getEventsForWeek = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return events.filter((event) => {
      const eventDate = event.date;
      return eventDate >= startDate && eventDate <= endDate;
    });
  };

  const getEventsForDay = (date: Date) => {
    return getEventsForDate(date);
  };

  const renderMonthView = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const weekDays = getWeekDays();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-20 bg-gray-50 dark:bg-gray-800"
        ></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const dayEvents = getEventsForDate(currentDate);
      const isToday = currentDate.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={`h-20 border border-gray-200 dark:border-gray-700 p-1.5 ${
            isToday
              ? "bg-blue-50 dark:bg-blue-900/20"
              : "bg-white dark:bg-gray-900"
          }`}
        >
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {day}
          </div>
          <div className="space-y-0.5">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-0.5 rounded ${event.color} text-white truncate`}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {weekDays.map((day) => (
            <div
              key={day}
              className="bg-gray-50 dark:bg-gray-800 p-3 text-center text-sm font-medium text-gray-900 dark:text-white"
            >
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const weekEvents = getEventsForWeek(startOfWeek);

    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {/* Day headers */}
          {weekDays.map((day, index) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + index);
            const isToday = date.toDateString() === today.toDateString();
            const dayEvents = weekEvents.filter(
              (event) => event.date.toDateString() === date.toDateString()
            );

            return (
              <div
                key={day}
                className={`min-h-[200px] ${
                  isToday
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "bg-white dark:bg-gray-900"
                }`}
              >
                {/* Day header */}
                <div
                  className={`p-3 text-center border-b border-gray-200 dark:border-gray-700 ${
                    isToday
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : "bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  <div className="text-gray-900 dark:text-white font-medium">
                    {day}
                  </div>
                  <div
                    className={`text-sm ${
                      isToday
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </div>

                {/* Events for this day */}
                <div className="p-2">
                  {dayEvents.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                      No events
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`p-2 rounded-lg ${event.color} text-white text-xs`}
                        >
                          <div className="font-medium mb-1">{event.title}</div>
                          <div className="text-white/80">
                            {event.startTime} - {event.endTime}
                          </div>
                          <div className="text-white/70 text-xs mt-1">
                            {event.location}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const today = new Date();
    const dayEvents = getEventsForDay(today);
    const weekDays = getWeekDays();
    const currentDay = weekDays[today.getDay()];

    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentDay}, {today.toLocaleDateString()}
          </div>
        </div>

        <div className="p-4">
          {dayEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No events scheduled for today
            </div>
          ) : (
            <div className="space-y-4">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    event.color
                  } border-l-${
                    event.color.split("-")[1]
                  }-600 bg-white dark:bg-gray-800 shadow-sm`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {event.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees} attendees</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`p-2 rounded-full ${event.color} text-white`}
                      >
                        <event.icon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <SpotlightHero
        title="EVENTS"
        subtitle="IN THE"
        description="Stay updated with all community activities and events. Join workshops, attend meetups, and participate in learning sessions."
        quote="THE BEST WAY TO PREDICT THE FUTURE IS TO CREATE IT."
        author="Peter Drucker"
      />

      <div className="pt-24">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Calendar Controls */}
          <div className="mb-4 bg-white dark:bg-gray-900 rounded-lg shadow p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button onClick={goToToday} variant="outline">
                  Today
                </Button>
                <div className="flex items-center space-x-2">
                  <Button onClick={goToPreviousMonth} variant="ghost" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {getMonthName(currentMonth)} {getYear(currentMonth)}
                  </h2>
                  <Button onClick={goToNextMonth} variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setViewMode("month")}
                  variant={viewMode === "month" ? "default" : "outline"}
                  size="sm"
                >
                  Month
                </Button>
                <Button
                  onClick={() => setViewMode("week")}
                  variant={viewMode === "week" ? "default" : "outline"}
                  size="sm"
                >
                  Week
                </Button>
                <Button
                  onClick={() => setViewMode("day")}
                  variant={viewMode === "day" ? "default" : "outline"}
                  size="sm"
                >
                  Day
                </Button>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          <div className="mb-6">
            {viewMode === "month" && renderMonthView()}
            {viewMode === "week" && renderWeekView()}
            {viewMode === "day" && renderDayView()}
          </div>

          {/* Upcoming Events List */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Upcoming Events
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {events
                  .filter((event) => event.date >= new Date())
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 3)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div
                        className={`p-2 rounded-full ${event.color} text-white`}
                      >
                        <event.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>{event.date.toLocaleDateString()}</span>
                          <span>
                            {event.startTime} - {event.endTime}
                          </span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-gray-900 dark:text-white">
                          {event.status}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {event.category}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
