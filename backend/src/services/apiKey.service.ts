import ApiKeyModel from "../models/apiKey.model";
import { BadRequestException } from "../utils/appError";
import { generateApiKey } from "../utils/key";

export const createApiKeyService = async (userId: string, name: string) => {
  const { rawKey, displayKey, hashedKey } = generateApiKey();
  const apiKey = new ApiKeyModel({
    userId,
    name,
    hashedKey,
    displayKey,
  });
  await apiKey.save();
  return {
    rawKey,
  };
};

export const getAllApiKeysService = async (
  userId: string,
  pagination: { pageSize: number; pageNumber: number },
) => {
  const { pageSize, pageNumber } = pagination;
  const [apiKeys, totalCount] = await Promise.all([
    await ApiKeyModel.find({ userId })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .sort({ createdAt: -1 }),
    ApiKeyModel.countDocuments({ userId }),
  ]);
  const totalPages = Math.ceil(totalCount / pageSize);
  return {
    apiKeys,
    pagination: {
      pageSize,
      pageNumber,
      totalPages,
      totalCount,
    },
  };
};

export const deleteApiKeyService = async (userId: string, id: string) => {
  // first find then delete 
  const apiKey = await ApiKeyModel.findOneAndDelete({ _id: id, userId });
  if(!apiKey) {
    throw new BadRequestException("Api key not found");
  }
  return apiKey;
};

