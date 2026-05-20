import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    userAgent: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true },
);

export type SessionDoc = InferSchemaType<typeof sessionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Session: Model<SessionDoc> =
  (mongoose.models.Session as Model<SessionDoc>) ??
  mongoose.model<SessionDoc>("Session", sessionSchema);
