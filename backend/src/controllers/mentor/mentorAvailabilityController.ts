import { Request, Response } from "express";
import TeacherAvailability from "../../models/TeacherAvailability";

// Get teacher availability
export const getTeacherAvailability = async (req: Request, res: Response) => {
  try {
    const { mentorId } = req.params;
    const availability = await TeacherAvailability.find({ mentorId }).sort({
      startTime: 1,
    });

    res.json({
      success: true,
      data: availability,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch availability",
    });
  }
};

// Create new availability slot
export const createTeacherAvailability = async (
  req: Request,
  res: Response
) => {
  try {
    const availabilityData = req.body;
    const availability = await TeacherAvailability.create(availabilityData);

    res.status(201).json({
      success: true,
      data: availability,
      message: "Availability created successfully",
    });
  } catch (error) {
    console.error("Error creating availability:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create availability",
    });
  }
};

// Update availability slot
export const updateTeacherAvailability = async (
  req: Request,
  res: Response
) => {
  try {
    const availability = await TeacherAvailability.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!availability) {
      return res.status(404).json({
        success: false,
        error: "Availability slot not found",
      });
    }

    res.json({
      success: true,
      data: availability,
      message: "Availability updated successfully",
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update availability",
    });
  }
};

// Delete availability slot
export const deleteTeacherAvailability = async (
  req: Request,
  res: Response
) => {
  try {
    const availability = await TeacherAvailability.findByIdAndDelete(
      req.params.id
    );

    if (!availability) {
      return res.status(404).json({
        success: false,
        error: "Availability slot not found",
      });
    }

    res.json({
      success: true,
      message: "Availability deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting availability:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete availability",
    });
  }
};

// Get available time slots for booking
export const getAvailableTimeSlots = async (req: Request, res: Response) => {
  try {
    const { mentorId } = req.params;
    const { date } = req.query;

    const filter: any = {
      mentorId,
      isBooked: false,
    };

    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      filter.startTime = { $gte: startDate, $lt: endDate };
    }

    const availableSlots = await TeacherAvailability.find(filter).sort({
      startTime: 1,
    });

    res.json({
      success: true,
      data: availableSlots,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch available slots",
    });
  }
};
