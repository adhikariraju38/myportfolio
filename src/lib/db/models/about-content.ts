import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const mediaRef = new Schema(
  { url: { type: String }, mediaId: { type: Schema.Types.ObjectId } },
  { _id: false },
);

const statSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    suffix: { type: String, default: "" },
    orderIndex: { type: Number, default: 0 },
  },
  { _id: false },
);

const aboutContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    heading: { type: String, default: "About Me" },
    summary: { type: String, required: true },
    profileImage: { type: mediaRef, default: {} },
    profileAlt: { type: String, default: "" },
    stats: { type: [statSchema], default: [] },
  },
  { timestamps: true },
);

export type AboutContentDoc = InferSchemaType<typeof aboutContentSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AboutContent: Model<AboutContentDoc> =
  (mongoose.models.AboutContent as Model<AboutContentDoc>) ??
  mongoose.model<AboutContentDoc>("AboutContent", aboutContentSchema);
