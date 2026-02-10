import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCart } from "./store/cartoperations.js";
import { setOrders } from "./store/orderslice.js";
import { setSearchQuery } from "./store/searchSlice.js";
import { Container, Card, Form, Button } from "react-bootstrap";
import API_BASE from "./config/api.js";

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
        const res = await axios.post(`${API_BASE}/login/`, {
          username: formData.username,
          password: formData.password,
        });

        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        localStorage.setItem("username", res.data.username);
        dispatch(setSearchQuery(""));
        const cartRes = await axios.get(
          `${API_BASE}/api/products/sendcart/`,
          {
            headers: {
              Authorization: `Bearer ${res.data.access}`,
            },
          },
        );

        dispatch(
          setCart(
            cartRes.data.map((item) => ({
              ...item.product,
              quantity: item.quantity,
            })),
          ),
        );

        const ordersRes = await axios.get(
          `${API_BASE}/api/orders/list/`,
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
        {console.log('cart.data:', cartRes.data);}
        navigate("/search");
      } else {
        await axios.post(`${API_BASE}/register/`, formData);

        alert("Registration successful. Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err); 

      if (err.response) {
        setError(
          err.response.data.detail ||
            err.response.data.error ||
            "Invalid credentials",
        );
      } else if (err.request) {
        setError("No response from server. Check your connection.");
      } else {
        setError("Something went wrong: " + err.message);
      }
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <Container className="max-w-md">
      <Card className="shadow-lg rounded-xl border-0">
        <Card.Body className="p-6">
          <h2 className="text-2xl font-semibold text-center mb-4">
            {isLogin ? "Login to your account" : "Create an account"}
          </h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="py-2"
              />
            </Form.Group>

            {!isLogin && (
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="py-2"
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="py-2"
              />
            </Form.Group>

            {error && (
              <div className="text-red-500 text-sm mb-3 text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-2 bg-black border-0 hover:bg-gray-800 transition"
            >
              {isLogin ? "Login" : "Register"}
            </Button>
          </Form>

          <p
            className="text-sm text-center mt-4 text-blue-600 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </p>
        </Card.Body>
      </Card>
    </Container>
  </div>
);

}
