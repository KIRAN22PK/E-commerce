import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../store/searchSlice";
import { performSearch } from "../store/searchOperations";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useVoiceInput from "../assets/voiceinput.js";
export default function AppNavbar() {
  const { startListening } = useVoiceInput();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useSelector((state) => state.search.query);
  const { listening } = useVoiceInput();
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Link to="/search">
          <Navbar.Brand>Home</Navbar.Brand>
        </Link>
        <Button type="button" onClick={startListening}>
          {listening ? "🎙️ Listening..." : "🎤"}
        </Button>
        <Form
          className="d-flex"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(performSearch(query, navigate));
          }}
        >
          <Form.Control
            value={query}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search anything..."
          />
          <Button type="submit">Search</Button>
        </Form>
        <Link to="/cart">
          <Navbar.Brand>Cart</Navbar.Brand>
        </Link>
        <Link to="/orders">
          <Navbar.Brand>Orders</Navbar.Brand>
        </Link>
        <Link to="/recommendations">
          <Navbar.Brand>For you</Navbar.Brand>
        </Link>
      </Container>
    </Navbar>
  );
}
