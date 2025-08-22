import { LogMeta } from "../types/common";

interface LogLevel {
  info: (message: string, meta?: LogMeta) => void;
  error: (message: string, meta?: LogMeta) => void;
  warn: (message: string, meta?: LogMeta) => void;
  debug: (message: string, meta?: LogMeta) => void;
}

class Logger implements LogLevel {
  info(message: string, meta?: LogMeta) {
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] INFO: ${message}`,
      meta ? JSON.stringify(meta) : ""
    );
  }

  error(message: string, meta?: LogMeta) {
    const timestamp = new Date().toISOString();
    console.error(
      `[${timestamp}] ERROR: ${message}`,
      meta ? JSON.stringify(meta) : ""
    );
  }

  warn(message: string, meta?: LogMeta) {
    const timestamp = new Date().toISOString();
    console.warn(
      `[${timestamp}] WARN: ${message}`,
      meta ? JSON.stringify(meta) : ""
    );
  }

  debug(message: string, meta?: LogMeta) {
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toISOString();
      console.log(
        `[${timestamp}] DEBUG: ${message}`,
        meta ? JSON.stringify(meta) : ""
      );
    }
  }
}

export const logger = new Logger();
