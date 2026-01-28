import { useSelector } from "react-redux";
import { Card, Row, Col, Container } from "react-bootstrap";
import { addToCart } from "../store/cartoperations";
import { useDispatch } from "react-redux";
import AppNavbar from "./navbar";
export default function ExampleCarouselImage(){
    const products = useSelector((state) => state.products.items);
    const dispatch = useDispatch();
    return(
        <>
        <AppNavbar />
       <h1>Products</h1>
       {console.log("Products in Carousel:", products)}
         <Container>
        <Row>
          {products.map((item) => (
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
      </>
    );
}