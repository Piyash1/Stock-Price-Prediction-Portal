import { useState } from "react";
import { motion } from "framer-motion";
import { API_BASE } from "../config";

const Prediction = () => {
  const [symbol, setSymbol] = useState("");
  const [plots, setPlots] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Static model info, you can update this if you want to get from backend later
  const modelInfo = {
    name: "LSTM",
    trainedPeriod: "2003–2024",
    accuracy: "92.8%",
  };

  const fetchPrediction = async () => {
    setLoading(true);
    setError("");
    setPlots(null);
    try {
      const response = await fetch(`${API_BASE}/api/v1/stock-plots/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPlots(data.plots);
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol.trim()) fetchPrediction();
  };

  return (
    <section className="min-h-screen py-10 px-6 bg-gradient-to-b from-violet-900 to-black text-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl font-extrabold mb-2 mt-20"
        >
          Predict Stock Trends
        </motion.h1>

        {/* Model Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8 text-sm text-gray-300 italic mt-5"
        >
          Model: <span className="font-semibold">{modelInfo.name}</span> | Trained on:{" "}
          <span className="font-semibold">{modelInfo.trainedPeriod}</span> | Accuracy:{" "}
          <span className="font-semibold">{modelInfo.accuracy}</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-gray-300 mb-8"
        >
          Enter a valid stock symbol (e.g. AAPL, TSLA, GOOGL) and see how our AI model forecasts the trend.
        </motion.p>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
        >
          <input
            type="text"
            placeholder="Enter stock symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="p-3 w-full sm:w-64 text-white border border-white rounded-lg"
            aria-label="Stock symbol input"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-400 to-gray-100 text-violet-700 font-bold hover:from-violet-700 hover:to-purple-700 hover:text-white transition-all duration-500"
            aria-busy={loading}
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>

        {/* Error */}
        {error && <p className="text-red-500 mb-6">{error}</p>}

        {/* Loading Indicator */}
        {loading && (
          <motion.div
            className="text-center text-lg mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loading prediction plots...
          </motion.div>
        )}

        {/* Plots displayed vertically */}
        {plots && (
          <div className="flex flex-col gap-10 max-w-3xl mx-auto">
            <div>
              <h2 className="mb-4 text-2xl font-semibold">Close + MA 100 days</h2>
              <img
                src={`data:image/png;base64,${plots.ma_100}`}
                alt="Moving Average 100 days"
                className="rounded-lg border mx-auto"
                style={{ width: "100%", maxWidth: "800px", height: "auto" }}
              />
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold">Close + MA 200 days</h2>
              <img
                src={`data:image/png;base64,${plots.ma_200}`}
                alt="Moving Average 200 days"
                className="rounded-lg border mx-auto"
                style={{ width: "100%", maxWidth: "800px", height: "auto" }}
              />
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold">Close + MA 250 days</h2>
              <img
                src={`data:image/png;base64,${plots.ma_250}`}
                alt="Moving Average 250 days"
                className="rounded-lg border mx-auto"
                style={{ width: "100%", maxWidth: "800px", height: "auto" }}
              />
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold">Close + MA 100 & 250 days</h2>
              <img
                src={`data:image/png;base64,${plots.ma_100_250}`}
                alt="Moving Average 100 and 250 days"
                className="rounded-lg border mx-auto"
                style={{ width: "100%", maxWidth: "800px", height: "auto" }}
              />
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold">Prediction vs Actual</h2>
              <img
                src={`data:image/png;base64,${plots.prediction_vs_actual}`}
                alt="Prediction vs Actual"
                className="rounded-lg border mx-auto"
                style={{ width: "100%", maxWidth: "800px", height: "auto" }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Prediction;
