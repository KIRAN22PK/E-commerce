import { useSelector, useDispatch } from "react-redux";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import { addToCart } from "../store/cartoperations";
import AppNavbar from "./navbar.jsx";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setProducts } from "../store/productslice.js";
import API_BASE from "../config/api.js";
/* ⭐ Inline Stars */
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

function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productssearch = useSelector((state) => state.search.products);

  const fetchCarouselProducts = async (url) => {
    const res = await axios.get(url);
    dispatch(setProducts(res.data));
    navigate("/carousal");
  };

  return (
    <>
      <AppNavbar />

      {productssearch.length > 0 ? (
        <Container className="py-6">
          <Row className="g-4">
            {productssearch.map((item) => (
              <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  className="h-full shadow-md hover:shadow-xl transition-all duration-300 rounded-xl cursor-pointer"
                  onClick={() =>
                    navigate(`/product/${item.id}`, {
                      state: { product: item },
                    })
                  }
                >
                  {/* Product Image */}
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

                      {/* ⭐ Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <Stars rating={item.average_rating || 0} />
                        <span className="text-xs text-gray-500">
                          ({item.total_reviews || 0})
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart */}
                    {/* <Button
                      variant="dark"
                      className="mt-3 w-full rounded-lg text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(addToCart(item));
                      }}
                    >
                      Add to Cart
                    </Button> */}
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
      ) : (
        <>
          {/* Category Heading */}
          <h1 className="text-center text-3xl font-bold my-6 tracking-wide">
            Mens Collection
          </h1>

          {/* Carousel */}
          <Container className="mb-10 pt-5">
            <Carousel fade interval={3000}>
              {[
                {
                  img: "/images/mensfootwear.jpg",
                  url: `${API_BASE}/api/products/mens-footwear/`,
                },
                {
                  img: "/images/mensfullhands.jpg",
                  url: `${API_BASE}/api/products/mens-fullhands/`,
                },
                {
                  img: "/images/menshalfhands.jpg",
                  url: `${API_BASE}/api/products/mens-halfhands/`,
                },
              ].map((item, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={item.img}
                    className="w-full h-[420px] object-cover rounded-xl cursor-pointer"
                    onClick={() => fetchCarouselProducts(item.url)}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Container>
          <h1 className="text-center text-3xl font-bold my-6 tracking-wide">
            ELECTRONICS
          </h1>
          <div className="w-full max-w-5xl mx-auto px-4">
            <div className="flex flex-col gap-5">
              {/* Top row */}
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Mobiles */}
                <div
                  onClick={() =>
                    fetchCarouselProducts(
                      `${API_BASE}/api/products/mobiles/`,
                    )
                  }
                  className="relative w-full sm:w-1/2 h-48 rounded-xl overflow-hidden cursor-pointer group shadow-md"
                >
                  <img
                    src="https://tse4.mm.bing.net/th/id/OIP.mV6j9YsE56b-6rRqvqHh9QHaDS?pid=Api&P=0&h=180"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">Smartphones</h3>
                    <p className="text-sm opacity-90">
                      Explore latest models →
                    </p>
                  </div>
                </div>

                {/* Fans */}
                <div
                  onClick={() =>
                    fetchCarouselProducts(
                     `${API_BASE}/api/products/fans/`,
                    )
                  }
                  className="relative w-full sm:w-1/2 h-48 rounded-xl overflow-hidden cursor-pointer group shadow-md"
                >
                  <img
                    src="https://tse2.mm.bing.net/th/id/OIP.UX7B_Zw_N12ENh_gbZvgUAHaCy?pid=Api&P=0&h=180"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">Fans</h3>
                    <p className="text-sm opacity-90">Cool deals inside →</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() =>
                  fetchCarouselProducts(
                    `${API_BASE}/api/products/bulbs/`,
                  )
                }
                className="relative w-full h-64 rounded-xl overflow-hidden cursor-pointer group shadow-lg"
              >
                <img
                  src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/led-bulb-banner-ad-design-template-db8eb5d55a1f395a6e1632edc9cb630d_screen.jpg?ts=1732710023"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition" />

                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">Smart Lighting</h3>
                  <p className="text-sm opacity-90">
                    Energy efficient • Modern • Stylish
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Products;
