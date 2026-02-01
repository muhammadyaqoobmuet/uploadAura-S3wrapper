import { Router } from "express";
import fileV1Routes from "./v1/files.routes";
import { apiKeyAuthMiddleware } from "../../middlewares/api-key-auth";
import { publicGetFileUrlController } from "../../controllers/files.controller";


const publicRoutes = Router();
publicRoutes.use(`${process.env.BASE_PATH}/v1`, fileV1Routes);

publicRoutes.use('/files/:fileId/view', publicGetFileUrlController);

export default publicRoutes;
