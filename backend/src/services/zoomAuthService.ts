import axios from "axios";

export class ZoomAuthService {
  private static accessToken: string | null = null;
  private static tokenExpiry: number = 0;

  static async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // For development without Zoom credentials, use mock service
    if (process.env.NODE_ENV === "development" && !process.env.ZOOM_CLIENT_ID) {
      console.log("🔧 Development mode: Using mock Zoom service");
      return "mock_token";
    }

    // Server-to-server OAuth flow (only if Zoom credentials are provided)
    try {
      const clientId = process.env.ZOOM_CLIENT_ID;
      const clientSecret = process.env.ZOOM_CLIENT_SECRET;
      const accountId = process.env.ZOOM_ACCOUNT_ID;

      if (!clientId || !clientSecret || !accountId) {
        console.log("⚠️ Zoom credentials not configured, using mock service");
        return "mock_token";
      }

      // Create JWT token for server-to-server OAuth
      const jwt = require("jsonwebtoken");
      const payload = {
        iss: clientId,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiry
      };

      const token = jwt.sign(payload, clientSecret);

      // Exchange JWT for access token
      const response = await axios.post("https://zoom.us/oauth/token", null, {
        params: {
          grant_type: "account_credentials",
          account_id: accountId,
        },
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString("base64")}`,
        },
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;

      return this.accessToken!;
    } catch (error) {
      console.error("Error getting Zoom access token:", error);
      console.log("⚠️ Falling back to mock Zoom service");
      return "mock_token";
    }
  }
}
