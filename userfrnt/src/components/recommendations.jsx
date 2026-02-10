import { useEffect } from "react";
import axios from "axios";
import AppNavbar from "./navbar";
import { useDispatch, useSelector } from "react-redux";
import { setRProducts, setRLoading } from "../store/recommendation";
import { addToCart } from "../store/cartoperations";
import { useNavigate } from "react-router-dom";

/* ⭐ Inline Stars */
function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span style={{ color: "#f5c518", fontSize: "14px" }}>
      {"★".repeat(full)}
      {half && "☆"}
      {"☆".repeat(empty)}
    </span>
  );
}

export default function Recommendations() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const recommendations = useSelector(
    (state) => state.recommendations.items
  );

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        dispatch(setRLoading(true));

        const res = await axios.get(
          "http://127.0.0.1:8000/api/products/recommendations/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );

        dispatch(setRProducts(res.data));
      } catch (err) {
        console.error("Recommendation error:", err);
      } finally {
        dispatch(setRLoading(false));
      }
    };

    fetchRecommendations();
  }, [dispatch]);

  return (
    <>
      <AppNavbar />

      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl font-semibold mb-5">
          Recommended Products for you
        </h2>

        {recommendations.length === 0 ? (
          <p className="text-gray-500">No recommendations yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  navigate(`/product/${item.id}`, {
                    state: { product: item }
                  })
                }
                className="cursor-pointer border rounded-xl bg-white hover:shadow-lg transition"
              >
                {/* IMAGE */}
                <div className="h-56 bg-gray-100 rounded-t-xl flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-auto object-contain px-3"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-3">
                  <h3 className="text-base font-medium truncate">
                    {item.name}
                  </h3>

                  {/* ⭐ Rating + Count */}
                  <div className="mt-1">
                    <Stars rating={item.average_rating || 0} />
                    <span className="text-xs text-gray-600">
                      {" "}({item.total_reviews || 0})
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    Price: ₹ {item.price}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent navigation
                      dispatch(addToCart(item));
                    }}
                    className="mt-3 w-full bg-black text-white text-sm py-2 rounded hover:bg-gray-800 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
