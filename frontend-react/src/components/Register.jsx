import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://stock-price-prediction-portal.onrender.com/api/v1/register/", formData);
      console.log("Registered:", res.data);

      setErrors({});
      // Go to confirmation page with email in state
      navigate("/check-email", { state: { email: formData.email } });
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-[50rem] flex items-center justify-center bg-gradient-to-b from-black via-violet-950 to-gray-900 px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Create Account
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username */}
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
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
            />
            {errors.username && (
              <p className="text-sm text-red-400 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
            />
            {errors.email && (
              <p className="text-sm text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
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
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
            />
            {errors.password && (
              <p className="text-sm text-red-400 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Success Alert */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 px-4 py-3 rounded-lg bg-green-100 border border-green-300 text-green-800 text-sm text-center"
            >
              ✅ Registration successful! Please check your Gmail inbox for an activation link.
            </motion.div>
          )}

          {/* Submit Button */}
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
              "Register"
            )}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default Register;
