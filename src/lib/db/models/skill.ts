import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const skillSchema = new Schema(
  {
    name: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "SkillCategory", required: true },
    production: { type: Boolean, default: false },
    orderIndex: { type: Number, default: 0 },
  },
  { timestamps: true },
);

skillSchema.index({ categoryId: 1, orderIndex: 1 });

export type SkillDoc = InferSchemaType<typeof skillSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Skill: Model<SkillDoc> =
  (mongoose.models.Skill as Model<SkillDoc>) ?? mongoose.model<SkillDoc>("Skill", skillSchema);
