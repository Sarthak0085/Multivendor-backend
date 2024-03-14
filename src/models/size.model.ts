import mongoose, { Model, Document } from "mongoose";

interface ISize extends Document {
    title: string;
    symbol: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const sizeSchema = new mongoose.Schema<ISize>({
    title: {
        type: String,
        required: [true, "Size Name is required"],
    },
    symbol: {
        type: String,
        required: [true, "Size Symbol is required"],
    },
}, {
    timestamps: true,
})

const Size: Model<ISize> = mongoose.model("Size", sizeSchema);

export default Size;