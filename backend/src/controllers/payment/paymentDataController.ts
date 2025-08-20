import { Request, Response } from "express";
import Payment from "../../models/Payment";

// Get payment history with pagination and filters
export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build filter object
    const filter: any = {};

    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    const payments = await Payment.find(filter)
      .populate("sessionId", "title startTime")
      .populate("groupSessionId", "title startTime")
      .populate("userId", "firstName lastName email")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(filter);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: payments,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch payment history",
    });
  }
};

// Get payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate("sessionId", "title startTime endTime")
      .populate("groupSessionId", "title startTime endTime")
      .populate("userId", "firstName lastName email");

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found",
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch payment",
    });
  }
};

// Get payment statistics
export const getPaymentStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const filter: any = {};
    if (userId) filter.userId = userId;

    const stats = await Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalPayments = await Payment.countDocuments(filter);
    const totalAmount = await Payment.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const statsObject = stats.reduce((acc, stat) => {
      acc[stat._id] = {
        count: stat.count,
        totalAmount: stat.totalAmount,
      };
      return acc;
    }, {} as any);

    res.json({
      success: true,
      data: {
        stats: statsObject,
        totalPayments,
        totalAmount: totalAmount[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch payment statistics",
    });
  }
};
