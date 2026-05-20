import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const mediaRef = new Schema(
  { url: { type: String }, mediaId: { type: Schema.Types.ObjectId } },
  { _id: false },
);

const educationSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    school: { type: String, required: true },
    degree: { type: String, required: true },
    grade: { type: String, default: "" },
    period: { type: String, default: "" },
    location: { type: String, default: "" },
    logoImage: { type: mediaRef, default: {} },
  },
  { timestamps: true },
);

export type EducationDoc = InferSchemaType<typeof educationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Education: Model<EducationDoc> =
  (mongoose.models.Education as Model<EducationDoc>) ??
  mongoose.model<EducationDoc>("Education", educationSchema);
