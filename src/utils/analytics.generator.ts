import { Document, Model } from "mongoose";

interface MonthData {
    month: string;
    count: number;
}

export async function generateLast12MonthsData<T extends Document>(
    model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
    const last12Months: MonthData[] = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    for (let i = 11; i >= 0; i--) {
        const endOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i + 1,
            0
        );

        const startOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            1
        );

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

        last12Months.push({ month: monthYear, count });
    }

    return { last12Months };
}
