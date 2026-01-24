interface ReviewInviteEmailProps {
  clientName: string;
  reviewLink: string;
}

export function renderReviewInviteEmail({
  clientName,
  reviewLink,
}: ReviewInviteEmailProps) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6">
      <h2>Hello ${clientName},</h2>
      <p>
        Thank you for choosing our interior design services.
        We’d really appreciate your feedback.
      </p>
      <p>
        <a
          href="${reviewLink}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #f97316;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          "
        >
          Submit Your Review
        </a>
      </p>
      <p style="font-size: 12px; color: #666">
        This link is private and should not be shared.
      </p>
    </div>
  `;
}
