import mongoose from "mongoose";
import { comparePassword, hashPassword } from "../utils/bcrypt";

export interface userInterface extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  profilePicture: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(value: string): Promise<boolean>;
  omitPassword(): Omit<userInterface, "password">; // Omit<userInterface,'password> remove password
}

const userSchema = new mongoose.Schema<userInterface>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true, // JhonDoe@gmail.com and jhondoe@gmail.com are considered same !not case sensitive
    },
    profilePicture: { type: String, default: null },
    password: {
      type: String,
      required: true,
      trim: true,
      select: true,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) { // on every userSchema this function will run before saving
  if (this.isModified("password")) { // if password is modified, hash it before saving
    if (this.password) {
      this.password = await hashPassword(this.password);
    } 
  }
});

userSchema.methods.comparePassword = async function (password: string) {
  return await comparePassword(password, this.password);
};

userSchema.methods.omitPassword = function (): Omit<userInterface, "password"> {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export const User = mongoose.model<userInterface>("User", userSchema);
