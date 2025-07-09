import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in:", formData);
    // TODO: Replace with POST request to /api/v1/login/
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
          Welcome Back
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
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 text-white"
            />
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
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 text-white"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full px-4 py-2 mt-4 bg-gradient-to-r from-gray-400 to-gray-100 text-violet-700 font-bold rounded-xl hover:from-violet-700 hover:to-purple-700 hover:text-white transition-all duration-500"
          >
            Login
          </motion.button>

          {/* Register Redirect */}
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
