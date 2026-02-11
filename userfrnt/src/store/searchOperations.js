import axios from "axios";
import { searchStart, searchSuccess, searchFail } from "./searchSlice";
import API_BASE from "../config/api.js";

export const performSearch = (query,navigate) => async (dispatch) => {
  if (!query.trim()) return;
  dispatch(searchStart());

  try {
    const res = await axios.post(
      `${API_BASE}/api/products/semantic-search/`,
      { query },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    console.log(res.data.products)
    dispatch(
         searchSuccess({
           intent: "product_search",
          products: res.data.products,
         })
       );
      dispatch(searchFail())
      navigate("/search");
    // if (res.data.intent === "product_search") {
    //   dispatch(
    //     searchSuccess({
    //       intent: "product_search",
    //       products: res.products,
    //     })
    //   );
    //   dispatch(searchFail())
    //   navigate("/search");
    // } else {
    //   dispatch(
    //     searchSuccess({
    //       intent: "Chat_search",
    //       chatResponse: res.data.chat_prompt,
    //     })
    //   );
    //   dispatch(searchFail())
    //   navigate("/chat");
    // }
  } catch (err) {
    dispatch(searchFail());
    console.error(err);
  }
};
