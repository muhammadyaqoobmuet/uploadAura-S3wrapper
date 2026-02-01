import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { HttpStatusCode } from "axios";
import { getUserAnalyticsWithChart } from "../services/analytics.service";

export const getUserAnalyticsWithChartController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ message: "from and to are required" });
    }
    // Explicitly set start-of-day for `from` and end-of-day for `to` in UTC
    // so that all uploads on the boundary dates are included.
    const dataFrom = from
      ? new Date(`${from as string}T00:00:00.000Z`)
      : undefined;
    const dataTo = to ? new Date(`${to as string}T23:59:59.999Z`) : undefined;
    const filter = { dataFrom, dataTo };
    const result = await getUserAnalyticsWithChart(userId.toString(), filter);
    res.status(HttpStatusCode.Ok).json({
      message: "user analytics retrieved successfully",
      ...result,
    });
  },
);
