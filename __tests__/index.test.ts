// index.test.js

import app from "../src/app.js";
import { config } from "dotenv"; // Mock dotenv
import { connectToDatabase } from "../src/db/dbConnection.js"; // Mock dbConnection.js
import { v2 as cloudinary } from "cloudinary"; // Mock cloudinary
// import index from '../src/index.js'; // Your index file

jest.mock("./app.test.js");
jest.mock("dotenv");
jest.mock(".db/dbConnection.test.js");
jest.mock("cloudinary");

describe("Server Initialization", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should start the server on the specified port", () => {
        const mockPort = "5000";
        process.env.PORT = mockPort;

        // index();

        expect(app.listen).toHaveBeenCalledWith(mockPort, expect.any(Function));
    });

    it("should connect to the database", () => {
        // index();

        expect(connectToDatabase).toHaveBeenCalled();
    });

    it("should configure cloudinary", () => {
        const mockCloudName = "mock_cloud_name";
        const mockApiKey = "mock_api_key";
        const mockApiSecret = "mock_api_secret";

        process.env.CLOUD_NAME = mockCloudName;
        process.env.CLOUD_API_KEY = mockApiKey;
        process.env.CLOUD_SECRET_KEY = mockApiSecret;

        // index();

        expect(cloudinary.config).toHaveBeenCalledWith({
            cloud_name: mockCloudName,
            api_key: mockApiKey,
            api_secret: mockApiSecret,
        });
    });
});
