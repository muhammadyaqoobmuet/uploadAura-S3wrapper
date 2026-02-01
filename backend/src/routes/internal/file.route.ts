import { Router } from "express";
import { multiUpload } from "../../config/multer-config";
import { deleteFilesController, downloadFilesController, getAllFilesController, uploadFileViaWebController } from "../../controllers/files.controller";
import { checkStorageMiddleware } from "../../middlewares/check-storage";

export const filesRoutes = Router();
filesRoutes.post(
  "/upload",
  multiUpload,
  checkStorageMiddleware,
  uploadFileViaWebController,
);
filesRoutes.post("/download", downloadFilesController);
filesRoutes.get("/all", getAllFilesController);
filesRoutes.delete("/bulk-delete", deleteFilesController);


