import { Response } from "express";
import Event from "../../models/Event";
import Student from "../../models/Student";
import User from "../../models/User";
import { AuthRequest } from "../../middleware/auth";

const handleError = (res: Response, error: unknown, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ success: false, error: `Failed to ${message}` });
};

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, error: "Authentication required" });

const notFound = (res: Response, resource: string) =>
  res.status(404).json({ success: false, error: `${resource} not found` });

const success = <T>(res: Response, data?: T, message?: string, status = 200) => {
  const response: { success: true; data?: T; message?: string } = { success: true };
  if (data !== undefined) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

const getWeekRange = (date: Date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    // Allow viewing events without authentication
    // if (!req.user) return unauthorized(res);

    const {
      category,
      eventType,
      locationType,
      page = 1,
      limit = 10,
      startDate,
      endDate,
    } = req.query;

    const filter: Record<string, unknown> = {
      status: "published",
      isPublic: true,
    };

    if (category) filter.category = category;
    if (eventType) filter.eventType = eventType;
    if (locationType) filter.locationType = locationType;

    if (startDate && endDate) {
      filter.startTime = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Event.countDocuments(filter);

    const events = await Event.find(filter)
      .populate("mentorId", "specialties bio rating")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .populate("registeredStudents", "firstName lastName email")
      .sort({ startTime: 1 })
      .skip(skip)
      .limit(Number(limit));

    let eventsWithRegistrationStatus: any = events;

    if (req.user && req.user.role === "student") {
      const user = await User.findOne({ email: req.user.email });
      if (user) {
        const student = await Student.findOne({ userId: user._id });
        if (student) {
          eventsWithRegistrationStatus = events.map((event) => ({
            ...event.toObject(),
            isRegistered: event.registeredStudents.includes(student._id as any),
          }));
        }
      }
    }

    success(res, {
      events: eventsWithRegistrationStatus,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    handleError(res, error, "fetch events");
  }
};

export const getWeeklyEvents = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { date } = req.query;
    const targetDate = date ? new Date(date as string) : new Date();
    const { start, end } = getWeekRange(targetDate);

    const events = await Event.find({
      status: "published",
      isPublic: true,
      startTime: { $gte: start, $lte: end },
    })
      .populate("mentorId", "specialties bio rating")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .sort({ startTime: 1 });

    const eventsByDay: Record<string, unknown[]> = {};
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const dayKey = day.toISOString().split("T")[0];
      eventsByDay[dayKey] = [];
    }

    events.forEach((event) => {
      const eventDate = event.startTime.toISOString().split("T")[0];
      if (eventsByDay[eventDate]) {
        eventsByDay[eventDate].push({
          _id: event._id,
          title: event.title,
          description: event.description,
          startTime: event.startTime,
          endTime: event.endTime,
          location: event.location,
          locationType: event.locationType,
          category: event.category,
          eventType: event.eventType,
          currentParticipants: event.currentParticipants,
          maxParticipants: event.maxParticipants,
          mentor: event.mentorId,
        });
      }
    });

    success(res, {
      eventsByDay,
      weekStart: start,
      weekEnd: end,
    });
  } catch (error) {
    handleError(res, error, "fetch weekly events");
  }
};

export const getEventById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { eventId } = req.params;

    const event = await Event.findById(eventId)
      .populate("mentorId", "specialties bio rating")
      .populate({
        path: "mentorId",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      })
      .populate({
        path: "registeredStudents",
        populate: { path: "userId", select: "firstName lastName email avatar" },
      });

    if (!event) return notFound(res, "Event");

    if (!event.isPublic && event.status !== "published") {
      return res
        .status(403)
        .json({ success: false, error: "Event not available" });
    }

    let isRegistered = false;

    if (req.user.role === "student") {
      const user = await User.findOne({ email: req.user.email });
      if (user) {
        const student = await Student.findOne({ userId: user._id });
        if (student) {
          isRegistered = event.registeredStudents.some(
            (s) => s._id.toString() === (student._id as any).toString()
          );
        }
      }
    }

    success(res, {
      ...event.toObject(),
      isRegistered,
    });
  } catch (error) {
    handleError(res, error, "fetch event");
  }
};
