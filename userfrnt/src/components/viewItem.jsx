import { Card, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span className="text-yellow-500">
      {"★".repeat(full)}
      {half && "⯪"}
      {"☆".repeat(empty)}
    </span>
  );
}

export default function ViewItem() {
  const { id } = useParams();               // ✅ product id from URL
  const location = useLocation();           // ✅ product from navigation
  const productFromState = location.state?.product;

  const [item, setItem] = useState(productFromState || null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- PRODUCT FETCH (fallback) ---------------- */
  useEffect(() => {
    if (!item) {
      axios
        .get(`http://127.0.0.1:8000/api/products/${id}/`)
        .then((res) => setItem(res.data))
        .catch((err) => console.error(err));
    }
    {console.log('refresh',item)}
  }, [id, item]);

  /* ---------------- REVIEWS FETCH ---------------- */
  useEffect(() => {
    fetchReviews();
    console.log("PRODUCT ID:", id);
  }, [id]);

  const fetchReviews = () => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}/reviews/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      )
      .then((res) => {
        setReviews(res.data.reviews);
        setAvgRating(res.data.avg_rating);
      })
      .catch((err) => console.error(err));
  };

  /* ---------------- SUBMIT REVIEW ---------------- */
  const submitReview = () => {
    if (!reviewText.trim()) return;

    setLoading(true);

    axios
      .post(
        `http://127.0.0.1:8000/api/products/${id}/add-review/`,
        { review_text: reviewText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      )
      .then(() => {
        setReviewText("");
        fetchReviews();
      })
      .catch((err) => {
        alert(err.response?.data?.error || "Error submitting review");
      })
      .finally(() => setLoading(false));
  };

  /* ---------------- LOADING STATE ---------------- */
  if (!item) {
    return <p className="text-center mt-10">Loading product...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 mt-6">
      {/* PRODUCT CARD */}
      <Card className="border-0 shadow-sm rounded-xl">
        <div className="h-72 bg-gray-100 flex items-center justify-center rounded-t-xl overflow-hidden">
          <Card.Img
            variant="top"
            src={item.image_url}
            className="h-full w-auto object-contain px-4"
          />
        </div>

        <Card.Body className="p-4">
          <Card.Title className="text-2xl font-semibold mb-2">
            {item.name}
          </Card.Title>

          {/* ⭐ Average Rating */}
          <div className="mb-2">
            <Stars rating={avgRating} />
            <span className="text-sm text-gray-600">
              {" "}({avgRating})
            </span>
          </div>

          <p className="text-lg font-medium">Price: ₹ {item.price}</p>
          <p className="text-lg font-medium">Brand: {item.brand}</p>

          <p className="text-gray-700 mt-3 leading-relaxed">
            <span className="font-medium">Description:</span>{" "}
            {item.description}
          </p>
        </Card.Body>
      </Card>

      {/* ✍️ ADD REVIEW */}
      <div className="mt-6">
        <h4 className="font-semibold mb-2">Write a review</h4>

        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Share your experience..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <Button
          className="mt-2"
          onClick={submitReview}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </div>

      {/* 📝 REVIEWS LIST */}
      <div className="mt-8">
        <h4 className="font-semibold mb-3">Customer Reviews</h4>

        {reviews.length === 0 && (
          <p className="text-gray-500">No reviews yet</p>
        )}

        {reviews.map((r) => (
          <div key={r.id} className="border-b py-3">
            <div className="flex items-center gap-2">
              <strong>{r.username}</strong>
              {r.is_verified_buyer && (
                <span className="text-green-600 text-xs">
                  ✔ Verified Buyer
                </span>
              )}
            </div>

            <Stars rating={r.rating} />
            <p className="text-gray-700 mt-1">{r.review_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
