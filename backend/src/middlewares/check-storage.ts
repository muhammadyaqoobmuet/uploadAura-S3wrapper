import type { NextFunction, Request, Response } from "express";
import type mongoose from "mongoose";
import type { mongo } from "mongoose";
import { BadRequestException, UnauthorizedException } from "../utils/appError";
import StorageModel from "../models/storage.model";
import { logger } from "../logger/winston.looger";

export const checkStorageMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = req.user?._id;
		if (!userId) throw new UnauthorizedException('Unauthorized access');

		const files = (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);
		if (!files || files.length === 0) {
			throw new BadRequestException("dont you have life , give me files rn it doesnt have any files in request ")
		}

		const totalFileSize = files.reduce((sum, file) => sum + file.size, 0);
		const result = await StorageModel.validateUpload(userId, totalFileSize)
		logger.info(`storage results :${JSON.stringify(result)}`)
		next();

	} catch (error) {
		next(error);
	}

}