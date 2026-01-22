// 1. Admin jab review link generate karega
export interface CreateReviewTokenDTO {
  clientEmail: string;
  clientName: string;
  serviceId: string; // Jis service ke liye link bhej rahe ho
}

// 2. Client jab form fill karke submit karega
export interface SubmitReviewDTO {
  token: string;
  rating: number;
  message: string;
  clientLocation?: string;
}

// 3. Admin jab review approve/reject ya feature karega
export interface UpdateReviewStatusDTO {
  status?: "approved" | "rejected";
  isFeatured?: boolean;
  adminResponse?: string;
}