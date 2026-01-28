import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    intent: null,
    products: [],
    chatResponse: null,
    loading: false,
  },
  reducers: {
    setSearchQuery(state, action) {
      state.query = action.payload;
    },
    searchStart(state) {
      state.loading = true;
    },
    searchSuccess(state, action) {
      state.intent = action.payload.intent;
      state.products = action.payload.products || [];
      state.chatResponse = action.payload.chatResponse || null;
      state.loading = false;
    },
    searchFail(state) {
      state.loading = false;
    },
  },
});

export const {
  setSearchQuery,
  searchStart,
  searchSuccess,
  searchFail,
} = searchSlice.actions;

export default searchSlice.reducer;
