import { response, type Request, type Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { BadRequestException } from "../utils/appError";
import { logger } from "../logger/winston.looger";
import { UploadSourceEnum } from "../models/file.model";
import {
  deleteFilesService,
  downloadFilesService,
  getAllFilesServies,
  getFileUrlService,
  uploadFileService,
} from "../services/files.service";
import { HTTPSTATUS } from "../config/http.config";
import {
  deleteFilesSchema,
  downloadFilesSchema,
  fileIdSchema,
} from "../validators/file";

export const uploadFileViaWebController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id.toString();
    if (!userId) {
      logger.error("no user id provided at uploadFileViaWebController");
      throw new BadRequestException("no user id found please provide userid ");
    }
    const files = req.files as Express.Multer.File[]; // these files are type of Express.Multer.File[]
    const uploadedVia = UploadSourceEnum.WEB;
    const results = await uploadFileService(userId, files, uploadedVia);
    return res.status(HTTPSTATUS.OK).json({
      results,
    });
  },
);

export const uploadFileViaApi = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id.toString();
    if (!userId) {
      logger.error("no user id provided at uploadFileViaApiController");
      throw new BadRequestException("no user id found please provide userid ");
    }
    const files = req.files as Express.Multer.File[]; // these files are type of Express.Multer.File[]
    const uploadedVia = UploadSourceEnum.API;
    const results = await uploadFileService(userId, files, uploadedVia);
    return res.status(HTTPSTATUS.OK).json({
      results,
    });
  },
);

export const getAllFilesController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id.toString();
    if (!userId) {
      logger.error("no user id provided at getAllFilesController");
      throw new BadRequestException("no user id found please provide userid ");
    }
    const filter = {
      keyword: req.query.keyword as string | undefined,
    };
    const pagination = {
      pageSize: parseInt(req.query.pageSize as string) || 20,
      pageNumber: parseInt(req.query.pageNumber as string) || 1,
    };

    const results = await getAllFilesServies(userId, filter, pagination);
    return res.status(HTTPSTATUS.OK).json({
      message: "all files fetched successfully",
      ...results,
    });
  },
);

export const publicGetFileController = asyncHandler(
  async (req: Request, res: Response) => {
    const fileId = fileIdSchema.parse(req.params.fileId);
    const { url } = await getFileUrlService(fileId);
    return res.redirect(url);
  },
);

export const deleteFilesController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id.toString();
    if (!userId) {
      logger.error("no user id provided at deleteFileController");
      throw new BadRequestException("no user id found please provide userid ");
    }
    const { fileIds } = deleteFilesSchema.parse(req.body);
    const result = (await deleteFilesService(userId, fileIds)) as any;
    return res.status(HTTPSTATUS.OK).json({
      message: "files deleted successfully",
      ...result,
    });
  },
);

export const downloadFilesController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { fileIds } = downloadFilesSchema.parse(req.body);
    if (!userId)
      throw new BadRequestException("no user id found please provide userid ");
    const result = await downloadFilesService(userId.toString(), fileIds);
    return res.status(HTTPSTATUS.OK).json({
      message: "File download URL successfully",
      downloadUrl: result?.url,
      isZip: result?.isZip || false,
    });
  },
);

export const publicGetFileUrlController = asyncHandler(
  async (req: Request, res: Response) => {
    const fileId = fileIdSchema.parse(req.params.fileId);
    const { url, stream, contentType, fileSize } =
      await getFileUrlService(fileId);
    res.set({
      "Content-Type": contentType,
      "Content-Length": fileSize,
      "Cache-Control": "public, max-age=3600",
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
    });
    stream.pipe(res);
  },
);
