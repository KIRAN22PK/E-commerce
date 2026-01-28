import axios from "axios";
import { searchStart, searchSuccess, searchFail } from "./searchSlice";
export const performSearch = (query,navigate) => async (dispatch) => {
  if (!query.trim()) return;
  dispatch(searchStart());

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/products/search/",
      { query },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    console.log(res.data)

    if (res.data.intent === "product_search") {
      dispatch(
        searchSuccess({
          intent: "product_search",
          products: res.data.results,
        })
      );
      dispatch(searchFail())
      navigate("/search");
    } else {
      dispatch(
        searchSuccess({
          intent: "Chat_search",
          chatResponse: res.data.chat_prompt,
        })
      );
      dispatch(searchFail())
      navigate("/chat");
    }
  } catch (err) {
    dispatch(searchFail());
    console.error(err);
  }
};
