import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    // Performance optimizations
    await mongoose.connect(mongoURI, {
      // Connection pool settings for better performance
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2, // Minimum number of connections in the pool
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000, // Socket timeout

      bufferCommands: false, // Disable mongoose buffering
    });

    // Set mongoose options for better performance
    mongoose.set("debug", process.env.NODE_ENV === "development");
    mongoose.set("strictQuery", false);

    logger.info(
      "MongoDB connected successfully with performance optimizations"
    );
  } catch (error) {
    logger.error("MongoDB connection failed", { error });
    throw error;
  }
};
