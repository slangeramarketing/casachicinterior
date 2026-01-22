import { ReviewModel } from "./review.model";
import { IReview } from "./review.types";
import { CreateReviewTokenDTO, UpdateReviewStatusDTO } from "./review.dto";

export const ReviewRepository = {
  // 1. Initial link/token create karne ke liye (Admin side)
  createTokenRecord: async (data: CreateReviewTokenDTO, token: string) => {
    return await ReviewModel.create({
      clientEmail: data.clientEmail,
      clientName: data.clientName,
      serviceId: data.serviceId,
      reviewToken: token,
      status: "pending",
    });
  },

  // 2. Token se review dhundne ke liye (Validation logic)
  findByToken: async (token: string) => {
    return await ReviewModel.findOne({ reviewToken: token });
  },

  // 3. Client ka review update karne ke liye (Submission)
  updateReviewByToken: async (token: string, updateData: any) => {
    return await ReviewModel.findOneAndUpdate(
      { reviewToken: token },
      { 
        ...updateData, 
        reviewToken: null // Token ek hi baar use ho sake isliye null kar dete hain
      },
      { new: true }
    );
  },

  // 4. Admin ke liye saare reviews fetch karna (Listing)
  getAllReviews: async (filter: any = {}) => {
    return await ReviewModel.find(filter)
      .populate("serviceId", "name")
      .sort({ createdAt: -1 });
  },

  // 5. Admin status update (Approve/Reject/Featured)
  updateStatus: async (id: string, updateData: UpdateReviewStatusDTO) => {
    return await ReviewModel.findByIdAndUpdate(id, updateData, { new: true });
  }
};