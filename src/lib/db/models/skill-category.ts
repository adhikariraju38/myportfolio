import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const skillCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    orderIndex: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type SkillCategoryDoc = InferSchemaType<typeof skillCategorySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SkillCategory: Model<SkillCategoryDoc> =
  (mongoose.models.SkillCategory as Model<SkillCategoryDoc>) ??
  mongoose.model<SkillCategoryDoc>("SkillCategory", skillCategorySchema);
