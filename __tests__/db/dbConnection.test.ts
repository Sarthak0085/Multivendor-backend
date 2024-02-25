import { connectToDatabase } from "../../src/db/dbConnection";
import { connect, connection } from "mongoose";

jest.mock("mongoose", () => ({
    connect: jest.fn(),
    connection: {
        name: 'mockConnection'
    }
}));

describe("database connection setup", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should connect to database successfully", async () => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
        await connectToDatabase();
        expect(connect).toHaveBeenCalledWith(process.env.MONGO_URI);
        expect(console.log).toHaveBeenCalledWith(`Connected to database: mockConnection successfully`);
    })

    it("should handle errors while connected to database", async () => {
        const errorMessage = "Connection error";
        (connect as jest.Mock).mockImplementation(() => {
            throw new Error(errorMessage);
        });

        await connectToDatabase();

        expect(connect).toHaveBeenCalledWith(process.env.MONGO_URI);
        expect(console.log).toHaveBeenCalledWith(new Error(errorMessage));
        expect(process).toHaveBeenCalledWith(1);
    });

});