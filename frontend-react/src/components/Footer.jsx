import { motion } from "framer-motion";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-black to-violet-900 text-gray-300 py-8 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-6">

        {/* Logo / Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center space-x-3"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-gray-500 to-gray-100 flex items-center justify-center text-purple-700 font-bold text-xl">
            S
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">
            Stock Prediction Portal
          </span>
        </motion.div>

        {/* Links / Icons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex space-x-6"
        >
          <a
            href="#"
            className="hover:text-violet-400 transition-colors duration-300"
          >
            <FiGithub className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="hover:text-violet-400 transition-colors duration-300"
          >
            <FiTwitter className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="hover:text-violet-400 transition-colors duration-300"
          >
            <FiLinkedin className="w-5 h-5" />
          </a>
        </motion.div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm text-gray-500"
        >
          © {new Date().getFullYear()} Stock Prediction Portal. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;
