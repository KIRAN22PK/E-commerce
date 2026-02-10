import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../store/searchSlice";
import { performSearch } from "../store/searchOperations";
import { Link, useNavigate } from "react-router-dom";
import useVoiceInput from "../assets/voiceinput";

export default function AppNavbar() {
  const { startListening, listening } = useVoiceInput();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useSelector((state) => state.search.query);

  return (
      <Navbar
      expand="md"
      fixed="top"
      className="bg-body-tertiary shadow-sm"
      >
     <Container fluid>
        <Navbar.Toggle aria-controls="mobile-menu" />

        <Navbar.Brand className="fw-bold tracking-wide">
          ShopSphere
        </Navbar.Brand>

        <Form
          className="d-flex flex-grow-1 mx-2 max-w-xl"
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) {
              dispatch(performSearch(query, navigate));
            }
          }}
        >
          <Button
            type="button"
            variant="outline-secondary"
            onClick={startListening}
            disabled={listening}
            className="me-1"
          >
            {listening ? "🎙️" : "🎤"}
          </Button>

          <Form.Control
            value={query}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search anything..."
          />

          <Button type="submit" className="ms-1">
            Search
          </Button>
        </Form>

        <Nav className="ms-auto d-none d-md-flex gap-3">
          <Nav.Link as={Link} to="/search">Home</Nav.Link>
          <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
          <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
          <Nav.Link as={Link} to="/recommendations">Recommended</Nav.Link>
          <Nav.Link as={Link} to="/compare">Compare</Nav.Link>
        </Nav>

        <Navbar.Offcanvas
          id="mobile-menu"
          placement="start"
          className="d-md-none"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="flex-column gap-2">
              <Nav.Link as={Link} to="/search">Home</Nav.Link>
              <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
              <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
              <Nav.Link as={Link} to="/recommendations">Recommended</Nav.Link>
              <Nav.Link as={Link} to="/compare">Compare</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
