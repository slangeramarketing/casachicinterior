import mongoose, {
  Schema,
  Model,
  HydratedDocument,
} from "mongoose";
import bcrypt from "bcryptjs";

/* -------------------------------------
   Role & Status Types
------------------------------------- */
export type UserRole = "super_admin" | "admin" | "user";
export type UserStatus = "active" | "inactive" | "blocked";

/* -------------------------------------
   User Interface (COMPLETE)
------------------------------------- */
export interface IUser {
  _id: mongoose.Types.ObjectId;

  name?: string;
  email: string;
  password: string;
  role: UserRole;

  status: UserStatus;
  isBlocked: boolean;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): Promise<boolean>;
}

/* -------------------------------------
   Schema
------------------------------------- */
const AuthSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["super_admin", "admin", "user"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
      index: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------------------------
   Pre-save Hook
------------------------------------- */
AuthSchema.pre(
  "save",
  async function (this: HydratedDocument<IUser>) {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
  }
);

/* -------------------------------------
   Instance Method
------------------------------------- */
AuthSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

/* -------------------------------------
   Model Export
------------------------------------- */
const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", AuthSchema);

export default User;
