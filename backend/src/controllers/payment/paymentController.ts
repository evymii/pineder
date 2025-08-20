import { Request, Response } from "express";
import Payment from "../../models/Payment";
import Session from "../../models/Session";
import GroupSession from "../../models/GroupSession";

// Create payment intent
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { sessionId, groupSessionId, amount, currency = "USD" } = req.body;

    // Validate that either sessionId or groupSessionId is provided
    if (!sessionId && !groupSessionId) {
      return res.status(400).json({
        success: false,
        error: "Either sessionId or groupSessionId is required",
      });
    }

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid amount is required",
      });
    }

    // Check if session/group session exists
    if (sessionId) {
      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          error: "Session not found",
        });
      }
    }

    if (groupSessionId) {
      const groupSession = await GroupSession.findById(groupSessionId);
      if (!groupSession) {
        return res.status(404).json({
          success: false,
          error: "Group session not found",
        });
      }
    }

    // Create payment record
    const payment = new Payment({
      amount,
      currency,
      status: "pending",
      sessionId,
      groupSessionId,
      userId: req.body.userId,
      paymentMethod: req.body.paymentMethod || "stripe",
      metadata: {
        sessionId,
        groupSessionId,
        amount,
        currency,
      },
    });

    await payment.save();

    // In a real implementation, you would integrate with Stripe or another payment processor
    // For now, we'll simulate a payment intent
    const paymentIntent = {
      id: (payment._id as any).toString(),
      client_secret: `pi_${payment._id as any}_secret_${Date.now()}`,
      amount: payment.amount,
      currency: payment.currency,
      status: "requires_payment_method",
    };

    res.status(201).json({
      success: true,
      data: paymentIntent,
      message: "Payment intent created successfully",
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create payment intent",
    });
  }
};

// Confirm payment
export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.params;
    const { paymentMethodId } = req.body;

    const payment = await Payment.findById(paymentIntentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found",
      });
    }

    if (payment.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Payment is not in pending status",
      });
    }

    // In a real implementation, you would confirm the payment with Stripe
    // For now, we'll simulate a successful payment
    payment.status = "completed";
    payment.transactionId = `txn_${Date.now()}`;
    await payment.save();

    // Update session or group session payment status
    if (payment.sessionId) {
      await Session.findByIdAndUpdate(payment.sessionId, {
        paymentStatus: "completed",
      });
    }

    if (payment.groupSessionId) {
      await GroupSession.findByIdAndUpdate(payment.groupSessionId, {
        // Note: Group sessions might have different payment logic
      });
    }

    res.json({
      success: true,
      data: payment,
      message: "Payment confirmed successfully",
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to confirm payment",
    });
  }
};

// Refund payment
export const refundPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found",
      });
    }

    if (payment.status !== "completed") {
      return res.status(400).json({
        success: false,
        error: "Only completed payments can be refunded",
      });
    }

    // In a real implementation, you would process the refund with Stripe
    // For now, we'll simulate a refund
    payment.status = "refunded";
    payment.refundReason = reason;
    await payment.save();

    // Update session or group session payment status
    if (payment.sessionId) {
      await Session.findByIdAndUpdate(payment.sessionId, {
        paymentStatus: "refunded",
      });
    }

    res.json({
      success: true,
      data: payment,
      message: "Payment refunded successfully",
    });
  } catch (error) {
    console.error("Error refunding payment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to refund payment",
    });
  }
};
