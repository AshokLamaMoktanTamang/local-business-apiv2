// models/Business.ts
import { Schema, model, Document } from "mongoose";

interface IBusiness extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
}

const businessSchema = new Schema<IBusiness>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
});

const Business = model<IBusiness>("Business", businessSchema);

export default Business;