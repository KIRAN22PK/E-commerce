import { useSelector } from "react-redux";
import { Card, Container } from "react-bootstrap";
import AppNavbar from "./navbar";
import { Button } from "react-bootstrap";
import ViewItem from "./viewItem.jsx";
import { useNavigate } from "react-router";
export default function Orders() {
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.items);
  function handleOrderClick(orderItem) {
    ViewItem(orderItem);
    navigate("/viewItem");
  }
      
  return (
    <>
      <AppNavbar />
      <Container>
        <h2>Your Orders</h2>

        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.map((item) => (
            <Button onClick={() => {handleOrderClick(item)}} style={{ border: "none", background: "none", padding: 0, margin: 0 }}>
              <Card key={item.id} className="mb-3">
              <Card.Body>
                <Card.Img src={item.image_url} style={{ height: "200px", objectFit:"cover" }} />
                <Card.Title>{item.name}</Card.Title>
                <p>Quantity: {item.quantity}</p>
                <p>Total: ₹ {item.price * item.quantity}</p>
              </Card.Body>
              </Card>
            </Button>
          ))
        )}
      </Container>
    </>
  );
}

