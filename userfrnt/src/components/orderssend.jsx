import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function OrderSend() {
  const cart = useSelector((state) => state.orders.items);

  useEffect(() => {
    // do not sync if user not logged in
    const token = localStorage.getItem("access");
    if (!token) return;

    // optional: avoid empty cart sync on first render
    if (!cart || cart.length === 0) return;

    const syncCart = async () => {
      try {
        await axios.post(
          "http://127.0.0.1:8000/api/orders/buy/",
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

  return null; // nothing to render
}
