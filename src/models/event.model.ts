import mongoose, { Document, Model, Schema } from "mongoose";

interface IEvent extends Document {
    name: string;
    description: string;
    category: string;
    start_Date: Date;
    finish_Date: Date;
    status: string;
    tags?: string;
    originalPrice?: number;
    discountPrice: number;
    stock: number;
    images: Array<{
        public_id: string;
        url: string;
    }>;
    shopId: string;
    shop: object;
    sold_out: number;
}

const eventSchema: Schema<IEvent> = new Schema<IEvent>({
    name: {
        type: String,
        required: [true, "Please enter your event product name!"],
    },
    description: {
        type: String,
        required: [true, "Please enter your event product description!"],
    },
    category: {
        type: String,
        required: [true, "Please enter your event product category!"],
    },
    start_Date: {
        type: Date,
        required: true,
    },
    finish_Date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default: "Running",
    },
    tags: {
        type: String,
    },
    originalPrice: {
        type: Number,
    },
    discountPrice: {
        type: Number,
        required: [true, "Please enter your event product price!"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter your event product stock!"],
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    shopId: {
        type: String,
        required: true,
    },
    shop: {
        type: Object,
        required: true,
    },
    sold_out: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Event: Model<IEvent> = mongoose.model("Event", eventSchema);

export default Event;
