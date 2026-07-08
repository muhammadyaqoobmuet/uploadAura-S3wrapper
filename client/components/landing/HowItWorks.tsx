"use client";

import { motion } from "framer-motion";

export function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const benefits = [
    "No bucket setup before your first call",
    "No pre-signed URLs to generate by hand",
    "Works the same from a script or a browser",
  ];

  return (
    <section id="watch" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">Watch it work</h2>
          <p className="text-xl text-gray-600">One upload, start to URL</p>
          <p className="text-gray-600 mt-4">Drop a file in, and Cargo handles the rest — storage, indexing, and a public link, in one pass.</p>

          {/* Benefits */}
          <motion.div className="mt-8 flex flex-col gap-3">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex items-center gap-3 text-gray-700"
              >
                <span className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white text-sm">
                  ✓
                </span>
                <span className="text-sm">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8">
            <button className="btn-secondary">Read the SDK docs →</button>
          </motion.div>
        </motion.div>

        {/* Live Upload Demo Video Placeholder */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="rounded-lg overflow-hidden border border-gray-200 bg-black aspect-video flex items-center justify-center"
        >
          <div className="text-center text-white">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              ▶
            </motion.div>
            <p className="text-sm text-gray-400">CARGO — LIVE UPLOAD</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
