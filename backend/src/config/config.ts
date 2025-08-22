import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || "",
  },

  // Server
  server: {
    port: process.env.PORT || 5555,
    nodeEnv: process.env.NODE_ENV || "development",
  },

  // Zoom
  zoom: {
    apiKey: process.env.ZOOM_API_KEY || "",
    apiSecret: process.env.ZOOM_API_SECRET || "",
  },

  // Frontend
  frontend: {
    url: process.env.FRONTEND_URL || "http://localhost:3000",
  },
};
