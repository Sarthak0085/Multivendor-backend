import mongoose, { Model, Document } from "mongoose";

interface IBrand extends Document {
    image: {
        public_id: string;
        url: string;
    }
    title: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema<IBrand>({
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
        required: true,
        unique: true,
        index: true,
    },
},
    {
        timestamps: true,
    }
);

const Brand: Model<IBrand> = mongoose.model("Brand", brandSchema);
export default Brand;