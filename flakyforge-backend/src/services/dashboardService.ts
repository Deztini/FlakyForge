import mongoose from "mongoose";
import { TestRun } from "../models/TestRun";
import { getWeekRanges } from "../utils/date";

export const DashboardService = {
  async getSummary(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(today);
    tomorrowStart.setDate(today.getDate() + 1);

    const { thisWeekStart, thisWeekEnd, lastWeekEnd, lastWeekStart } =
      getWeekRanges();

    const [thisWeekTests, lastWeekTests, flakyAgg, fixedAgg, confidenceAgg] =
      await Promise.all([
        TestRun.aggregate([
          {
            $match: {
              userId: userObjectId,
              createdAt: { $gte: thisWeekStart, $lt: thisWeekEnd },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalTests" },
            },
          },
        ]),

        TestRun.aggregate([
          {
            $match: {
              userId: userObjectId,
              createdAt: {
                $gte: lastWeekStart,
                $lt: lastWeekEnd,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalTests" },
            },
          },
        ]),

        TestRun.aggregate([
          { $match: { userId: userObjectId, status: "completed" } },
          {
            $group: {
              _id: null,
              total: { $sum: "$flakyCount" },
              today: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $gte: ["$createdAt", today] },
                        { $lt: ["$createdAt", tomorrowStart] },
                      ],
                    },
                    "$flakyCount",
                    0,
                  ],
                },
              },
            },
          },
        ]),

        TestRun.aggregate([
          { $match: { userId: userObjectId, status: "completed" } },
          { $unwind: "$flakyTests" },
          {
            $group: {
              _id: null,
              total: {
                $sum: {
                  $cond: [{ $eq: ["$flakyTests.status", "fixed"] }, 1, 0],
                },
              },
              today: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$flakyTests.status", "fixed"] },
                        { $gte: ["$createdAt", today] },
                        { $lt: ["$createdAt", tomorrowStart] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ]),

        TestRun.aggregate([
          { $match: { userId: userObjectId, status: "completed" } },
          { $unwind: "$flakyTests" },
          {
            $match: { "flakyTests.confidence": { $exists: true } },
          },
          {
            $group: {
              _id: null,
              avg: { $avg: "$flakyTests.confidence" },
              todayAvg: {
                $avg: {
                  $cond: [
                    { $gte: ["$createdAt", today] },
                    "$flakyTests.confidence",
                    null,
                  ],
                },
              },
            },
          },
        ]),
      ]);

    const currentWeekTotal = thisWeekTests[0]?.total || 0;
    const lastWeekTotal = lastWeekTests[0]?.total || 0;

    let totalTestsChange = 0;

    if (lastWeekTotal === 0) {
      totalTestsChange = currentWeekTotal > 0 ? 100 : 0;
    } else {
      const raw = Math.round(
        ((currentWeekTotal - lastWeekTotal) / lastWeekTotal) * 100,
      );

      totalTestsChange = Math.max(Math.min(raw, 999), -100);
    }

    return {
      totalTests: {
        value: currentWeekTotal,
        change: totalTestsChange,
      },

      flakyTests: {
        value: flakyAgg[0]?.total || 0,
        change: flakyAgg[0]?.today || 0,
      },

      testsFixed: {
        value: fixedAgg[0]?.total || 0,
        change: fixedAgg[0]?.today || 0,
      },

      avgConfidence: {
        value: Number((confidenceAgg[0]?.avg || 0).toFixed(2)),
        change: Number((confidenceAgg[0]?.todayAvg || 0).toFixed(2)),
      },
    };
  },

  async getTrend(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const { thisWeekStart, thisWeekEnd } = getWeekRanges();

    const [detectedRaw, fixedRaw] = await Promise.all([
      TestRun.aggregate([
        {
          $match: {
            userId: userObjectId,
            status: "completed",
            createdAt: { $gte: thisWeekStart, $lt: thisWeekEnd },
          },
        },

        {
          $group: {
            _id: { $daysOfWeek: "$createdAt" },
            detected: { $sum: "$flakyCount" },
          },
        },
      ]),

      TestRun.aggregate([
        {
          $match: {
            userId: userObjectId,
            status: "completed",
            createdAt: { $gte: thisWeekStart, $lt: thisWeekEnd },
          },
        },

        { $unwind: "$flakyTests" },

        {
          $match: {
            "flakyTests.status": "fixed",
          },
        },

        {
          $group: {
            _id: { $daysOfWeek: "$createdAt" },
            fixed: { $sum: 1 },
          },
        },
      ]),
    ]);

    const DAY_MAP: Record<number, string> = {
      2: "Mon",
      3: "Tue",
      4: "Wed",
      5: "Thur",
      6: "Fri",
      7: "Sat",
      1: "Sun",
    };

    const detectedMap: Record<number, number> = {};

    for (const item of detectedRaw) {
      detectedMap[item._id] = item.detected;
    }

    const fixedMap: Record<number, number> = {};
    for (const item of fixedRaw) {
      fixedMap[item._id] = item.fixed;
    }

    const trends = [2, 3, 4, 5, 6, 7, 1].map((dayNum) => ({
      day: DAY_MAP[dayNum],
      detected: detectedMap[dayNum] ?? 0,
      fixed: fixedMap[dayNum] ?? 0,
    }));

    return trends;
  },
};
