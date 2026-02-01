import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { BadRequestException } from "../utils/appError";
import {
  createApiKeySchema,
  deleteApiKeySchema,
} from "../validators/apiKey.validator";
import {
  createApiKeyService,
  deleteApiKeyService,
  getAllApiKeysService,
} from "../services/apiKey.service";
import { HttpStatusCode } from "axios";

export const createApiKey = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as any)?._id?.toString();
    if (!userId) {
      throw new BadRequestException("User not authenticated");
    }
    const { name } = createApiKeySchema.parse(req.body);
    const { rawKey } = await createApiKeyService(userId, name);
    res
      .status(HttpStatusCode.Created)
      .json({ message: "API key created successfully", key: rawKey });
  },
);

export const getAllApiKeys = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as any)?._id?.toString();
    if (!userId) {
      throw new BadRequestException("User not authenticated");
    }
    const pagination = {
      pageSize: parseInt(req.query.pageSize as string) || 20,
      pageNumber: parseInt(req.query.pageNumber as string) || 1,
    };
    const apiKeys = await getAllApiKeysService(userId, pagination);
    res.status(HttpStatusCode.Ok).json(apiKeys);
  },
);

export const deleteApiKey = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as any)?._id?.toString();
    if (!userId) {
      throw new BadRequestException("User not authenticated");
    }
    const { id } = deleteApiKeySchema.parse(req.params);
    const result = await deleteApiKeyService(userId, id);
    res.status(HttpStatusCode.Ok).json({ success: true });
  },
);
