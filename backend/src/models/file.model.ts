import mongoose, { type Model, type mongo } from "mongoose";
import { formatBytes } from "../utils/format-byte";

export enum UploadSourceEnum {
  WEB = "WEB",
  API = "API",
}

export interface fileInterface extends Document {
  userId: mongoose.Types.ObjectId; // who uploaded it
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number; //bytes
  formattedSize: string; // by method we created in utils format-byte
  ext: string; // extension
  uploadVia: keyof typeof UploadSourceEnum; // web or api
  url: string; // url of file
  createdAt: Date;
  updatedAt: Date;
}

export interface fileModelInterface extends Model<fileInterface> {
  calculateUsage(userId: mongoose.Types.ObjectId): Promise<number>;
}

const fileSchema = new mongoose.Schema<fileInterface, fileModelInterface>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
      unique: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: 1,
    },
    ext: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: false,
    },
    uploadVia: {
      type: String,
      enum: Object.keys(UploadSourceEnum),
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: {
      transform(doc, ret) {
        // ret is the plain object representation of the document
        ret.formattedSize = formatBytes(ret.size);
        return ret;
      },
    },
    toJSON: {
      transform(doc, ret) {
        ret.formattedSize = formatBytes(ret.size);
        return ret;
      },
    },
  },
);

fileSchema.statics.calculateUsage = async function (
  userId: mongoose.Types.ObjectId,
): Promise<number> {
  const result = await this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalSize: {
          $sum: "$size",
        },
      },
    },
  ]);
  return result[0]?.totalSize || 0;
};

// adding index
fileSchema.index({ userId: 1 });
fileSchema.index({ createdAt: -1 });

const FileModel = mongoose.model<fileInterface, fileModelInterface>(
  "File",
  fileSchema,
);
export default FileModel;
