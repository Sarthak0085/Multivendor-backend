import mongoose, { Model, Document } from "mongoose";

interface ICategory extends Document {
    image: {
        public_id: string;
        url: string;
    };
    title: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const categorySchema = new mongoose.Schema<ICategory>({
    image: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    title: {
        type: String,
        required: [true, "Category Title is required"],
    }
}, {
    timestamps: true,
})

const Category: Model<ICategory> = mongoose.model("Category", categorySchema);

export default Category;