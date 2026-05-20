import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const SECTION_KEYS = [
  "hero",
  "about",
  "experience",
  "skills",
  "projects",
  "publications",
  "open-source",
  "awards",
  "education",
  "contact",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

const homeSectionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, enum: SECTION_KEYS },
    label: { type: String, required: true },
    isVisible: { type: Boolean, default: true },
    orderIndex: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type HomeSectionDoc = InferSchemaType<typeof homeSectionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const HomeSection: Model<HomeSectionDoc> =
  (mongoose.models.HomeSection as Model<HomeSectionDoc>) ??
  mongoose.model<HomeSectionDoc>("HomeSection", homeSectionSchema);
