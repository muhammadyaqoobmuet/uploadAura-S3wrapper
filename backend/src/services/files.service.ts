import type multer from "multer";
import type { UploadSourceEnum } from "../models/file.model";
import { findUserById } from "./auth.service";
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";
import path from "path";
import { sanitizeFilename } from "../utils/helpers";
import { logger } from "../logger/winston.looger";
import { v4 as uuidV4 } from "uuid";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { s3 } from "../config/aws3-config";
import FileModel from "../models/file.model";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mongoose from "mongoose";
import archiver from "archiver";
import { PassThrough, Readable } from "stream";

export const uploadFileService = async (
  userId: string,
  files: Express.Multer.File[],
  uploadedVia: keyof typeof UploadSourceEnum,
) => {
  if (!userId) throw new BadRequestException("no user id found");
  // check the user
  const user = await findUserById(userId);
  if (!user) {
    throw new UnauthorizedException("no user exists my maan");
  }
  if (!files.length) throw new BadRequestException("files not found !");

  // start uploading
  // we have data like files array
  const results = await Promise.allSettled(
    files.map(async (file: Express.Multer.File) => {
      let _storageKey: string | null = null;
      try {
        const { storageKey } = await uploadToS3(file, userId);
        _storageKey = storageKey;
        const createdFile = await FileModel.create({
          userId,
          storageKey,
          originalName: file.originalname,
          uploadVia: uploadedVia,
          size: file.size,
          ext: path.extname(file.originalname)?.slice(1)?.toLowerCase(),
          url: "",
          mimeType: file.mimetype,
        });
        return {
          fileId: createdFile._id,
          originalName: createdFile.originalName,
          size: createdFile.size,
          ext: createdFile.ext,
          mimeType: createdFile.mimeType,
        };
      } catch (error) {
        logger.error("Error uploading file", error);
        if (_storageKey) {
          //delete from s3 bucket if any of itteration failed TODO: later on will delete
        }
        throw error;
      }
    }),
  );

  const successfulRes = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  const failedRes = results
    .filter((r) => r.status === "rejected")
    .map((r) => r.reason);

  if (failedRes.length > 0) {
    logger.warn("failed to upload file", { files });
  }
  
  
  return {
    message: `uploaded successfully ${successfulRes.length} out of ${files.length} files `,
    data: successfulRes,
    failedCount:
      failedRes.length == 0
        ? "no failed count all uploaded successfully !"
        : `no of failed files ${failedRes.length} please consider them to reupload again`,
  };
};

// sending stream
async function uploadToS3(
  file: Express.Multer.File,
  userId: string,
  metadata?: Record<string, string>,
): Promise<any> {
  try {
    const ext = path.extname(file.originalname); // returns extension of file for example file.txt -> .txt means last . is the extension
    const basename = path.basename(file.originalname, ext); // this result is the filename without the extension for example file.txt -> file
    const cleanName = sanitizeFilename(basename).substring(0, 64); // this result is the sanitized filename without the extension for example file.txt -> file
    logger.info(sanitizeFilename(basename), cleanName);
    const storageKey = `users/${userId}/${uuidV4()}-${cleanName}${ext}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: storageKey,
      Body: file.buffer,
      ...(metadata && { Metadata: metadata }),
    });
    await s3.send(command); // streaming
    logger.info(`sent to the cloud ab kuch ni hosakta`);
    return {
      storageKey,
    };
  } catch (error) {
    logger.error("error putting object to bucket", { error });
    throw error;
  }
}

export const getAllFilesServies = async (
  userId: string,
  filter: {
    keyword?: string;
  },
  pagination: { pageSize: number; pageNumber: number },
) => {
  const { keyword } = filter;
  const filterConditons: Record<string, any> = {
    userId,
  };
  if (keyword) {
    filterConditons.$or = [
      {
        originalName: {
          $regex: keyword,
          $options: "i", // i means case-insensitive
        },
      },
    ];
  }

  const { pageNumber, pageSize } = pagination; // default page number = 1 and page size = 20
  const skip = (pageNumber - 1) * pageSize; // initally skip = 0
  const [files, totalCount] = await Promise.all([
    FileModel.find(filterConditons)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 }),
    FileModel.countDocuments(filterConditons),
  ]);

  const filesWithUrls = await Promise.all(
    files.map(async (file) => {
      const url = await getFileFromS3({
        storageKey: file.storageKey,
        mimeType: file.mimeType,
        expiresIn: 3600,
      });
      logger.info(file);
      return {
        ...file.toObject(),
        url,
        storageKey: undefined,
      };
    }),
  );

  const totalPages = Math.ceil(totalCount / pageSize);
  return {
    files: filesWithUrls,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

async function getFileFromS3({
  storageKey,
  filename,
  mimeType,
  expiresIn = 60,
}: {
  storageKey: string;
  expiresIn?: number;
  filename?: string;
  mimeType?: string;
}) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: storageKey,
      ...(!filename && {
        ResponseContentType: mimeType,
        ResponseContentDisposition: `inline`, // this block means the file will be displayed inline in the browser
      }),
      ...(filename && {
        ResponseContentDisposition: `attachment;filename="${filename}"`, // this means the file will be downloaded as an attachment
      }),
    });

    return await getSignedUrl(s3, command, { expiresIn });
  } catch (error) {
    logger.error(`Failed to get file from S3: ${storageKey}`);
    throw error;
  }
}

async function deleteFromS3(storageKey: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: storageKey,
    });
    logger.info("deleteing from s3", { storageKey });
    await s3.send(command);
  } catch (error) {
    logger.error(`Failed to delete file from S3`, storageKey);
    throw error;
  }
}

export const getFileUrlService = async (fileId: string) => {
  const file = await FileModel.findById(fileId);
  if (!file) {
    throw new NotFoundException(`File not found: ${fileId}`);
  }
  // const url = await getFileFromS3({
  //   storageKey: file.storageKey,
  //   mimeType: file.mimeType,
  //   expiresIn: 3600,
  // });

  const stream = await getS3ReadStream(file.storageKey);

  return {
    url: "",
    stream,
    contentType: file.mimeType,
    fileSize: file.size,
  };
};

export const downloadFilesService = async (
  userId: string,
  fileIds: string[],
) => {
  const files = await FileModel.find({
    _id: { $in: fileIds },
    userId,
  });

  if (!files.length) throw new NotFoundException("no files found");
  if (files.length === 1) {
    const signedUrl = await getFileFromS3({
      storageKey: files[0].storageKey,
      filename: files[0].originalName,
    });
    return { url: signedUrl, isZip: false };
  }
  const url = await handleMultipleFilesDowload(files, userId);
  return { url, isZip: true };
};

export const handleMultipleFilesDowload = async (
  files: Array<{ storageKey: string; originalName: string }>,
  userId: string,
) => {
  const timestamp = Date.now();
  const zipKey = `temp-zips/${userId}/${timestamp}.zip`;
  const zipFilename = `uploadaura-${timestamp}.zip`;
  const zip = archiver("zip", { zlib: { level: 6 } });
  const passThrough = new PassThrough();
  zip.on("error", (err) => {
    passThrough.destroy(err);
  });

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: zipKey,
      Body: passThrough,
      ContentType: "application/zip",
    },
  });

  zip.pipe(passThrough);
  // zip --- passthrough --- aws
  for (const file of files) {
    try {
      const stream = await getS3ReadStream(file.storageKey);
      zip.append(stream, { name: sanitizeFilename(file.originalName) });
    } catch (error: any) {
      zip.destroy(error);
      throw error;
    }
  }
  await zip.finalize();
  await upload.done();
  const url = await getFileFromS3({
    storageKey: zipKey,
    filename: zipFilename,
    expiresIn: 3600,
  });

  return url;
};

export const deleteFilesService = async (userId: string, fileIds: string[]) => {
  const session = await mongoose.startSession();
  try {
    let result;
    const files = await session.withTransaction(async () => {
      const files = await FileModel.find({
        _id: { $in: fileIds },
        userId,
      }).session(session);

      if (!files) throw new NotFoundException("no files found");
      const s3Errors: string[] = [];
      await Promise.all(
        files.map(async (file) => {
          try {
            await deleteFromS3(file.storageKey);
          } catch (error) {
            logger.error(`Failed to delete file from S3`, file.storageKey);
            s3Errors.push(
              error instanceof Error ? error.message : String(error),
            );
          }
        }),
      );
      const successfullFileIds = files
        .filter((file) => !s3Errors.includes(file.storageKey))
        .map((file) => file._id);

      const { deletedCount } = await FileModel.deleteMany({
        _id: { $in: successfullFileIds },
      }).session(session);

      if (s3Errors.length > 0) {
        logger.warn(`Failed to delete ${s3Errors.length} files`, s3Errors);
      }
      result = { deletedCount, failedCount: s3Errors.length };
      return result;
    });
  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
};

export const getS3ReadStream = async (storageKey: string) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: storageKey,
    });
    const respose = await s3.send(command);
    if (!respose.Body) {
      logger.error(`Failed to get file from S3`, storageKey);
      throw new InternalServerException(`no body returned for key`);
    }
    return respose.Body as Readable;
  } catch (error) {
    logger.error(`Failed to get file from S3`, storageKey);
    throw new InternalServerException(`no body returned for key`);
  }
};
