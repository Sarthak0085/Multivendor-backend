import mongoose, { Model, Document } from "mongoose";

interface IColor extends Document {
    title: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const colorSchema = new mongoose.Schema<IColor>({
    title: {
        type: String,
        required: [true, "Color is required"],
    }
}, {
    timestamps: true,
})

const Color: Model<IColor> = mongoose.model("Color", colorSchema);

export default Color;