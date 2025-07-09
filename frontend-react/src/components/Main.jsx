import { motion } from "framer-motion";

const Main = () => {
  return (
    <section className="h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-violet-900 to-black">

      {/* Overlay Background Layer */}
      <div className="absolute inset-0 bg-[rgba(255,255,255,0.03)] pointer-events-none z-0" />

      <div className="relative z-10 text-center max-w-3xl px-6">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-4"
        >
          Stock Prediction System
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-300 text-base md:text-lg mb-8"
        >
          A smart forecasting platform that predicts future stock trends using AI-powered models.
          Analyze, visualize, and make informed financial decisions effortlessly.
        </motion.p>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.6 }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-400 to-gray-100 text-violet-700 font-bold hover:from-violet-700 hover:to-purple-700 hover:text-white transition-all duration-500"
        >
          Get Started
        </motion.button>
      </div>
    </section>
  );
};

export default Main;
