  /***************************************************
   * File: modules/users/user.model.ts
   * Layer: Model
   *
   * Purpose:
   * - Defines MongoDB schema for users
   *
   * Restrictions:
   * - No business logic
   ***************************************************/

  import mongoose, { Schema, Document, Model, Types } from "mongoose";
  import bcrypt from "bcrypt";

  export type UserStatus = "active" | "inactive" | "blocked";
  export type UserRole = "super_admin" | "admin";

  export interface UserDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    profile?: string;
    role: UserRole;
    status: UserStatus;

    createdAt: Date;
    updatedAt: Date;

    matchPassword(enteredPassword: string): Promise<boolean>;
  }

  const UserSchema = new Schema<UserDocument>(
    {
      name: { type: String, required: true, trim: true },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
        select: false,
      },

      profile: { type: String, default: "" },

      role: {
        type: String,
        enum: ["super_admin", "admin"],
        required: true,
      },

      status: {
        type: String,
        enum: ["active", "inactive", "blocked"],
        default: "active",
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

  /* =========================
    HOOKS
  ========================= */
  UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

  /* Methods */
  UserSchema.methods.matchPassword = function (
    enteredPassword: string
  ) {
    return bcrypt.compare(enteredPassword, this.password);
  };

  const UserModel: Model<UserDocument> =
    mongoose.models.User ||
    mongoose.model<UserDocument>("User", UserSchema);

  export default UserModel;
