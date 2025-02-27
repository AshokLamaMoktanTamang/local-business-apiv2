import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBusiness extends Document {
  name: string;
  description: string;
  owner: Types.ObjectId;
  location: { latitude: number; longitude: number };
  isVerified: boolean;
  phone: number;
  email: string;
  address: string;
  image: string;
}

const BusinessSchema = new Schema<IBusiness>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    isVerified: { type: Boolean, default: false },
    address: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

export const Business = mongoose.model<IBusiness>("Business", BusinessSchema);
