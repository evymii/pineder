import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Video,
  Mic,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../design/system/button";
import { Layout } from "../../components/layout/Layout";
import { useState } from "react";
import { useTheme } from "../../core/contexts/ThemeContext";
import {
  EventSubmissionForm,
  EventDetails,
} from "../../components/features/events";

export default function CommunityEvents() {
  const { isDarkMode, colors } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 11, 1)); // December 2024
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("week");

  // State for event form
  const [showEventForm, setShowEventForm] = useState(false);

  // State for event details
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const events = [
    {
      id: 1,
      title: "React Performance Workshop",
      startTime: "09:00",
      endTime: "11:00",
      date: new Date(), // Today
      endDate: new Date(), // Single day event
      type: "Workshop",
      status: "Open",
      icon: BookOpen,
      description:
        "Learn advanced React optimization techniques and performance best practices",
      location: "Online",
      attendees: 28,
      category: "Learning",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "System Design Interview Prep",
      startTime: "14:00",
      endTime: "15:30",
      date: new Date(), // Today
      endDate: new Date(), // Single day event
      type: "Study Group",
      status: "Almost Full",
      icon: Users,
      description: "Practice system design problems with experienced engineers",
      location: "Conference Room A",
      attendees: 18,
      category: "Career",
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Data Science Q&A Session",
      startTime: "16:00",
      endTime: "17:00",
      date: new Date(), // Today
      endDate: new Date(), // Single day event
      type: "Q&A",
      status: "Open",
      icon: Video,
      description:
        "Get answers to your data science and ML questions from experts",
      location: "Online",
      attendees: 35,
      category: "Data Science",
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Frontend Architecture Discussion",
      startTime: "19:00",
      endTime: "20:30",
      date: new Date(), // Today
      endDate: new Date(), // Single day event
      type: "Discussion",
      status: "Open",
      icon: Mic,
      description:
        "Deep dive into modern frontend architecture patterns and decisions",
      location: "Online",
      attendees: 22,
      category: "Architecture",
      color: "bg-orange-500",
    },
    {
      id: 5,
      title: "Code Review Best Practices",
      startTime: "20:00",
      endTime: "21:00",
      date: new Date(), // Today
      endDate: new Date(), // Single day event
      type: "Workshop",
      status: "Open",
      icon: BookOpen,
      description:
        "Learn effective code review techniques and feedback strategies",
      location: "Online",
      attendees: 15,
      category: "Best Practices",
      color: "bg-indigo-500",
    },
  ];

  // Handler for event submission
  const handleEventSubmit = (newEvent: any) => {
    // TODO: Implement event submission logic
    console.log("New event submitted:", newEvent);
    setShowEventForm(false);
  };

  // Handler for opening event details
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Handler for closing event details
  const handleCloseEventDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

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

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-20"
          style={{ backgroundColor: colors.background.secondary }}
        ></div>
      );
    }

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
          className={`h-20 border p-1.5 transition-all duration-200 hover:shadow-md`}
          style={{
            borderColor: colors.border.primary,
            backgroundColor: isToday
              ? `${colors.accent.primary}20`
              : colors.background.card,
          }}
        >
          <div
            className="mb-1 text-sm font-medium"
            style={{ color: colors.text.primary }}
          >
            {day}
          </div>
          <div className="space-y-0.5">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-0.5 rounded ${event.color} text-white truncate cursor-pointer hover:opacity-80 transition-opacity`}
                title={event.title}
                onClick={() => handleEventClick(event)}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div
                className="text-xs cursor-pointer hover:underline"
                style={{ color: colors.text.tertiary }}
              >
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        className="rounded-lg shadow-lg overflow-hidden"
        style={{
          backgroundColor: colors.background.card,
          borderColor: colors.border.primary,
        }}
      >
        <div
          className="grid grid-cols-7 gap-px"
          style={{ backgroundColor: colors.border.primary }}
        >
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-3 text-sm font-medium text-center"
              style={{
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
              }}
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
      <div
        className="rounded-lg shadow-lg overflow-hidden"
        style={{
          backgroundColor: colors.background.card,
          borderColor: colors.border.primary,
        }}
      >
        <div
          className="grid grid-cols-7 gap-px"
          style={{ backgroundColor: colors.border.primary }}
        >
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
                className="min-h-[200px] transition-all duration-200"
                style={{
                  backgroundColor: isToday
                    ? `${colors.accent.primary}20`
                    : colors.background.card,
                }}
              >
                <div
                  className={`p-3 text-center border-b transition-all duration-200`}
                  style={{
                    borderColor: colors.border.primary,
                    backgroundColor: isToday
                      ? `${colors.accent.primary}30`
                      : colors.background.secondary,
                  }}
                >
                  <div
                    className="font-medium"
                    style={{ color: colors.text.primary }}
                  >
                    {day}
                  </div>
                  <div
                    className={`text-sm ${
                      isToday ? colors.accent.primary : colors.text.tertiary
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </div>

                <div className="p-2">
                  {dayEvents.length === 0 ? (
                    <div
                      className="py-8 text-sm text-center"
                      style={{ color: colors.text.tertiary }}
                    >
                      No events
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`p-2 rounded-lg ${event.color} text-white text-xs cursor-pointer hover:opacity-80 transition-opacity`}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="mb-1 font-medium">{event.title}</div>
                          <div className="text-white/80">
                            {event.startTime} - {event.endTime}
                          </div>
                          <div className="mt-1 text-xs text-white/70">
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
      <div
        className="rounded-lg shadow-lg overflow-hidden"
        style={{
          backgroundColor: colors.background.card,
          borderColor: colors.border.primary,
        }}
      >
        <div
          className="p-4 border-b"
          style={{ borderColor: colors.border.primary }}
        >
          <div
            className="text-lg font-semibold"
            style={{ color: colors.text.primary }}
          >
            {currentDay}, {today.toLocaleDateString()}
          </div>
        </div>

        <div className="p-4">
          {dayEvents.length === 0 ? (
            <div
              className="py-8 text-center"
              style={{ color: colors.text.tertiary }}
            >
              No events scheduled for today
            </div>
          ) : (
            <div className="space-y-4">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border-l-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer`}
                  style={{
                    borderLeftColor:
                      event.color.split("-")[1] === "08CB00"
                        ? "#08CB00"
                        : event.color.split("-")[1],
                    backgroundColor: colors.background.card,
                    borderColor: colors.border.primary,
                  }}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className="mb-2 text-lg font-semibold"
                        style={{ color: colors.text.primary }}
                      >
                        {event.title}
                      </h3>
                      <p
                        className="mb-3"
                        style={{ color: colors.text.secondary }}
                      >
                        {event.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock
                            className="w-4 h-4"
                            style={{ color: colors.text.tertiary }}
                          />
                          <span style={{ color: colors.text.tertiary }}>
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin
                            className="w-4 h-4"
                            style={{ color: colors.text.tertiary }}
                          />
                          <span style={{ color: colors.text.tertiary }}>
                            {event.location}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users
                            className="w-4 h-4"
                            style={{ color: colors.text.tertiary }}
                          />
                          <span style={{ color: colors.text.tertiary }}>
                            {event.attendees} attendees
                          </span>
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
      {/* Compact Events Header */}
      <div className="pt-20">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Calendar
                  className="w-8 h-8"
                  style={{ color: colors.accent.primary }}
                />
                <div>
                  <h1
                    className="text-3xl font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    Events
                  </h1>
                  <p
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    Manage and view community events
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowEventForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)] text-white border-0 hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Event
            </Button>
          </div>

          <div
            className="p-4 rounded-lg shadow-lg"
            style={{
              backgroundColor: colors.background.card,
              borderColor: colors.border.primary,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={goToToday}
                  variant="outline"
                  className="hover:shadow-md transition-all duration-300"
                  style={{
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                    backgroundColor: `${colors.accent.primary}10`,
                  }}
                >
                  Today
                </Button>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={goToPreviousMonth}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-opacity-10 transition-all duration-200"
                    style={{
                      color: colors.text.primary,
                      backgroundColor: `${colors.accent.primary}10`,
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {getMonthName(currentMonth)} {getYear(currentMonth)}
                  </h2>
                  <Button
                    onClick={goToNextMonth}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-opacity-10 transition-all duration-200"
                    style={{
                      color: colors.text.primary,
                      backgroundColor: `${colors.accent.primary}10`,
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {[
                  { key: "month", label: "Month" },
                  { key: "week", label: "Week" },
                  { key: "day", label: "Day" },
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    onClick={() => setViewMode(key as any)}
                    variant={viewMode === key ? "default" : "outline"}
                    size="sm"
                    className="transition-all duration-300"
                    style={{
                      backgroundColor:
                        viewMode === key
                          ? colors.accent.primary
                          : "transparent",
                      color:
                        viewMode === key
                          ? colors.text.inverse
                          : colors.text.primary,
                      borderColor: colors.border.primary,
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            {viewMode === "month" && renderMonthView()}
            {viewMode === "week" && renderWeekView()}
            {viewMode === "day" && renderDayView()}
          </div>

          <div
            className="rounded-lg shadow-lg overflow-hidden"
            style={{
              backgroundColor: colors.background.card,
              borderColor: colors.border.primary,
            }}
          >
            <div
              className="p-4 border-b"
              style={{ borderColor: colors.border.primary }}
            >
              <h3
                className="text-base font-semibold"
                style={{ color: colors.text.primary }}
              >
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
                      className="flex items-center p-3 space-x-3 transition-all duration-200 border rounded-lg hover:shadow-md cursor-pointer"
                      style={{
                        borderColor: colors.border.primary,
                        backgroundColor: colors.background.card,
                      }}
                      onClick={() => handleEventClick(event)}
                    >
                      <div
                        className={`p-2 rounded-full ${event.color} text-white`}
                      >
                        <event.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4
                          className="text-base font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {event.title}
                        </h4>
                        <p
                          className="text-xs line-clamp-2"
                          style={{ color: colors.text.secondary }}
                        >
                          {event.description}
                        </p>
                        <div className="flex items-center mt-1 space-x-3 text-xs">
                          <span style={{ color: colors.text.tertiary }}>
                            {event.date.toLocaleDateString()}
                          </span>
                          <span style={{ color: colors.text.tertiary }}>
                            {event.startTime} - {event.endTime}
                          </span>
                          <span style={{ color: colors.text.tertiary }}>
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="text-xs font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {event.status}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: colors.text.tertiary }}
                        >
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

      {/* Event Submission Form */}
      <EventSubmissionForm
        isOpen={showEventForm}
        onClose={() => setShowEventForm(false)}
        onSubmit={handleEventSubmit}
      />

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          isOpen={showEventDetails}
          onClose={handleCloseEventDetails}
        />
      )}
    </Layout>
  );
}
