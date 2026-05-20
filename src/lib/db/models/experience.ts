import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const experienceSchema = new Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String, default: "" },
    period: { type: String, default: "" },
    type: {
      type: String,
      enum: ["full-time", "remote", "freelance", "contract", "internship"],
      default: "full-time",
    },
    bullets: [{ type: String }],
    tech: [{ type: String }],
    orderIndex: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

experienceSchema.index({ orderIndex: 1, createdAt: 1 });

export type ExperienceDoc = InferSchemaType<typeof experienceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Experience: Model<ExperienceDoc> =
  (mongoose.models.Experience as Model<ExperienceDoc>) ??
  mongoose.model<ExperienceDoc>("Experience", experienceSchema);
