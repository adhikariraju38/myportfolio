import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const mediaRef = new Schema(
  { url: { type: String }, mediaId: { type: Schema.Types.ObjectId } },
  { _id: false },
);

const projectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    tech: [{ type: String }],
    metric: { type: String, default: "" },
    link: { type: String, default: "" },
    github: { type: String, default: "" },
    coverImage: { type: mediaRef, default: {} },
    orderIndex: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

projectSchema.index({ orderIndex: 1, createdAt: 1 });

export type ProjectDoc = InferSchemaType<typeof projectSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Project: Model<ProjectDoc> =
  (mongoose.models.Project as Model<ProjectDoc>) ??
  mongoose.model<ProjectDoc>("Project", projectSchema);
