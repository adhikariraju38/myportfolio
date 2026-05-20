import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const awardSchema = new Schema(
  {
    title: { type: String, required: true },
    event: { type: String, default: "" },
    rank: {
      type: String,
      enum: ["winner", "runner-up", "2nd-runner-up", "top-5", "finalist", "honorable-mention"],
      default: "finalist",
    },
    orderIndex: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

awardSchema.index({ orderIndex: 1, createdAt: 1 });

export type AwardDoc = InferSchemaType<typeof awardSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Award: Model<AwardDoc> =
  (mongoose.models.Award as Model<AwardDoc>) ?? mongoose.model<AwardDoc>("Award", awardSchema);
