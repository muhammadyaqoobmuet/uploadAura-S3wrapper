import Router from "express";
import { createApiKey, deleteApiKey, getAllApiKeys } from "../../controllers/apiKey.controller";

export const apiRoute = Router();

apiRoute.post('/create', createApiKey)
apiRoute.get('/all', getAllApiKeys)
apiRoute.delete('/:id',deleteApiKey )