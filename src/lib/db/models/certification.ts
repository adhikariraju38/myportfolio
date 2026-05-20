import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const certificationSchema = new Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, default: "" },
    link: { type: String, default: "" },
    orderIndex: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

certificationSchema.index({ orderIndex: 1, createdAt: 1 });

export type CertificationDoc = InferSchemaType<typeof certificationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Certification: Model<CertificationDoc> =
  (mongoose.models.Certification as Model<CertificationDoc>) ??
  mongoose.model<CertificationDoc>("Certification", certificationSchema);
