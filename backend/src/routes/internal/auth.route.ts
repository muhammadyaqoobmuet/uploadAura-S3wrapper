import { Router } from "express";
import { loginUser, registerUser } from "../../controllers/auth.controller";
import { zodMiddleware } from "../../middlewares/zodMiddleware";
import { loginSchema, registerSchema } from "../../validators/auth";



const authRoute = Router();
authRoute.post('/register', zodMiddleware(registerSchema), registerUser)
authRoute.post('/login',zodMiddleware(loginSchema),loginUser)


export default authRoute;
