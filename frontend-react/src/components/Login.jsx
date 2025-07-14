import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cameFromGetStarted = location.state?.fromGetStarted;

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/v1/token/", formData);
      console.log("Login successful:", res.data);

      setSuccess(true);
      login(res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // ✅ Conditional redirect
      if (cameFromGetStarted) {
        navigate("/predict");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error('Invalid Credentials');
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-[45rem] flex items-center justify-center bg-gradient-to-b from-black via-violet-950 to-gray-900 px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 text-white"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 mt-1 text-center">{error}</p>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 px-4 py-3 rounded-lg bg-green-100 border border-green-300 text-green-800 text-sm text-center"
            >
              ✅ Login successful!
            </motion.div>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: !loading ? 1.03 : 1 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className={`w-full px-4 py-2 mt-4 font-bold rounded-xl transition-all duration-500 ${
              loading
                ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                : "bg-gradient-to-r from-gray-400 to-gray-100 text-violet-700 hover:from-violet-700 hover:to-purple-700 hover:text-white"
            }`}
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <FontAwesomeIcon icon={faSpinner} spin />
                Please wait...
              </span>
            ) : (
              "Login"
            )}
          </motion.button>

          <p className="text-sm text-gray-400 text-center mt-3">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-violet-400 hover:underline"
            >
              Register
            </button>
          </p>
        </form>
      </motion.div>
    </section>
  );
};

export default Login;
