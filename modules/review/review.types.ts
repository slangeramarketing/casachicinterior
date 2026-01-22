import { Types } from "mongoose";

export interface IReview {
  _id?: string | Types.ObjectId;
  clientName: string;
  clientEmail: string;
  clientAvatar?: string;
  clientLocation?: string;
  serviceId: Types.ObjectId | any; // Populated service object or ID
  projectId?: Types.ObjectId | any;
  rating: number;
  message: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  adminResponse?: string;
  reviewToken?: string;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}