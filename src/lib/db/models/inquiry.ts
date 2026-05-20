import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const inquirySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "archived"], default: "new" },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true },
);

inquirySchema.index({ status: 1, createdAt: -1 });

export type InquiryDoc = InferSchemaType<typeof inquirySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Inquiry: Model<InquiryDoc> =
  (mongoose.models.Inquiry as Model<InquiryDoc>) ??
  mongoose.model<InquiryDoc>("Inquiry", inquirySchema);
