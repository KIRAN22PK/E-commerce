import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import API_BASE from "../config/api";
export default function OrderSend() {
  const cart = useSelector((state) => state.orders.items);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    if (!cart || cart.length === 0) return;

    const syncCart = async () => {
      try {
        await axios.post(
          `${API_BASE}/api/orders/buy/`,
          cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Cart synced successfully");
      } catch (error) {
        console.error("Cart sync failed", error);
      }
    };

    syncCart();
  }, [cart]);

  return null; 
}
