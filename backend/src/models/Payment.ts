import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  sessionId?: mongoose.Types.ObjectId;
  groupSessionId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  paymentMethod: string;
  transactionId?: string;
  refundReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
    },
    groupSessionId: {
      type: Schema.Types.ObjectId,
      ref: "GroupSession",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
    },
    refundReason: {
      type: String,
      maxlength: 500,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ sessionId: 1 });
paymentSchema.index({ groupSessionId: 1 });

export default mongoose.model<IPayment>("Payment", paymentSchema);
