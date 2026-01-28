import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartoperations";
import searchReducer from "./searchSlice";
import productsReducer from "./productslice";
import ordersReducer from "./orderslice";
import recommendationReducer from "./recommendation";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    search: searchReducer,
    products: productsReducer,
    orders: ordersReducer,
    recommendations: recommendationReducer,
  },
});
