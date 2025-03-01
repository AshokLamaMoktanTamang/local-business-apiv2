import bcrypt from "bcrypt";
import mongoose, { Schema, Document, CallbackError } from "mongoose";
import { USER_ROLE } from "../constants";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: USER_ROLE;
  isVerified: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: USER_ROLE, default: USER_ROLE.USER },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;

        return ret;
      },
    },
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
