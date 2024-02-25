import mongoose, { Document, Model, Schema } from "mongoose";

interface FaqItem extends Document {
    question: string;
    answer: string;
}

interface BannerImage extends Document {
    public_id: string;
    url: string;
}

interface Layout extends Document {
    type: string;
    faq: FaqItem[];
    banner: {
        image: BannerImage;
        title: string;
        subTitle: string;
    };
}

const faqSchema = new Schema<FaqItem>({
    question: {
        type: String,
    },
    answer: {
        type: String,
    },
});

const bannerImageSchema = new Schema<BannerImage>({
    public_id: {
        type: String,
    },
    url: {
        type: String,
    },
});

const layoutSchema = new Schema<Layout>({
    type: {
        type: String,
    },
    faq: [faqSchema],
    banner: {
        image: bannerImageSchema,
        title: {
            type: String,
        },
        subTitle: {
            type: String,
        }
    }
});

const LayoutModel: Model<Layout> = mongoose.model("Layout", layoutSchema);

export default LayoutModel;
