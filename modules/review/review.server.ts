"use server";

import { 
  generateReviewLink, 
  getAdminReviews, 
  moderateReview, 
  submitClientReview, 
  validateReviewToken 
} from "./review.service";
import { ReviewMapper } from "./review.mapper";
import { CreateReviewTokenDTO, SubmitReviewDTO, UpdateReviewStatusDTO } from "./review.dto";
import { revalidatePath } from "next/cache";

export const ReviewActions = {
  
  /**
   * ADMIN: Naya review link generate karna
   */
  generateLink: async (dto: CreateReviewTokenDTO) => {
    try {
      // 1. Service se link generate karwaya
      const result = await generateReviewLink(dto);
      
      return {
        success: true,
        data: result, // Isme token aur link dono hain
        message: "Review link generated successfully!",
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  /**
   * PUBLIC: Token validate karna (Jab client link kholta hai)
   */
  getReviewByToken: async (token: string) => {
    try {
      const review = await validateReviewToken(token);
      // Mapper use kar rahe hain taaki client ko sensitive data na jaye
      return {
        success: true,
        data: ReviewMapper.toUI(review),
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  /**
   * PUBLIC: Review submit karna
   */
  submitReview: async (dto: SubmitReviewDTO) => {
    try {
      await submitClientReview(dto);
      
      // Cache clear kar rahe hain taaki naya review turant dikhe (agar approved ho)
      revalidatePath("/admin/reviews"); 
      
      return {
        success: true,
        message: "Thank you! Your review has been submitted for approval.",
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  /**
   * ADMIN: Saare reviews fetch karna
   */
  fetchAllReviews: async (status?: string) => {
    try {
      const reviews = await getAdminReviews(status);
      // Mapper ka use karke array ko transform kiya
      const formattedReviews = ReviewMapper.toUIList(reviews);
      
      return {
        success: true,
        data: formattedReviews,
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  /**
   * ADMIN: Review moderate karna (Approve/Reject/Featured)
   */
  updateStatus: async (id: string, dto: UpdateReviewStatusDTO) => {
    try {
      const updatedReview = await moderateReview(id, dto);
      
      revalidatePath("/admin/reviews");
      
      return {
        success: true,
        data: ReviewMapper.toUI(updatedReview),
        message: `Review marked as ${dto.status || 'updated'}`,
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
};