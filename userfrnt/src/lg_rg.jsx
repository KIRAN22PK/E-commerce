import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCart } from "./store/cartoperations.js";
import { setOrders } from "./store/orderslice.js";
import { setSearchQuery } from "./store/searchSlice.js";
const API_BASE = "http://127.0.0.1:8000/api/auth";

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // 🔐 LOGIN
        const res = await axios.post(`${API_BASE}/login/`, {
          username: formData.username,
          password: formData.password,
        });

        // store JWT
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        localStorage.setItem("username", res.data.username);
        // fetch user cart from backend
        dispatch(setSearchQuery("")); // reset search 
        const cartRes = await axios.get(
          "http://127.0.0.1:8000/api/products/sendcart/",
          {
            headers: {
              Authorization: `Bearer ${res.data.access}`,
            },
          },
        );

        // set cart in Redux
        dispatch(
          setCart(
            cartRes.data.map((item) => ({
              ...item.product,
              quantity: item.quantity,
            })),
          ),
        );

        const ordersRes = await axios.get(
          "http://127.0.0.1:8000/api/orders/list/",
          {
            headers: {
              Authorization: `Bearer ${res.data.access}`,
            },
          },
        );
         console.log(ordersRes.data);
        dispatch(
          setOrders(
            ordersRes.data.map((item) => ({
              ...item.product,
              quantity: item.quantity,
            })),
          ),
        );


        navigate("/search");
      } else {
        // 📝 REGISTER
        await axios.post(`${API_BASE}/register/`, formData);

        alert("Registration successful. Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err); // always log full error for debugging

      // Handle various error types
      if (err.response) {
        // Backend returned an error
        setError(
          err.response.data.detail ||
            err.response.data.error ||
            "Invalid credentials",
        );
      } else if (err.request) {
        // Request made but no response
        setError("No response from server. Check your connection.");
      } else {
        // Other errors
        setError("Something went wrong: " + err.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto" }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          value={formData.username}
          onChange={handleChange}
        />

        {!isLogin && (
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <p
        style={{ cursor: "pointer", color: "blue", marginTop: "10px" }}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Don't have an account? Register"
          : "Already have an account? Login"}
      </p>
    </div>
  );
}
