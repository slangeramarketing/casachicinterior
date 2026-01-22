import crypto from "crypto";

export class ReviewMapper {
  static toUI(review: any) {
    // Email se MD5 hash banana Gravatar ke liye
    const emailHash = crypto
      .createHash("md5")
      .update(review.clientEmail.toLowerCase())
      .digest("hex");

    return {
      id: review._id.toString(),
      name: review.clientName,
      email: review.clientEmail,
      location: review.clientLocation || "Valued Client",
      // Agar clientAvatar nahi hai to Gravatar use karega
      avatar: review.clientAvatar || `https://www.gravatar.com/avatar/${emailHash}?d=mp`,
      rating: review.rating,
      message: review.message,
      status: review.status,
      isFeatured: review.isFeatured,
      serviceName: review.serviceId?.name || "Interior Service", // Populated field
      serviceId: review.serviceId?._id || review.serviceId,
      adminResponse: review.adminResponse || "",
      date: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "",
    };
  }

  static toUIList(reviews: any[]) {
    return reviews.map((review) => this.toUI(review));
  }
}