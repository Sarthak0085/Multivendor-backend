import mongoose, { connect } from "mongoose";
import colors from "colors";

async function connectToDatabase() {
    try {
        await connect(process.env.MONGO_URI as string);
        console.log(`Connected to database: ${mongoose.connection.name} successfully`);
    } catch (error: any) {
        console.log(error);
        process.exit(1);
    }
}

export { connectToDatabase };