import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

export default function CheckEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email;

  const openGmail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  return (
    <section className="h-[45rem] flex items-center justify-center bg-gradient-to-b from-black via-violet-950 to-gray-900 px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center"
      >
        <h1 className="text-2xl font-bold text-white mb-4">Confirm your email</h1>
        <p className="text-gray-300 mb-6">
          We sent an activation link to {" "}
          <span className="text-gray-100 font-semibold">
            {emailFromState || "your email"}
          </span>.
          {" "}
          Please check your Gmail inbox and click the link to activate your account.
        </p>

        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openGmail}
            className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-red-300 to-red-500 text-red-900 font-bold hover:from-red-400 hover:to-red-600 hover:text-white transition-all duration-500"
          >
            Open Gmail
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-gray-400 to-gray-100 text-violet-700 font-bold hover:from-violet-700 hover:to-purple-700 hover:text-white transition-all duration-500"
          >
            Back to Login
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
