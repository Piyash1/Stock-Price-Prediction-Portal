import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

const Main = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [symbol, setSymbol] = useState("AAPL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("access"));

  // Update login state if localStorage token changes
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("access");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", checkLogin);
    checkLogin();

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const fetchNews = async (symbolToSearch) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/v1/stock-news/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbol: symbolToSearch }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setNews([]);
      } else {
        setNews(data.news);
      }
    } catch (err) {
      setError("Failed to load news.");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(symbol);
  }, [symbol]);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/predict");
    } else {
      navigate("/login", { state: { fromGetStarted: true } });
    }
  };

  console.log("Is logged in:", isLoggedIn);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-violet-900 to-black py-20">
        <div className="absolute inset-0 bg-[rgba(255,255,255,0.03)] pointer-events-none z-0" />
        <div className="relative z-10 text-center max-w-3xl px-6 mt-26">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            Stock Prediction System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300 text-base md:text-lg mb-8"
          >
            A smart forecasting platform that predicts future stock trends using AI-powered models.
            Analyze, visualize, and make informed financial decisions effortlessly.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.6 }}
            onClick={handleGetStarted}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-400 to-gray-100 text-violet-700 font-bold hover:from-violet-700 hover:to-purple-700 hover:text-white transition-all duration-500"
          >
            Get Started
          </motion.button>
        </div>
      </section>

      {/* News Section */}
      <section className="pt-4 pb-16 px-6 bg-black text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Latest News</h2>

          {/* Symbol Input */}
          <div className="flex justify-center mb-8">
            <input
              type="text"
              placeholder="Enter stock symbol (e.g., TSLA)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="p-3 w-64 text-white border border-gray-600 bg-violet-900 rounded-lg text-center placeholder-gray-400"
            />
          </div>

          {loading && <p className="text-center text-gray-400">Loading news...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          <div className="grid gap-6 md:grid-cols-2">
            {news.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-violet-950 border border-violet-700 rounded-xl p-5 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold mb-2">{item.headline}</h3>
                <p className="text-sm text-gray-400 mb-1">
                  Source: <span className="text-white">{item.source}</span>
                </p>
                <p className="text-sm text-gray-400 mb-3">Date: {item.datetime}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline"
                >
                  Read full article →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Main;
