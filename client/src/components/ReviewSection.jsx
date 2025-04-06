import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const ReviewSection = ({ propertyId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const token = Cookies.get("access_token");
  const decoded = token ? jwt_decode(token) : null;
  const userId = decoded ? decoded.id : null;

  useEffect(() => {
    fetch(`/api/reviews/${propertyId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched reviews:", data);
        setReviews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setLoading(false);
      });
  }, [propertyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    if (!rating || !comment) {
      return setErrorMessage("Please provide a rating and comment.");
    }

    const reviewData = { propertyId, rating, comment };
    try {
      const res = await fetch("/api/reviews/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      const result = await res.json();
      if (!res.ok) {
        // Display backend error message if available
        throw new Error(result.error || "Failed to submit review.");
      }

      // ✅ Refetch updated reviews from backend
      const reviewsResponse = await fetch(`/api/reviews/${propertyId}`);
      const updatedReviews = await reviewsResponse.json();
      setReviews(Array.isArray(updatedReviews) ? updatedReviews : []);

      // ✅ Show success alert
      alert("Review added successfully!");

      // Clear inputs
      setRating(0);
      setComment("");
    } catch (error) {
      //console.error("Error submitting review:", error);
      setErrorMessage(error.message || "An error occurred while submitting your review.");
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
      {errorMessage && <p className="text-red-500 bg-red-100 p-2 mb-3 rounded">{errorMessage}</p>}
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-4 border-l-4 border-blue-500 rounded">
              <p className="font-semibold text-lg">{review?.user?.username || "Anonymous"}</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < review.rating ? "#f59e0b" : "#e5e7eb"} />
                ))}
              </div>
              <p className="text-gray-600 mt-1">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {userId && (
        <form onSubmit={handleSubmit} className="mt-6 bg-white p-5 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-3">Add Your Review</h4>
          <div className="flex items-center space-x-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className="cursor-pointer"
                color={i < rating ? "#f59e0b" : "#e5e7eb"}
                size={24}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
          <textarea
            className="w-full p-3 border rounded mb-3"
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500 transition"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewSection;
