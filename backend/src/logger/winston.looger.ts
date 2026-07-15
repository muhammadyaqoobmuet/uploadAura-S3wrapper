import winston from "winston";

const { printf, combine, colorize, timestamp, errors, json } = winston.format;

const transports: winston.transport[] = [];

// Human-readable, colorized logs for local development.
if (process.env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({
          all: true,
          colors: {
            info: "blue",
            warn: "yellow",
            error: "red",
            debug: "cyan",
            verbose: "grey",
            http: "green",
          },
        }),
        timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
        printf(({ level, message, stack, timestamp, ...meta }) => {
          return `${timestamp} [${level?.toUpperCase()}]: ${message} ${
            stack ? stack : ""
          }${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
        }),
      ),
    }),
  );
}

// Fallback: never run with zero transports (Winston would otherwise drop logs
// and warn "Attempt to write logs with no transports" and leak memory).
if (transports.length === 0) {
  transports.push(
    new winston.transports.Console({
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
  );
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), errors({ stack: true }), json()),
  silent: process.env.NODE_ENV === "test",
  transports,
});
