import mongoose, { Model, Document } from "mongoose";

interface IColor extends Document {
    title: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Declare the Schema of the Mongo model
var colorSchema = new mongoose.Schema<IColor>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

const Color: Model<IColor> = mongoose.model("Color", colorSchema);
export default Color;