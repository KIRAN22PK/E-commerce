import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, removeFromCart } from "../store/cartoperations";
import AppNavbar from "./navbar";
import { addToOrders } from "../store/orderslice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { setCart } from "../store/cartoperations.js";

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span className="text-yellow-400 text-sm">
      {"★".repeat(full)}
      {half && "☆"}
      {"☆".repeat(empty)}
    </span>
  );
}

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;
    if (cartItems.length > 0) return;

    const fetchCart = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/products/sendcart/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        dispatch(
          setCart(
            res.data.map((item) => ({
              ...item.product,
              quantity: item.quantity,
            }))
          )
        );
      } catch (err) {
        console.error("Cart fetch failed", err);
      }
    };

    fetchCart();
  }, [cartItems.length, dispatch]);

  return (
    <>
      <AppNavbar />

      <Container className="py-4">
        <h2 className="text-3xl font-bold mb-4">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center mt-5">
            Your cart is empty 🛒
          </p>
        ) : (
          <Row className="g-4">
            {cartItems.map((item) => (
              <Col
                key={item.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
              >
                <Card
                  className="h-full rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() =>
                    navigate(`/product/${item.id}`, {
                      state: { product: item },
                    })
                  }
                >
                  <div className="overflow-hidden rounded-t-xl">
                    <Card.Img
                      src={item.image_url}
                      className="h-52 w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <Card.Body className="flex flex-col justify-between">
                    <div>
                      <Card.Title className="text-base font-semibold line-clamp-2">
                        {item.name}
                      </Card.Title>

                      <div className="flex items-center gap-1 mb-1">
                        <Stars rating={item.average_rating || 0} />
                        <span className="text-xs text-gray-500">
                          ({item.total_reviews || 0})
                        </span>
                      </div>

                      <p className="font-semibold text-lg mb-1">
                        ₹ {item.price}
                      </p>
                    </div>

                    <div
                      className="flex items-center justify-between mt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => dispatch(removeFromCart(item))}
                      >
                        Remove
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => dispatch(decrement(item))}
                        >
                          −
                        </Button>

                        <span className="font-medium">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => dispatch(increment(item))}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div
                      className="mt-3 border-t pt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="text-primary font-semibold mb-2">
                        Total: ₹ {item.price * item.quantity}
                      </p>

                      <Button
                        variant="primary"
                        className="w-full rounded-lg"
                        onClick={() => dispatch(addToOrders(item))}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}
