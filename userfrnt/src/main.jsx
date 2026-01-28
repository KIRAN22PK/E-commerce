import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import CartSync from "./components/cartsend.jsx";
import App from "./App.jsx";
import Auth from "./lg_rg.jsx";
import Cart from "./components/cart.jsx";
import { store } from "./store/store1.js";
import Products from "./components/products.jsx";
import ExampleCarouselImage from "./components/carousel.jsx";
import Orders from "./components/orders.jsx";
import ViewItem from "./components/viewItem.jsx";
import OrderSend from "./components/orderssend.jsx";
import Recommendations from "./components/recommendations.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CartSync />
        <OrderSend />
        <Routes>
          <Route path="/home" element={<Products />} />
          <Route path="/" element={<Auth />} />
          <Route path="/search" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/carousal" element={<ExampleCarouselImage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/ViewItem" element={<ViewItem />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
