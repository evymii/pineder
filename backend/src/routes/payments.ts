import express from "express";

// Payment Operations Controllers
import {
  createPaymentIntent,
  confirmPayment,
  refundPayment,
} from "../controllers/payment/paymentController";

// Payment Data & Stats Controllers
import {
  getPaymentHistory,
  getPaymentById,
  getPaymentStats,
} from "../controllers/payment/paymentDataController";

const router = express.Router();

router.post("/create-intent", createPaymentIntent);
router.post("/:paymentIntentId/confirm", confirmPayment);
router.get("/history", getPaymentHistory);
router.get("/:id", getPaymentById);
router.post("/:id/refund", refundPayment);
router.get("/stats", getPaymentStats);

export default router;
