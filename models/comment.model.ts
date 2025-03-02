import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
  userId: Types.ObjectId;
  businessOwner: Types.ObjectId;
  businessId: Types.ObjectId;
  content: string;
}

const CommentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    businessOwner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
