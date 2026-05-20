import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ctaSchema = new Schema(
  { label: { type: String, default: "" }, href: { type: String, default: "" } },
  { _id: false },
);

const heroContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    eyebrowText: { type: String, default: "Hi, I'm" },
    name: { type: String, required: true },
    title: { type: String, required: true },
    tagline: { type: String, default: "" },
    primaryCta: { type: ctaSchema, default: {} },
    secondaryCta: { type: ctaSchema, default: {} },
    enable3dCanvas: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type HeroContentDoc = InferSchemaType<typeof heroContentSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const HeroContent: Model<HeroContentDoc> =
  (mongoose.models.HeroContent as Model<HeroContentDoc>) ??
  mongoose.model<HeroContentDoc>("HeroContent", heroContentSchema);
