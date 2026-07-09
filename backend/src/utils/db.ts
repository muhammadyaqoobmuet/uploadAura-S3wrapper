import mongoose from "mongoose";
import { logger } from "../logger/winston.looger";

export const connectDb = async () => {
  try {
    console.log("connecting to db..." + process.env.MONGO_URI_PROD);
    await mongoose.connect(process.env.MONGO_URI_PROD!);
    logger.info("connected to db");
  } catch (error) {
    logger.error(
      "error",
      error instanceof Error ? error.message : "error connecting db",
    );
    process.exit(1);
  }
};

export const disconnectDb = async () => {
  try {
    await mongoose.disconnect();
    logger.info("disconnected to db");
  } catch (error) {
    logger.error(
      "error",
      error instanceof Error ? error.message : "error disconnecting db",
    );
    process.exit(1);
  }
};
