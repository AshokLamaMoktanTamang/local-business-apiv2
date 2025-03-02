import mongoose, { Schema, Document, Types } from "mongoose";

export interface IChat extends Document {
  senderId: Types.ObjectId;
  recieverId: Types.ObjectId;
  businessId: Types.ObjectId;
  message: string;
}

const ChatSchema = new Schema<IChat>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recieverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
