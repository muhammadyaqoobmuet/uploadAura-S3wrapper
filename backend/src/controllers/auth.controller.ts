import {Request, Response,NextFunction } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { userLoginBody, userRegisterBody } from "../types/user";
import { HTTPSTATUS } from "../config/http.config";
import { loginUserService, registerUserService } from "../services/auth.service";

export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction)=>{
 // till here data will be safe so

  const data = req.body as userRegisterBody;
  

  // call a fucntion on service
  const userCreatedData = await registerUserService(data);
  console.log("here2")

  return res.status(HTTPSTATUS.OK).json({
    sucess: true,
    message: "User Created!",
    user:userCreatedData
  })
})


// login controller

export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // till here data will be safe so
  const data = req.body as userLoginBody;

  // call a fucntion on service
  const userCreatedData = await loginUserService(data);

  return res.status(HTTPSTATUS.CREATED).json({
    message: 'User logged in ',
    ...userCreatedData
  })
})
