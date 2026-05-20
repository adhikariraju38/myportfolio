import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const communityInvolvementSchema = new Schema(
  {
    role: { type: String, required: true },
    org: { type: String, required: true },
    year: { type: String, default: "" },
    description: { type: String, default: "" },
    orderIndex: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

communityInvolvementSchema.index({ orderIndex: 1 });

export type CommunityInvolvementDoc = InferSchemaType<typeof communityInvolvementSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const CommunityInvolvement: Model<CommunityInvolvementDoc> =
  (mongoose.models.CommunityInvolvement as Model<CommunityInvolvementDoc>) ??
  mongoose.model<CommunityInvolvementDoc>("CommunityInvolvement", communityInvolvementSchema);
