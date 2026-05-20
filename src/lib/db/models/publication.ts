import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const publicationSchema = new Schema(
  {
    title: { type: String, required: true },
    authors: { type: String, required: true },
    venue: { type: String, required: true },
    year: { type: String, required: true },
    doi: { type: String, default: "" },
    description: { type: String, default: "" },
    orderIndex: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

publicationSchema.index({ year: -1, orderIndex: 1 });

export type PublicationDoc = InferSchemaType<typeof publicationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Publication: Model<PublicationDoc> =
  (mongoose.models.Publication as Model<PublicationDoc>) ??
  mongoose.model<PublicationDoc>("Publication", publicationSchema);
