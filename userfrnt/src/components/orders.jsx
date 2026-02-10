import { useSelector } from "react-redux";
import AppNavbar from "./navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOrders } from "../store/orderslice";
import API_BASE from "../config/api";
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

export default function Orders() {
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.items);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    if (orders.length > 0) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/orders/list/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        dispatch(
          setOrders(
            res.data.map((item) => ({
              ...item.product,
              quantity: item.quantity,
            }))
          )
        );
      } catch (err) {
        console.error("Orders fetch failed", err);
      }
    };

    fetchOrders();
  }, [orders.length, dispatch]);
  return (
    <>
      <AppNavbar />

      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl font-semibold mb-5">Your Orders</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                navigate(`/product/${item.id}`, {
                  state: { product: item },
                })
              }
              className="cursor-pointer border rounded-xl bg-white hover:shadow-lg transition"
            >
              <div className="h-56 bg-gray-100 rounded-t-xl flex items-center justify-center overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-full w-auto object-contain px-3"
                />
              </div>

              <div className="p-3">
                <h3 className="text-base font-medium leading-snug truncate">
                  {item.name}
                </h3>

                <div className="mt-1">
                  <Stars rating={item.average_rating || 0} />
                  <span className="text-xs text-gray-600">
                    {" "}({item.total_reviews || 0})
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  Quantity: {item.quantity}
                </p>

                <p className="text-sm font-semibold mt-1">
                  Total: ₹ {item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
