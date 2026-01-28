import { useEffect } from "react";
import axios from "axios";
import { Card, Container } from "react-bootstrap";
import { Button } from "react-bootstrap";
import AppNavbar from "./navbar";
import { useDispatch } from "react-redux";
import { setRProducts, setRLoading } from "../store/recommendation";
import { useSelector } from "react-redux";
export default function Recommendations() {
  const dispatch = useDispatch();
  const recommendations = useSelector((state) => state.recommendations.items);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        dispatch(setRLoading(true));

        const res = await axios.get(
          "http://127.0.0.1:8000/api/products/recommendations/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );

        dispatch(
          setRProducts(
            res.data
          )
        );
      } catch (err) {
        console.error("Recommendation error:", err);
      } finally {
        dispatch(setRLoading(false));
      }
    };

    fetchRecommendations();
  }, [dispatch]);

  return (
    <>
   {console.log(recommendations)}
      <AppNavbar />
      <Container>
        <h2>Recommended Products for you</h2>

        {recommendations.length === 0 ? (
          <p>No recommendations yet</p>
        ) : (
          recommendations.map((item) => (
            <Button style={{ border: "none", background: "none", padding: 0, margin: 0 }}>
              <Card key={item.id} className="mb-3">
              <Card.Body>
                <Card.Img src={item.image_url} style={{ height: "200px", objectFit:"cover" }} />
                <Card.Title>{item.name}</Card.Title>
                <p>Price: {item.price}</p>
              </Card.Body>
              </Card>
            </Button>
          ))
        )}
      </Container>
    </>
  );
}
