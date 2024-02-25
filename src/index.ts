import app from "./app.js";
import { config } from "dotenv";
import { connectToDatabase } from "./db/dbConnection.js";
import { v2 as cloudinary } from "cloudinary";

config();

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

const port: number = Number(process.env.PORT) || 4000;


app.listen(port, () => {
    console.log(`The server is running on the port :${port}`);
    connectToDatabase();
})