import z from "zod";
import { loginSchema, registerSchema } from "../validators/auth";

export type userRegisterBody = z.infer<typeof registerSchema >
export type userLoginBody = z.infer<typeof loginSchema >
