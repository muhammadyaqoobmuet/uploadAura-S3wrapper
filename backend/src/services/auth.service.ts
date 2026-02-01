import mongoose, { mongo } from "mongoose";
import { userLoginBody, userRegisterBody } from "../types/user";
import { User } from "../models/user.model";
import { BadRequestException, UnauthorizedException } from "../utils/appError";
import { logger } from "../logger/winston.looger";
import StorageModel from "../models/storage.model";
import { signJwtToken } from "../utils/jwt";

export const registerUserService = async (body: userRegisterBody) => {
  const { email } = body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new UnauthorizedException("User Already Exists");
    }
    const newUser = new User({
      ...body,
      profilePicture: body.profilePicture || null,
    });

    await newUser.save();
    const storage = new StorageModel({
      userId: newUser._id,
    });

    await storage.save();

    return { user: newUser.omitPassword() };
  } catch (e) {
    logger.error("error at registerUserService");
    throw e;
  }
};
export const loginUserService = async (body: userLoginBody) => {
  const { email, password } = body;

  const userExists = await User.findOne({ email });

  if (!userExists) {
    throw new UnauthorizedException("email or password is incorrect");
  }

  const isValidPassword = await userExists.comparePassword(password);

  if (!isValidPassword) {
    throw new UnauthorizedException("email or password is incorrect");
  }

  const { token, expiresAt } = signJwtToken({
    userId: userExists.id,
  });

  return {
    user: userExists.omitPassword(),
    token,
    expiresAt,
  };
};



export const findUserById = async (userId:string) =>{
  const user = await User.findById(userId);
  return user?.omitPassword();
}