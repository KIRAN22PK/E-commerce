import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function CartSync() {
  const cart = useSelector((state) => state.cart.cart);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    if (!cart || cart.length === 0) return;

    const syncCart = async () => {
      try {
        await axios.post(
          "http://127.0.0.1:8000/api/products/receivecart/",
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
