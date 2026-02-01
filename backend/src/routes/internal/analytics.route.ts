import { Router } from "express";
import { getUserAnalyticsWithChartController } from "../../controllers/analytics.controller";

const analyticsRoute = Router();

analyticsRoute.get('/user',getUserAnalyticsWithChartController );
export default analyticsRoute;
