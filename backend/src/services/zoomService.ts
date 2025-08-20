import axios from "axios";

export interface ZoomMeetingConfig {
  topic: string;
  start_time: string;
  duration: number;
  timezone: string;
  password?: string;
  settings: {
    host_video: boolean;
    participant_video: boolean;
    join_before_host: boolean;
    mute_upon_entry: boolean;
    watermark: boolean;
    use_pmi: boolean;
    approval_type: number;
    audio: string;
    auto_recording: string;
  };
}

export interface ZoomMeetingResponse {
  id: number;
  join_url: string;
  start_url: string;
  password: string;
  topic: string;
  start_time: string;
  duration: number;
}

class ZoomService {
  private apiKey: string;
  private apiSecret: string;
  private accountId: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.ZOOM_API_KEY || "";
    this.apiSecret = process.env.ZOOM_API_SECRET || "";
    this.accountId = process.env.ZOOM_ACCOUNT_ID || "";
    this.baseURL = "https://api.zoom.us/v2";
  }

  private async getAccessToken(): Promise<string> {
    try {
      const response = await axios.post("https://zoom.us/oauth/token", null, {
        params: {
          grant_type: "account_credentials",
          account_id: this.accountId,
        },
        auth: {
          username: this.apiKey,
          password: this.apiSecret,
        },
      });

      return response.data.access_token;
    } catch (error) {
      console.error("Error getting Zoom access token:", error);
      throw new Error("Failed to get Zoom access token");
    }
  }

  async createMeeting(config: ZoomMeetingConfig): Promise<ZoomMeetingResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseURL}/users/me/meetings`,
        config,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating Zoom meeting:", error);
      throw new Error("Failed to create Zoom meeting");
    }
  }

  async updateMeeting(
    meetingId: number,
    config: Partial<ZoomMeetingConfig>
  ): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();

      await axios.patch(`${this.baseURL}/meetings/${meetingId}`, config, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error updating Zoom meeting:", error);
      throw new Error("Failed to update Zoom meeting");
    }
  }

  async deleteMeeting(meetingId: number): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();

      await axios.delete(`${this.baseURL}/meetings/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Error deleting Zoom meeting:", error);
      throw new Error("Failed to delete Zoom meeting");
    }
  }

  generateSimpleMeetingLink(sessionId: string, password?: string): string {
    const baseUrl = "https://zoom.us/j/";
    const meetingId = this.generateMeetingId(sessionId);
    const meetingPassword = password || this.generatePassword();

    return `${baseUrl}${meetingId}?pwd=${meetingPassword}`;
  }

  private generateMeetingId(sessionId: string): string {
    const hash = this.simpleHash(sessionId);
    return Math.abs(hash).toString().padStart(10, "0");
  }

  private generatePassword(): string {
    return Math.random().toString().slice(2, 8);
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  }
}

export default new ZoomService();
