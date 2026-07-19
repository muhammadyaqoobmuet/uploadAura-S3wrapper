import { Router } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { docsChatController } from "../../controllers/ai.controller";

const aiRouter = Router();

aiRouter.post("/chat", asyncHandler(docsChatController));

export default aiRouter;
