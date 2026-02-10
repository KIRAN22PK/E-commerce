import { useState } from "react";
import AppNavbar from "./navbar";
import axios from "axios";

export default function ProductCompare() {
  const [query, setQuery] = useState("");

  const [leftSearch, setLeftSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");

  const [leftProducts, setLeftProducts] = useState([]);
  const [rightProducts, setRightProducts] = useState([]);

  const [leftSelected, setLeftSelected] = useState(null);
  const [rightSelected, setRightSelected] = useState(null);

  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLeftProducts = async () => {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/products/semantic-search/",
      { query: leftSearch },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    setLeftProducts(res.data.products);
  };

  const fetchRightProducts = async () => {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/products/semantic-search/",
      { query: rightSearch },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    setRightProducts(res.data.products);
  };

  const handleCompare = async () => {
    if (!leftSelected || !rightSelected || !query) {
      alert("Select one product from both sides and enter a query");
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/products/compare/",
        {
          query,
          product1_id: leftSelected.id,
          product2_id: rightSelected.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      setAnswer(res.data.answer);
    } catch (e) {
      setAnswer("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppNavbar />

      <div className="min-h-screen bg-gray-100 py-6 px-3 pt-20">
        <div className="max-w-4xl mx-auto mb-6">
          <input
            type="text"
            placeholder="Ask comparison query (e.g., best for gaming?)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-4 border rounded-xl shadow-sm focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-3">Product 1</h2>

            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                placeholder="Search product"
                value={leftSearch}
                onChange={(e) => setLeftSearch(e.target.value)}
                className="flex-1 min-w-0 p-2 border rounded-lg"
              />
              <button
                onClick={fetchLeftProducts}
                className="px-4 py-2 bg-black text-white rounded-lg w-full sm:w-auto"
              >
                Search
              </button>
            </div>

            <div className="h-64 overflow-y-auto space-y-2">
              {leftProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setLeftSelected(p)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition ${
                    leftSelected?.id === p.id
                      ? "bg-blue-50 border-blue-400"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-16 h-16 object-contain"
                  />
                  <p className="text-sm font-medium line-clamp-2">
                    {p.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-3">Product 2</h2>

            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                placeholder="Search product"
                value={rightSearch}
                onChange={(e) => setRightSearch(e.target.value)}
                className="flex-1 min-w-0 p-2 border rounded-lg"
              />
              <button
                onClick={fetchRightProducts}
                className="px-4 py-2 bg-black text-white rounded-lg w-full sm:w-auto"
              >
                Search
              </button>
            </div>

            <div className="h-64 overflow-y-auto space-y-2">
              {rightProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setRightSelected(p)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition ${
                    rightSelected?.id === p.id
                      ? "bg-green-50 border-green-400"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-16 h-16 object-contain"
                  />
                  <p className="text-sm font-medium line-clamp-2">
                    {p.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={handleCompare}
            disabled={loading || !leftSelected || !rightSelected}
            className="px-8 py-3 bg-black text-white rounded-xl text-lg disabled:opacity-50"
          >
            {loading ? "Comparing..." : "Compare"}
          </button>
        </div>

        <div className="max-w-6xl mx-auto mt-6">
          <textarea
            value={answer}
            readOnly
            placeholder="Comparison result will appear here..."
            className="w-full h-48 p-4 border rounded-xl bg-white shadow-sm resize-none"
          />
        </div>
      </div>
    </>
  );
}
