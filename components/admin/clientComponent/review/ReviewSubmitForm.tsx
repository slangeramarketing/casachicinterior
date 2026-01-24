"use client";

/***************************************************
 * File: ReviewSubmitForm.tsx
 * Layer: Client Component
 ***************************************************/

import { useState } from "react";
import Alert, { AlertType } from "@/components/common/Alert";
import { TextAreaField } from "@/components/common/FormField";
import { submitReview } from "@/app/actions/review.action";
import { FiStar } from "react-icons/fi";

interface Props {
  token: string;
  clientName: string;
}

export default function ReviewSubmitForm({ token, clientName }: Props) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !message.trim()) {
      setAlert({
        type: "error",
        title: "Incomplete review",
        message: "Please provide rating and feedback.",
      });
      return;
    }

    try {
      setLoading(true);

      await submitReview({
        token,
        rating,
        message,
      });

      setSubmitted(true);
      setAlert({
        type: "success",
        title: "Thank you!",
        message: "Your review has been submitted successfully.",
      });
    } catch (err: any) {
      setAlert({
        type: "error",
        title: "Submission failed",
        message: err.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold text-green-600">
          Thank you, {clientName}!
        </h2>
        <p className="mt-2 text-gray-500">
          We appreciate your feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-16 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Hi {clientName}, please share your experience
      </h1>

      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Rating */}
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i)}
          >
            <FiStar
              size={28}
              className={
                i <= rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          </button>
        ))}
      </div>

      {/* Message */}
      <TextAreaField
        label="Your Feedback"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your experience..."
        maxLength={500}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-bg-primary text-white py-3 rounded-md font-semibold disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
