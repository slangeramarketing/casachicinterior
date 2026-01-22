import crypto from "crypto";
import { ReviewRepository } from "./review.repository";
import { CreateReviewTokenDTO, SubmitReviewDTO, UpdateReviewStatusDTO } from "./review.dto";

/**
 * LOGIC: Naya review link generate karna (Admin side)
 */
export const generateReviewLink = async (dto: CreateReviewTokenDTO) => {
  // 1. Secure random token generate karna
  const token = crypto.randomBytes(20).toString("hex");
  
  // 2. Database mein entry save karna (via Repository)
  await ReviewRepository.createTokenRecord(dto, token);
  
  // 3. Link return karna
  const reviewLink = `${process.env.NEXT_PUBLIC_BASE_URL}/give-review/${token}`;
  
  return { token, reviewLink };
};

/**
 * LOGIC: Token check karna ki valid hai ya nahi
 */
export const validateReviewToken = async (token: string) => {
  const review = await ReviewRepository.findByToken(token);
  if (!review) {
    throw new Error("Invalid or expired review link.");
  }
  return review;
};

/**
 * LOGIC: Client dwara review submit karna
 */
export const submitClientReview = async (dto: SubmitReviewDTO) => {
  // Token validation
  await validateReviewToken(dto.token);

  const updateData = {
    rating: dto.rating,
    message: dto.message,
    clientLocation: dto.clientLocation || "",
  };

  return await ReviewRepository.updateReviewByToken(dto.token, updateData);
};

/**
 * LOGIC: Admin dwara reviews manage karna
 */
export const getAdminReviews = async (status?: string) => {
  const filter = status ? { status } : {};
  return await ReviewRepository.getAllReviews(filter);
};

/**
 * LOGIC: Status moderate karna (Approve/Reject/Featured)
 */
export const moderateReview = async (id: string, dto: UpdateReviewStatusDTO) => {
  return await ReviewRepository.updateStatus(id, dto);
};