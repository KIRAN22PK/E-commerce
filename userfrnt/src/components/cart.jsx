import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, removeFromCart } from "../store/cartoperations";
import AppNavbar from "./navbar";
import { addToOrders } from "../store/orderslice";

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();

  console.log("Cart Items:", cartItems);

  return (
    <>
      <AppNavbar />
    <Container className="mt-4">
      <h2 className="mb-4">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <Row>
          {cartItems.map((item) => (
            <Col md={4} key={item.id} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={item.image_url}
                  style={{ height: "200px", objectFit: "cover" }}
                />

                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>₹ {item.price}</Card.Text>

                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => dispatch(removeFromCart(item))}
                    >
                      Remove
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => dispatch(decrement(item))}
                    >
                      -
                    </Button>

                    <span>{item.quantity}</span>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => dispatch(increment(item))}
                    >
                      +
                    </Button>
                  </div>
                  <div style={{margin: "2px"}}>
                    <p style={{margin: "2px", color: "blue"}}>Total: ₹ {item.price * item.quantity}</p>
                      <Button onClick={() => dispatch(addToOrders(item))} variant="primary">Buy Now</Button>
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
