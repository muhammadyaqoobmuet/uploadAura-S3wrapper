import type { Request } from "express";
import multer from "multer";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  MAX_FILES,
} from "../constants/multer";
import { BadRequestException } from "../utils/appError";

// first we create storage and define which memory or disk storage to use
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new BadRequestException(
        `the file type ${file.mimetype} is not allowed :) `,
      ),
    );
  }
  cb(null, true);
};

const upload = multer({
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    fieldSize: MAX_FILE_SIZE,
  },
});

export const multiUpload = upload.array("files", MAX_FILES);
