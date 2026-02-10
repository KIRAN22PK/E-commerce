import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cart:[],
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
     state.cart = action.payload;
     },
    addToCart: (state, action) => {
      const item = state.cart.find(
        item => item.id === action.payload.id
      )

      if (item) {
        item.quantity += 1
      } else {
        state.cart.push({
          ...action.payload,
          quantity: 1,
        })
      }
    },
    removeFromCart: (state,action) => {
        state.cart = state.cart.filter(
        item => item.id !== action.payload.id
      )
    },
    increment:(state,action)=>{
     const item = state.cart.find(
     item => item.id === action.payload.id
     );
     if (item) {
     item.quantity += 1
     }
    },
    decrement:(state,action)=>{
       const item = state.cart.find(
        item => item.id === action.payload.id
        );

        if (item) {
        item.quantity -= 1;

        if (item.quantity === 0) {
          state.cart = state.cart.filter(
            i => i.id !== action.payload.id
          );
        }
      }
    },
    clearCart:(state)=>{
        state.cart=[]
    },
  },
}
);

export const { addToCart, removeFromCart, clearCart,increment,decrement,setCart } = cartSlice.actions;

export default cartSlice.reducer