import { CreateReviewTokenDTO, SubmitReviewDTO, UpdateReviewStatusDTO } from "@/modules/review/review.dto";
import { ReviewActions } from "@/modules/review/review.server";



/**
 * Ye layer sirf UI se data leti hai aur Server Actions ko trigger karti hai.
 * Response ko handle karne ka kaam (Alert dikhana) UI component ka hoga.
 */
export const ReviewUIApp = {
  
  /**
   * Admin: Link generate karne ke liye trigger
   */
  async generateToken(dto: CreateReviewTokenDTO) {
    // Basic validation
    if (!dto.clientEmail || !dto.serviceId) {
      throw new Error("Missing required fields: Email or Service ID");
    }
    return await ReviewActions.generateLink(dto);
  },

  /**
   * Client: Review submit karne ke liye trigger
   */
  async submitReview(dto: SubmitReviewDTO) {
    if (!dto.token || dto.rating < 1) {
      throw new Error("Invalid submission data");
    }
    return await ReviewActions.submitReview(dto);
  },

  /**
   * Admin: Moderate karne ke liye trigger
   */
  async updateStatus(id: string, dto: UpdateReviewStatusDTO) {
    if (!id) throw new Error("Review ID is required");
    return await ReviewActions.updateStatus(id, dto);
  },

  /**
   * Admin: Review delete logic
   */
  async deleteReview(id: string) {
    // Agar hum status 'rejected' ko hi delete maan rahe hain:
    return await ReviewActions.updateStatus(id, { status: "rejected" });
  }
};

