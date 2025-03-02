import { INTERACTION_TYPE } from "@/constants";
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IInteraction extends Document {
  type: INTERACTION_TYPE;
  userId: Types.ObjectId;
  businessOwner: Types.ObjectId;
  businessId: Types.ObjectId;
}

const InteractionSchema = new Schema<IInteraction>(
  {
    type: { type: String, enum: INTERACTION_TYPE, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    businessOwner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
  },
  { timestamps: true }
);

export const Interaction = mongoose.model<IInteraction>(
  "Interaction",
  InteractionSchema
);
