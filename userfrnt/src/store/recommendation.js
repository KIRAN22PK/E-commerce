import { createSlice } from "@reduxjs/toolkit";

const recommendSlice = createSlice({
  name: "recommendation",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    setRProducts: (state, action) => {
      state.items = action.payload;
    },
    setRLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setRProducts, setRLoading } = recommendSlice.actions;
export default recommendSlice.reducer;
