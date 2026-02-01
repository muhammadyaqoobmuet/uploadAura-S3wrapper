import { PipelineStage, Types } from "mongoose";
import { User } from "../models/user.model";
import FileModel from "../models/file.model";
import { formatBytes } from "../utils/format-byte";
import StorageModel from "../models/storage.model";

export const getUserAnalyticsWithChart = async (
  userId: string,
  filter: { dataFrom?: Date; dataTo?: Date },
) => {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        // Must cast to ObjectId — Mongoose does not auto-cast in aggregate pipelines
        userId: new Types.ObjectId(userId),
        ...(filter.dataFrom && { createdAt: { $gte: filter.dataFrom } }),
        ...(filter.dataTo && { createdAt: { $lte: filter.dataTo } }),
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        uploadedFiles: { $sum: 1 },
        usages: {
          $sum: {
            // "$size" (with $) is the field reference; without $ it's a literal string
            $ifNull: ["$size", 0],
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        uploadedFiles: 1,
        usages: 1,
      },
    },
    {
      $facet: {
        chartData: [
          {
            $project: {
              date: 1,
              uploadedFiles: 1,
              usages: 1,
            },
          },
        ],
        totals: [
          {
            $group: {
              _id: null,
              totalUploadedFilesForPeriod: { $sum: "$uploadedFiles" },
              totalUsagesForPeriod: { $sum: "$usages" },
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        chartData: 1,
        totalUploadedFilesForPeriod: {
          $ifNull: [
            {
              $arrayElemAt: ["$totals.totalUploadedFilesForPeriod", 0],
            },
            0,
          ],
        },
        totalUsagesForPeriod: {
          $ifNull: [
            {
              $arrayElemAt: ["$totals.totalUsagesForPeriod", 0],
            },
            0,
          ],
        },
      },
    },
  ];

  const result = await FileModel.aggregate(pipeline);
  const [
    {
      chartData = [],
      totalUploadedFilesForPeriod = 0,
      totalUsagesForPeriod = 0,
    },
  ] = result;
  const formattedChartData = chartData?.map(
    (item: { date: string; uploadedFiles: number; usages: number }) => ({
      ...item,
      useages: item.usages,
      formattedUsages: formatBytes(item.usages),
    }),
  );

  const storageMetrics = await StorageModel.getStorageMetrics(
    new Types.ObjectId(userId),
  );

  return {
    chart: formattedChartData,
    totalUploadedFilesForPeriod,
    totalUsagesForPeriod: formatBytes(totalUsagesForPeriod),
    storageUsageSummary: {
      totalUsage: storageMetrics.usage,
      quota: storageMetrics.quota,
      remaining: storageMetrics.remaining,
      formattedTotalUsage: formatBytes(storageMetrics.usage),
      formattedQuota: formatBytes(storageMetrics.quota),
      formattedRemaining: formatBytes(storageMetrics.remaining),
    },
  };
};
