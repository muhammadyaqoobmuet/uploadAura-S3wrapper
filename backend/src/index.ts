import "dotenv/config";
import express, { type Request, type Response } from "express";
import helmet from "helmet";
import cors from "cors";
import type { CorsOptions } from "cors";
import { UnauthorizedException, UnauthorizedRequest } from "./utils/appError";
import { errorHandler } from "./middlewares/errorHandler";
import { connectDb, disconnectDb } from "./utils/db";
import { logger } from "./logger/winston.looger";
import internalRoutes from "./routes/internal";
import "./config/passport-config";
import passport from "passport";
// Import the full public router, which mounts both:
//   - /files/:fileId/view  (public file stream)
//   - /api/v1/upload       (SDK upload via API key)
import publicRoute from "./routes/public";

const app = express();
app.use(helmet());
app.use(passport.initialize());
const BASE_PATH = process.env.BASE_PATH || "/api"; // /api is base path can be changed from api end point
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || "https://uploadnest-alpha.vercel.app"
).split(",");
console.log("ALLOWED_ORIGINS -> looks like", allowedOrigins);
const corsOptions: CorsOptions = {
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      const errorMessage = `Cors not Allowed ${origin}`;
      cb(new UnauthorizedException(errorMessage), false);
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`${BASE_PATH}`, internalRoutes);
app.use(publicRoute);

app.use(errorHandler);
app.use("/health", (req, res) => {
  res.status(200).send("server is running");
});
async function startServer() {
  const PORT = process.env.PORT || 8000;
  try {
    // await connectDb()
    const server = app.listen(PORT, async () => {
      await connectDb();
      console.log("server running on", PORT);
    });

    // handling SIGNINT SIGNTER
    const shutdownSignals = ["SIGTERM", "SIGINT"];
    // why using this
    // app can stop safely instead of being killed mid-work

    shutdownSignals.forEach((signal) => {
      process.on(signal, async () => {
        try {
          server.close(() => {
            logger.info(`system closing gracefully`);
          });
          // server close now close db
          // call here
          await disconnectDb();

          // flush tails

          process.exit(0);
        } catch (error) {
          // add logger here for error
          logger.error(`error occured: closing process (exit)`);
          process.exit(1);
        }
      });
    });

    process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
      logger.error("Unhandled Promise Rejection", reason);
      // graceful shutdown
      process.exit(1);
    });

    process.on("uncaughtException", (reason: any, promise: Promise<any>) => {
      // add looger here
      logger.error("Unhandled Exception Rejection", reason);
      process.exit(1);
    });
  } catch (error) {
    // same here
    console.error(error);
    logger.error(`error occured exiting system `);
    process.exit(1);
  }
}

startServer();
