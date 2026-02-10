import { useSelector, useDispatch } from "react-redux";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import { addToCart } from "../store/cartoperations";
import AppNavbar from "./navbar";
import { useNavigate } from "react-router";

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

export default function ExampleCarouselImage() {
  const products = useSelector((state) => state.products.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <AppNavbar />

      <h1 className="text-center text-3xl font-bold my-6 tracking-wide pb-10">
        Products
      </h1>
      <Container className="pb-8">
        <Row className="g-4">
          {products.map((item) => (
            <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
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
                    className="h-56 w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <Card.Body className="flex flex-col justify-between">
                  <div>
                    <Card.Title className="text-base font-semibold line-clamp-2">
                      {item.name}
                    </Card.Title>

                    <div className="flex items-center gap-1 mb-2">
                      <Stars rating={item.average_rating || 0} />
                      <span className="text-xs text-gray-500">
                        ({item.total_reviews || 0})
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="dark"
                    className="
    mt-3 w-full rounded-lg text-sm
    transition-all duration-200
    hover:scale-[1.02]
    active:scale-95
    active:opacity-90
  "
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(addToCart(item));
                    }}
                  >
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
