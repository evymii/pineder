import { Response } from "express";
import Session from "../../models/Session";
import Mentor from "../../models/Mentor";
import User from "../../models/User";
import { AuthRequest } from "../../middleware/auth";

const handleError = (res: Response, error: any, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ success: false, error: `Failed to ${message}` });
};

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, error: "Authentication required" });

const notFound = (res: Response, resource: string) =>
  res.status(404).json({ success: false, error: `${resource} not found` });

const success = (res: Response, data?: any, message?: string, status = 200) => {
  const response: any = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

export const getAllMentorsWithAvailability = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) return unauthorized(res);

    const mentors = await Mentor.find()
      .populate({
        path: "userId",
        select: "firstName lastName email avatar",
      })
      .select("specialties bio rating hourlyRate availability subjects");

    const mentorsWithAvailability = await Promise.all(
      mentors.map(async (mentor) => {
        const availability = mentor.availability || [];
        const timeSlots = [];

        const startDate = new Date();

        for (let day = 0; day < 7; day++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + day);
          const dayOfWeek = currentDate.getDay();

          const dayAvailability = availability.find(
            (a) => a.dayOfWeek === dayOfWeek
          );

          if (dayAvailability && dayAvailability.isAvailable) {
            const startTime = new Date(dayAvailability.startTime);
            const endTime = new Date(dayAvailability.endTime);

            for (
              let hour = startTime.getHours();
              hour < endTime.getHours();
              hour++
            ) {
              const slotTime = new Date(currentDate);
              slotTime.setHours(hour, 0, 0, 0);

              const existingSession = await Session.findOne({
                mentorId: mentor._id,
                startTime: {
                  $lt: new Date(slotTime.getTime() + 60 * 60 * 1000),
                },
                endTime: { $gt: slotTime },
                status: {
                  $in: ["requested", "approved", "scheduled", "active"],
                },
              });

              const isAvailable = !existingSession;

              timeSlots.push({
                date: currentDate.toISOString().split("T")[0],
                dayOfWeek: dayOfWeek,
                dayName: [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ][dayOfWeek],
                time: `${hour.toString().padStart(2, "0")}:00`,
                isAvailable: isAvailable,
              });
            }
          }
        }

        return {
          _id: mentor._id,
          firstName: (mentor.userId as any).firstName,
          lastName: (mentor.userId as any).lastName,
          email: (mentor.userId as any).email,
          avatar: (mentor.userId as any).avatar,
          specialties: mentor.specialties,
          bio: mentor.bio,
          rating: mentor.rating,
          hourlyRate: mentor.hourlyRate,
          subjects: mentor.subjects,
          availability: timeSlots,
        };
      })
    );

    success(res, { mentors: mentorsWithAvailability });
  } catch (error) {
    handleError(res, error, "fetch mentors with availability");
  }
};

export const getMentorForBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { mentorId } = req.params;

    const mentor = await Mentor.findById(mentorId)
      .populate({
        path: "userId",
        select: "firstName lastName email avatar",
      })
      .select("specialties bio rating hourlyRate availability subjects");

    if (!mentor) return notFound(res, "Mentor");

    const mentorData = {
      _id: mentor._id,
      firstName: (mentor.userId as any).firstName,
      lastName: (mentor.userId as any).lastName,
      email: (mentor.userId as any).email,
      avatar: (mentor.userId as any).avatar,
      specialties: mentor.specialties,
      bio: mentor.bio,
      rating: mentor.rating,
      hourlyRate: mentor.hourlyRate,
      subjects: mentor.subjects,
    };

    success(res, mentorData);
  } catch (error) {
    handleError(res, error, "fetch mentor for booking");
  }
};
