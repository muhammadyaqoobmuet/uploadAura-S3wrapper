import * as z from "zod"

const emailSchema = z.string().min(1).trim().max(255).email("invalid email! please provide correct email brotha")
const passwordSchema= z.string().min(5).max(255).trim()
const nameSchema = z.string().min(2).max(255).trim()

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  profilePicture:z.string().url().optional()
})


export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})
