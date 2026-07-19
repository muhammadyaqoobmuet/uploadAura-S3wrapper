import { Router } from "express";
import authRoute from "./auth.route";
import { passportAuthenticateJwt } from "../../config/passport-config";
import { filesRoutes } from "./file.route";
import analyticsRoute from "./analytics.route";
import { apiRoute } from "./apiKey.route";
import aiRouter from "./ai";

const internalRoutes = Router();
internalRoutes.use('/auth', authRoute)
internalRoutes.use('/files', passportAuthenticateJwt, filesRoutes)
internalRoutes.use('/analytics',passportAuthenticateJwt ,analyticsRoute)
internalRoutes.use('/apikey', passportAuthenticateJwt, apiRoute)
internalRoutes.use('/ai', aiRouter)

export default internalRoutes;
