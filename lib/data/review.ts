export type Review = {
  id: string;
  clientName: string;
  clientEmail: string;
  location: string;
  rating: number;
  message: string;
  projectCategory: string;
  reviewedAt: string;
  status: "approved" | "pending" | "rejected";
  isFeatured: boolean;
};
