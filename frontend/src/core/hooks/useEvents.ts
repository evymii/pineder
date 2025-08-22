import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";

export interface Event {
  _id: string;
  title: string;
  description: string;
  mentorId: {
    _id: string;
    userId: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar?: string;
    };
    specialties: string[];
    bio: string;
    rating: number;
  };
  startTime: string;
  endTime: string;
  location: string;
  locationType: "online" | "in-person" | "hybrid";
  maxParticipants?: number;
  currentParticipants: number;
  price: number;
  currency: string;
  category: string;
  eventType:
    | "workshop"
    | "discussion"
    | "seminar"
    | "meetup"
    | "webinar"
    | "q&a";
  tags: string[];
  isPublic: boolean;
  status: "draft" | "published" | "cancelled" | "completed";
  participants: string[];
  registeredStudents: string[];
  eventId: string;
  meetingLink?: string;
  materials?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  duration: number;
  maxParticipants: number;
  location?: string;
  category: string;
  tags?: string[];
  isPublic?: boolean;
}

export const useEvents = () => {
  const { user, isSignedIn } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = () => {
    const email = user?.emailAddresses[0]?.emailAddress || "";
    let role = "student"; // default
    if (email.endsWith("@gmail.com")) {
      role = "mentor";
    } else if (email.endsWith("@nest.edu.mn")) {
      role = "student";
    }

    console.log("getHeaders - email:", email);
    console.log("getHeaders - role:", role);
    console.log("getHeaders - userId:", user?.id);

    return {
      "Content-Type": "application/json",
      "x-user-role": role,
      "x-user-email": email,
      "x-user-id": user?.id || "",
    };
  };

  // Fetch all events
  const fetchEvents = useCallback(async () => {
    console.log("Fetching events...");
    setLoading(true);
    setError(null);

    try {
      const url = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
      }/api/events`;
      console.log("Fetching from URL:", url);

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        const eventsData = data.data.events || data.data;
        console.log("Setting events:", eventsData);
        console.log("Events count:", eventsData.length);
        setEvents(eventsData);
      } else {
        throw new Error(data.error || "Failed to fetch events");
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new event (mentor only)
  const createEvent = useCallback(
    async (eventData: CreateEventData) => {
      if (!isSignedIn || !user) {
        throw new Error("Please sign in to create events");
      }

      const email = user.emailAddresses[0]?.emailAddress || "";
      if (!email.endsWith("@gmail.com")) {
        throw new Error("Only mentors can create events");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
          }/api/events`,
          {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(eventData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create event");
        }

        const data = await response.json();
        if (data.success) {
          // Refresh events list by calling fetchEvents directly
          console.log("Event created successfully, refreshing events list...");
          setLoading(true);
          try {
            const refreshResponse = await fetch(
              `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
              }/api/events`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              console.log("CreateEvent refresh response:", refreshData);
              if (refreshData.success) {
                const refreshedEvents =
                  refreshData.data.events || refreshData.data;
                console.log(
                  "Setting refreshed events in createEvent:",
                  refreshedEvents
                );
                console.log("Refreshed events count:", refreshedEvents.length);
                setEvents(refreshedEvents);
              }
            }
          } catch (refreshError) {
            console.error("Failed to refresh events:", refreshError);
          } finally {
            setLoading(false);
          }
          return data.data;
        } else {
          throw new Error(data.error || "Failed to create event");
        }
      } catch (err) {
        console.error("Failed to create event:", err);
        setError(err instanceof Error ? err.message : "Failed to create event");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isSignedIn, user]
  );

  // Register for an event (student only)
  const registerForEvent = useCallback(
    async (eventId: string) => {
      console.log("Frontend registerForEvent - eventId:", eventId);
      console.log("Frontend registerForEvent - user:", user);
      console.log(
        "Frontend registerForEvent - email:",
        user?.emailAddresses[0]?.emailAddress
      );

      if (!isSignedIn || !user) {
        throw new Error("Please sign in to register for events");
      }

      const email = user.emailAddresses[0]?.emailAddress || "";
      if (!email.endsWith("@nest.edu.mn")) {
        throw new Error("Only students can register for events");
      }

      setLoading(true);
      setError(null);

      try {
        const headers = getHeaders();
        console.log("Frontend registerForEvent - headers:", headers);

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
          }/api/events/${eventId}/register`,
          {
            method: "POST",
            headers: headers,
          }
        );

        console.log(
          "Frontend registerForEvent - response status:",
          response.status
        );
        console.log("Frontend registerForEvent - response ok:", response.ok);

        if (!response.ok) {
          const errorData = await response.json();
          console.log("Frontend registerForEvent - error data:", errorData);
          throw new Error(errorData.error || "Failed to register for event");
        }

        const data = await response.json();
        console.log("Frontend registerForEvent - success data:", data);
        if (data.success) {
          // Refresh events list by calling fetchEvents directly
          setLoading(true);
          try {
            const refreshResponse = await fetch(
              `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
              }/api/events`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              if (refreshData.success) {
                setEvents(refreshData.data.events || refreshData.data);
              }
            }
          } catch (refreshError) {
            console.error("Failed to refresh events:", refreshError);
          } finally {
            setLoading(false);
          }
          return data.data;
        } else {
          throw new Error(data.error || "Failed to register for event");
        }
      } catch (err) {
        console.error("Failed to register for event:", err);
        setError(
          err instanceof Error ? err.message : "Failed to register for event"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isSignedIn, user, fetchEvents]
  );

  // Unregister from an event (student only)
  const unregisterFromEvent = useCallback(
    async (eventId: string) => {
      if (!isSignedIn || !user) {
        throw new Error("Please sign in to unregister from events");
      }

      const email = user.emailAddresses[0]?.emailAddress || "";
      if (!email.endsWith("@nest.edu.mn")) {
        throw new Error("Only students can unregister from events");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
          }/api/events/${eventId}/unregister`,
          {
            method: "DELETE",
            headers: getHeaders(),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to unregister from event");
        }

        const data = await response.json();
        if (data.success) {
          // Refresh events list by calling fetchEvents directly
          setLoading(true);
          try {
            const refreshResponse = await fetch(
              `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
              }/api/events`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              if (refreshData.success) {
                setEvents(refreshData.data.events || refreshData.data);
              }
            }
          } catch (refreshError) {
            console.error("Failed to refresh events:", refreshError);
          } finally {
            setLoading(false);
          }
          return data.data;
        } else {
          throw new Error(data.error || "Failed to unregister from event");
        }
      } catch (err) {
        console.error("Failed to unregister from event:", err);
        setError(
          err instanceof Error ? err.message : "Failed to unregister from event"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isSignedIn, user, fetchEvents]
  );

  // Fetch student's registered events
  const fetchStudentEvents = useCallback(async () => {
    if (!isSignedIn || !user) return;

    const email = user.emailAddresses[0]?.emailAddress || "";
    if (!email.endsWith("@nest.edu.mn")) {
      return; // Only for students
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/events/student/registered`,
        { headers: getHeaders() }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || "Failed to fetch student events");
      }
    } catch (err) {
      console.error("Failed to fetch student events:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch student events"
      );
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, user]);

  // Fetch mentor's events
  const fetchMentorEvents = useCallback(async () => {
    if (!isSignedIn || !user) return;

    const email = user.emailAddresses[0]?.emailAddress || "";
    if (!email.endsWith("@gmail.com")) {
      return; // Only for mentors
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/events/mentor/my-events`,
        { headers: getHeaders() }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || "Failed to fetch mentor events");
      }
    } catch (err) {
      console.error("Failed to fetch mentor events:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch mentor events"
      );
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, user]);

  // Check if user is registered for an event
  const isRegisteredForEvent = useCallback(
    (event: Event) => {
      if (!user) return false;

      const email = user.emailAddresses[0]?.emailAddress || "";
      if (!email.endsWith("@nest.edu.mn")) return false;

      // This would need to be implemented based on how the backend tracks registrations
      // For now, we'll return false and implement this when we have the actual data
      return false;
    },
    [user]
  );

  // Check if user can create events (mentor)
  const canCreateEvents = useCallback(() => {
    if (!user) return false;
    const email = user.emailAddresses[0]?.emailAddress || "";
    return email.endsWith("@gmail.com");
  }, [user]);

  // Check if user can register for events (student)
  const canRegisterForEvents = useCallback(() => {
    if (!user) return false;
    const email = user.emailAddresses[0]?.emailAddress || "";
    return email.endsWith("@nest.edu.mn");
  }, [user]);

  useEffect(() => {
    // Fetch events on component mount
    const loadEvents = async () => {
      console.log("Loading events on mount...");
      setLoading(true);
      setError(null);

      try {
        const url = `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/events`;
        console.log("Fetching from URL:", url);

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response data:", data);

        if (data.success) {
          const eventsData = data.data.events || data.data;
          console.log("Setting events on mount:", eventsData);
          console.log("Events count on mount:", eventsData.length);
          setEvents(eventsData);
        } else {
          throw new Error(data.error || "Failed to fetch events");
        }
      } catch (err) {
        console.error("Failed to fetch events on mount:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    registerForEvent,
    unregisterFromEvent,
    fetchStudentEvents,
    fetchMentorEvents,
    isRegisteredForEvent,
    canCreateEvents,
    canRegisterForEvents,
  };
};
