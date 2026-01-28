import { useSelector, useDispatch } from "react-redux";
import { Card, Row, Col, Container } from "react-bootstrap";
import { addToCart } from "../store/cartoperations";
import AppNavbar from "./navbar.jsx";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setProducts } from "../store/productslice.js";
function Products() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const productssearch = useSelector((state) => state.search.products);
  const fetchCarouselProducts = async (url) => {
    const res = await axios.get(url);
    dispatch(setProducts(res.data));
    Navigate("/carousal");
  };
  return (
    <>
      <AppNavbar />
      {productssearch.length > 0 ? (
        <Container>
          <Row>
            {productssearch.map((item) => (
              <Col md={4} key={item.id}>
                <Card>
                  <Card.Img src={item.image_url} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <button onClick={() => dispatch(addToCart(item))}>
                      Add to Cart
                    </button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      ) : (
        <>
        <h1>Mens</h1>
        <Carousel>
          <Carousel.Item>
            <img onClick={() =>
              fetchCarouselProducts("http://127.0.0.1:8000/api/products/mens-footwear/")
            } style={{width: "100%"}} src="/images/mensfootwear.jpg" />
          </Carousel.Item>

          <Carousel.Item>
            <img onClick={() =>
              fetchCarouselProducts("http://127.0.0.1:8000/api/products/mens-fullhands/")
            } style={{width: "100%"}} src="/images/mensfullhands.jpg" />
          </Carousel.Item>

          <Carousel.Item>
            <img onClick={() =>
              fetchCarouselProducts("http://127.0.0.1:8000/api/products/mens-halfhands/")
            } style={{width: "100%"}} src="/images/menshalfhands.jpg" />
          </Carousel.Item>

        </Carousel>
        </>
      )}
    </>
  );
}

export default Products;
