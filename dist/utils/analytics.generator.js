"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLast24HoursData = exports.generateLast30DaysData = exports.generateLast12MonthsData = void 0;
async function generateLast12MonthsData(model) {
    const analyticsData = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    for (let i = 11; i >= 0; i--) {
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthYear = endOfMonth.toLocaleString("default", {
            month: "short",
            year: "numeric",
        });
        const count = await model.countDocuments({
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth,
            },
        });
        analyticsData.push({ name: monthYear, count });
    }
    return { analyticsData };
}
exports.generateLast12MonthsData = generateLast12MonthsData;
async function generateLast30DaysData(model) {
    const analyticsData = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    for (let i = 29; i >= 0; i = i - 2) {
        const previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getDate() - i);
        const dayDate = previousDate.toLocaleDateString("default", {
            month: "short",
            day: "numeric",
        });
        const count = await model.countDocuments({
            createdAt: {
                $gte: new Date(previousDate.setHours(0, 0, 0, 0)),
                $lte: new Date(previousDate.setHours(23, 59, 59, 999)),
            },
        });
        analyticsData.push({ name: dayDate, count });
    }
    return { analyticsData };
}
exports.generateLast30DaysData = generateLast30DaysData;
async function generateLast24HoursData(model) {
    const analyticsData = [];
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);
    for (let i = 23; i >= 0; i = i - 2) {
        const previousHour = new Date(currentDate);
        previousHour.setHours(currentDate.getHours() - i);
        const hourString = previousHour.toLocaleString("default", {
            hour: "numeric",
            hour12: true,
        });
        const count = await model.countDocuments({
            createdAt: {
                $gte: new Date(previousHour.setMinutes(0, 0, 0)),
                $lte: new Date(previousHour.setMinutes(59, 59, 999)),
            },
        });
        analyticsData.push({ name: hourString, count });
    }
    return { analyticsData };
}
exports.generateLast24HoursData = generateLast24HoursData;
// import { Document, Model } from "mongoose";
// interface AnalyticsData {
//     label: string;
//     count: number;
// }
// export async function generateAnalyticsData<T extends Document>(
//     model: Model<T>,
//     timeFrame: "last12Months" | "last30Days" | "last24Hours"
// ): Promise<{ analyticsData: AnalyticsData[] }> {
//     const analyticsData: AnalyticsData[] = [];
//     const currentDate = new Date();
//     currentDate.setDate(currentDate.getDate() + 1); // Add 1 to include the current time frame
//     let startDate: Date;
//     let endDate: Date;
//     let timeLabelFormat: Intl.DateTimeFormatOptions;
//     switch (timeFrame) {
//         case "last12Months":
//             startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1);
//             endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
//             timeLabelFormat = { month: "short", year: "numeric" };
//             break;
//         case "last30Days":
//             startDate = new Date(currentDate);
//             startDate.setDate(startDate.getDate() - 29); // Subtract 29 to include the last 30 days
//             endDate = new Date(currentDate);
//             timeLabelFormat = { month: "short", day: "numeric" };
//             break;
//         case "last24Hours":
//             startDate = new Date(currentDate);
//             startDate.setHours(startDate.getHours() - 23); // Subtract 23 to include the last 24 hours
//             endDate = new Date(currentDate);
//             timeLabelFormat = { hour: "numeric", hour12: true };
//             break;
//         default:
//             throw new Error("Invalid time frame specified");
//     }
//     for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
//         const label = currentDate.toLocaleDateString("default", timeLabelFormat);
//         const count = await model.countDocuments({
//             createdAt: {
//                 $gte: timeFrame === "last24Hours" ? currentDate : new Date(currentDate.setHours(0, 0, 0, 0)),
//                 $lte: timeFrame === "last24Hours" ? new Date(currentDate.setHours(currentDate.getHours() + 1)) : new Date(currentDate.setHours(23, 59, 59, 999)),
//             },
//         });
//         analyticsData.push({ label, count });
//     }
//     return { analyticsData };
// }
