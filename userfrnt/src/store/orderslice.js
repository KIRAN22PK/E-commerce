import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], 
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addToOrders: (state, action) => {
      const item = state.items.find(
        (i) => i.id === action.payload.id
      );

      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity,
        });
      }
    },

    setOrders: (state, action) => {
      state.items = action.payload;
    },

    clearOrders: (state) => {
      state.items = [];
    },
  },
});

export const { addToOrders, setOrders, clearOrders } =
  ordersSlice.actions;

export default ordersSlice.reducer;
