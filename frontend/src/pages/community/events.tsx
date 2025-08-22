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
import { useState, useEffect } from "react";
import { useTheme } from "../../core/contexts/ThemeContext";
import {
  EventSubmissionForm,
  EventDetails,
} from "../../components/features/events";
import { useEvents, Event, CreateEventData } from "../../core/hooks/useEvents";
import { useUser } from "@clerk/nextjs";

export default function CommunityEvents() {
  const { isDarkMode, colors } = useTheme();
  const { user } = useUser();
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Current month
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("week");

  // State for event form
  const [showEventForm, setShowEventForm] = useState(false);

  // State for event details
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  // Store original backend events for EventDetails
  const [originalEvents, setOriginalEvents] = useState<Event[]>([]);

  // Use the events hook
  const {
    events,
    loading,
    error,
    createEvent,
    registerForEvent,
    unregisterFromEvent,
    canCreateEvents,
    canRegisterForEvents,
  } = useEvents();

  // Handler for event submission
  const handleEventSubmit = async (newEvent: CreateEventData) => {
    try {
      await createEvent(newEvent);
      alert("Event created successfully!");
      setShowEventForm(false);
    } catch (error) {
      console.error("Failed to create event:", error);
      alert(error instanceof Error ? error.message : "Failed to create event");
    }
  };

  // Debug function to show current user info
  const showUserInfo = () => {
    const email = user?.emailAddresses[0]?.emailAddress || "No email";
    const role = email.endsWith("@gmail.com")
      ? "mentor"
      : email.endsWith("@nest.edu.mn")
      ? "student"
      : "unknown";
    alert(
      `Current User Info:\nEmail: ${email}\nRole: ${role}\nUser ID: ${
        user?.id || "No ID"
      }`
    );
  };

  // Helper function to transform backend event to frontend format
  const transformEventForDisplay = (event: Event) => {
    console.log("Transforming event:", event);
    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);

    // Handle eventId safely
    let eventId = 0;
    if (event.eventId) {
      try {
        eventId = parseInt(event.eventId.replace("#", ""));
      } catch (error) {
        console.error("Error parsing eventId:", error);
        eventId = 0;
      }
    }

    return {
      id: eventId,
      title: event.title,
      startTime: startDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: endDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: startDate,
      endDate: endDate,
      type: event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1),
      status:
        event.currentParticipants >= (event.maxParticipants || 0)
          ? "Full"
          : "Open",
      icon: getEventIcon(event.eventType),
      description: event.description,
      location: event.location,
      attendees: event.currentParticipants,
      category: event.category,
      color: getEventColor(event.eventType),
    };
  };

  // Helper function to get event icon
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "workshop":
        return BookOpen;
      case "discussion":
        return Mic;
      case "webinar":
        return Video;
      case "q&a":
        return Users;
      default:
        return Calendar;
    }
  };

  // Helper function to get event color
  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "workshop":
        return "bg-blue-500";
      case "discussion":
        return "bg-green-500";
      case "webinar":
        return "bg-purple-500";
      case "q&a":
        return "bg-orange-500";
      default:
        return "bg-indigo-500";
    }
  };

  // Handler for opening event details
  const handleEventClick = (event: Event) => {
    console.log("handleEventClick - transformed event:", event);
    console.log("handleEventClick - transformed event._id:", event._id);
    console.log("handleEventClick - transformed event.eventId:", event.eventId);
    console.log("handleEventClick - originalEvents:", originalEvents);

    // Find the original backend event data using the event ID
    const originalEvent = originalEvents.find(
      (e) => e._id === event._id || e.eventId === event.eventId
    );

    if (originalEvent) {
      console.log("handleEventClick - found original event:", originalEvent);
      console.log(
        "handleEventClick - original event.startTime:",
        originalEvent.startTime
      );
      console.log(
        "handleEventClick - original event.endTime:",
        originalEvent.endTime
      );
      console.log(
        "handleEventClick - original event.eventId:",
        originalEvent.eventId
      );

      // Use the original backend event data for EventDetails
      const eventForDetails = {
        ...originalEvent,
        // Ensure required properties exist
        eventType: originalEvent.eventType || "workshop",
        registeredStudents: originalEvent.registeredStudents || [],
      };

      console.log("handleEventClick - event for details:", eventForDetails);
      setSelectedEvent(eventForDetails);
      setShowEventDetails(true);
    } else {
      console.error("handleEventClick - original event not found for:", event);
      console.error(
        "handleEventClick - available original events:",
        originalEvents.map((e) => ({
          _id: e._id,
          eventId: e.eventId,
          title: e.title,
        }))
      );
      // Fallback to transformed event
      setSelectedEvent(event);
      setShowEventDetails(true);
    }
  };

  // Handler for closing event details
  const handleCloseEventDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  // Handler for registering/unregistering from event
  const handleEventRegistration = async (event: Event) => {
    try {
      console.log("Registration - Event:", event);
      console.log("Registration - User ID:", user?.id);
      console.log(
        "Registration - registeredStudents:",
        event.registeredStudents
      );

      // Check if user is already registered (safely handle undefined registeredStudents)
      // registeredStudents might be ObjectIds or strings, so we need to handle both
      const isRegistered =
        event.registeredStudents?.some(
          (studentId: any) =>
            studentId === user?.id ||
            studentId._id === user?.id ||
            studentId.toString() === user?.id
        ) || false;
      console.log("Registration - isRegistered:", isRegistered);

      if (isRegistered) {
        await unregisterFromEvent(event._id);
        alert("Successfully unregistered from event!");
      } else {
        await registerForEvent(event._id);
        alert("Successfully registered for event!");
      }
    } catch (error) {
      console.error("Failed to handle event registration:", error);
      alert(
        error instanceof Error ? error.message : "Failed to handle registration"
      );
    }
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

  const goToEventsWeek = () => {
    // Go to the week of the first event (August 2025)
    const eventWeek = new Date(2025, 7, 25); // August 25, 2025 (Monday)
    setCurrentMonth(eventWeek);
  };

  // Store original events and set initial view
  useEffect(() => {
    // Store original backend events for EventDetails
    if (events.length > 0) {
      console.log("Storing original events:", events);
      setOriginalEvents(events);

      // Automatically go to the events week when the page loads
      const firstEvent = events[0];
      const eventDate = new Date(firstEvent.startTime);
      const eventWeek = new Date(eventDate);
      eventWeek.setDate(eventDate.getDate() - eventDate.getDay()); // Go to Monday of that week
      setCurrentMonth(eventWeek);
    }
  }, [events]);

  const getEventsForDate = (date: Date) => {
    console.log("Getting events for date:", date);
    console.log("All events:", events);

    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime);
      console.log("Event date:", eventDate, "for event:", event.title);
      const matches =
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear();
      console.log("Date matches:", matches);
      return matches;
    });

    console.log("Filtered events:", filteredEvents);
    return filteredEvents.map(transformEventForDisplay);
  };

  const getEventsForWeek = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    console.log("Week range:", { startDate, endDate });

    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime);
      const inRange = eventDate >= startDate && eventDate <= endDate;
      console.log(
        `Event ${event.title} on ${eventDate}: in range = ${inRange}`
      );
      return inRange;
    });

    console.log("Week filtered events:", filteredEvents);
    return filteredEvents.map(transformEventForDisplay);
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
            {dayEvents.slice(0, 2).map((event) => {
              // Find the original backend event for this transformed event
              const originalEvent = originalEvents.find(
                (e) => e._id === event._id || e.title === event.title
              );
              return (
                <div
                  key={event.id}
                  className={`text-xs p-0.5 rounded ${event.color} text-white truncate cursor-pointer hover:opacity-80 transition-opacity`}
                  title={event.title}
                  onClick={() => handleEventClick(originalEvent || event)}
                >
                  {event.title}
                </div>
              );
            })}
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
    // Use currentMonth instead of today to show the correct week
    const startOfWeek = new Date(currentMonth);
    startOfWeek.setDate(currentMonth.getDate() - currentMonth.getDay());

    console.log("Week view - currentMonth:", currentMonth);
    console.log("Week view - startOfWeek:", startOfWeek);
    const weekEvents = getEventsForWeek(startOfWeek);
    console.log("Week view - weekEvents:", weekEvents);

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
            const isToday = date.toDateString() === new Date().toDateString();
            const dayEvents = weekEvents.filter((event) => {
              const matches = event.date.toDateString() === date.toDateString();
              console.log(
                `Day ${date.toDateString()} - Event ${event.title}: ${matches}`
              );
              return matches;
            });

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
                      {dayEvents.map((event) => {
                        // Find the original backend event for this transformed event
                        const originalEvent = originalEvents.find(
                          (e) => e._id === event._id || e.title === event.title
                        );
                        return (
                          <div
                            key={event.id}
                            className={`p-2 rounded-lg ${event.color} text-white text-xs cursor-pointer hover:opacity-80 transition-opacity`}
                            onClick={() =>
                              handleEventClick(originalEvent || event)
                            }
                          >
                            <div className="mb-1 font-medium">
                              {event.title}
                            </div>
                            <div className="text-white/80">
                              {event.startTime} - {event.endTime}
                            </div>
                            <div className="mt-1 text-xs text-white/70">
                              {event.location}
                            </div>
                          </div>
                        );
                      })}
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
              {dayEvents.map((event) => {
                // Find the original backend event for this transformed event
                const originalEvent = originalEvents.find(
                  (e) => e._id === event._id || e.title === event.title
                );
                return (
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
                    onClick={() => handleEventClick(originalEvent || event)}
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
                );
              })}
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

            <div className="flex items-center gap-2">
              <Button
                onClick={showUserInfo}
                variant="outline"
                className="px-4 py-2 text-sm"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              >
                Debug: User Info
              </Button>
              {canCreateEvents() && (
                <Button
                  onClick={() => setShowEventForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)] text-white border-0 hover:shadow-lg transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Event
                </Button>
              )}
            </div>
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
                <Button
                  onClick={goToEventsWeek}
                  variant="outline"
                  className="hover:shadow-md transition-all duration-300"
                  style={{
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                    backgroundColor: `${colors.accent.success}10`,
                  }}
                >
                  Events Week
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
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">
                    Loading events...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-sm text-red-600">
                    Error loading events: {error}
                  </p>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-600">
                    No events available (Total: {events.length})
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(() => {
                    console.log("All events:", events);
                    const futureEvents = events.filter(
                      (event) => new Date(event.startTime) >= new Date()
                    );
                    console.log("Future events:", futureEvents);
                    const sortedEvents = futureEvents.sort(
                      (a, b) =>
                        new Date(a.startTime).getTime() -
                        new Date(b.startTime).getTime()
                    );
                    console.log("Sorted events:", sortedEvents);
                    const displayEvents = sortedEvents.slice(0, 3);
                    console.log("Display events:", displayEvents);
                    return displayEvents;
                  })().map((event) => {
                    const displayEvent = transformEventForDisplay(event);
                    return (
                      <div
                        key={event._id}
                        className="flex items-center p-3 space-x-3 transition-all duration-200 border rounded-lg hover:shadow-md cursor-pointer"
                        style={{
                          borderColor: colors.border.primary,
                          backgroundColor: colors.background.card,
                        }}
                        onClick={() => handleEventClick(event)}
                      >
                        <div
                          className={`p-2 rounded-full ${displayEvent.color} text-white`}
                        >
                          <displayEvent.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4
                            className="text-base font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {displayEvent.title}
                          </h4>
                          <p
                            className="text-xs line-clamp-2"
                            style={{ color: colors.text.secondary }}
                          >
                            {displayEvent.description}
                          </p>
                          <div className="flex items-center mt-1 space-x-3 text-xs">
                            <span style={{ color: colors.text.tertiary }}>
                              {displayEvent.date.toLocaleDateString()}
                            </span>
                            <span style={{ color: colors.text.tertiary }}>
                              {displayEvent.startTime} - {displayEvent.endTime}
                            </span>
                            <span style={{ color: colors.text.tertiary }}>
                              {displayEvent.location}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className="text-xs font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {displayEvent.status}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: colors.text.tertiary }}
                          >
                            {displayEvent.category}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
          onRegister={handleEventRegistration}
        />
      )}
    </Layout>
  );
}
