import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const contributionItemSchema = new Schema(
  {
    refId: { type: String, default: "" },
    title: { type: String, required: true },
    severity: { type: String, enum: ["critical", "high", "medium", "low"], default: "medium" },
    description: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  { _id: false },
);

const openSourceContributionSchema = new Schema(
  {
    project: { type: String, required: true },
    organization: { type: String, default: "" },
    description: { type: String, default: "" },
    repoUrl: { type: String, default: "" },
    orderIndex: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    contributions: { type: [contributionItemSchema], default: [] },
  },
  { timestamps: true },
);

openSourceContributionSchema.index({ orderIndex: 1, createdAt: 1 });

export type OpenSourceContributionDoc = InferSchemaType<typeof openSourceContributionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const OpenSourceContribution: Model<OpenSourceContributionDoc> =
  (mongoose.models.OpenSourceContribution as Model<OpenSourceContributionDoc>) ??
  mongoose.model<OpenSourceContributionDoc>(
    "OpenSourceContribution",
    openSourceContributionSchema,
  );
