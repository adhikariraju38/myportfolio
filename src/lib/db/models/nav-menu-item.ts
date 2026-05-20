import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const navMenuItemSchema = new Schema(
  {
    parentId: { type: Schema.Types.ObjectId, ref: "NavMenuItem", default: null },
    label: { type: String, required: true },
    href: { type: String, required: true },
    icon: { type: String, default: "" },
    location: { type: String, enum: ["header", "footer"], required: true, default: "header" },
    orderIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    opensInNewTab: { type: Boolean, default: false },
  },
  { timestamps: true },
);

navMenuItemSchema.index({ location: 1, orderIndex: 1 });

export type NavMenuItemDoc = InferSchemaType<typeof navMenuItemSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const NavMenuItem: Model<NavMenuItemDoc> =
  (mongoose.models.NavMenuItem as Model<NavMenuItemDoc>) ??
  mongoose.model<NavMenuItemDoc>("NavMenuItem", navMenuItemSchema);
