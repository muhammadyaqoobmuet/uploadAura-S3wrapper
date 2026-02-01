import mongoose, { mongo, Schema, type Model, type Types } from "mongoose";
import FileModel from "./file.model";
import { BadRequestException } from "../utils/appError";
import { ErrorCodeEnum } from "../enums/error.enum";

export const STORAGE_QUOTA = 2 * 1024 * 1024 * 1024; //2GB     1GB = 1024MB  1MB = 1024KB 1KB = 1024 Byte 1Byte 8 bits well it depends

interface IStorage {
  userId: Types.ObjectId;
  storageQuota: number;
  createdAt: Date;
  updatedAt: Date;
}
// what getStorageMetrics will return
interface StorageMetrics {
  quota: number;
  usage: number;
  remaining: number;
}

// on upload we check if the file size exceeds the remaining quota
interface UploadValidation {
  allowed: boolean;
  newUsage: number;
  remainingAfterUpload: number;
}

interface StorageStatics {
  getStorageMetrics(userId: Types.ObjectId): Promise<StorageMetrics>;
  validateUpload(
    userId: Types.ObjectId,
    fileSize: number,
  ): Promise<UploadValidation>;
}

interface StorageDocument extends IStorage, Document {}
interface StorageModelType extends Model<StorageDocument>, StorageStatics {}

const storageSchema = new Schema<StorageDocument, StorageModelType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storageQuota: {
      type: Number,
      default: STORAGE_QUOTA,
      min: [0, "Storage quota cant be negative"],
    },
  },
  { timestamps: true },
);

// adding statics methods to the schema so we can call them on the model
storageSchema.statics = {
  // method to get storage metrics for a user
  async getStorageMetrics(userId: Types.ObjectId) {
    // find one storage/user with userID
    // checks it does it exists
    // calculate usage from FileModal
    // return qouta , remaining , usage

    const storage = await this.findOne({ userId });
    if (!storage) throw new Error("Record of Storage Not Found");
    const usage = await FileModel.calculateUsage(userId);
    return {
      quota: storage.storageQuota,
      usage: usage,
      remaining: storage.storageQuota - usage,
    };
  },
  // method to validate an upload before saving a file
  async validateUpload(userId: Types.ObjectId, totalFileSize: number) {
    if (totalFileSize < 0)
      throw new BadRequestException("file size must be greater or +ve");
    const metrics = await this.getStorageMetrics(userId);
    const hasSpace = metrics.remaining > totalFileSize;
    if (!hasSpace) {
      const shortFall = totalFileSize - metrics.remaining;
      throw new BadRequestException(
        `Insufficient Storage . ${shortFall} needed`,
        ErrorCodeEnum.INSUFFICIENT_STORAGE,
      );
    }
    return {
      allowed: true,
      newUsage: metrics.usage + totalFileSize,
      remainingAfterUpload: metrics.remaining - totalFileSize,
    };
  },
};

const StorageModel = mongoose.model<StorageDocument, StorageModelType>(
  "Storage",
  storageSchema,
);
export default StorageModel;
