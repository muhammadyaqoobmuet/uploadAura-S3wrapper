import { Router } from 'express';
import { multiUpload } from '../../../config/multer-config';
import { checkStorageMiddleware } from '../../../middlewares/check-storage';
import { uploadFileViaApi } from '../../../controllers/files.controller';


const fileV1Routes = Router();

fileV1Routes.post(
  '/upload',
  multiUpload,
  checkStorageMiddleware,
  uploadFileViaApi,
);

export default fileV1Routes;