"use client";

import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "STORAGE",
    description: "2GB",
    details: "Free forever · No card needed",
    long: "Room to build - Unlimited files across the free tier, backed by S3. Nothing you upload is ever quietly deleted.",
    icon: "💾",
  },
  {
    number: "02",
    title: "SDK",
    description: "Typed clients, one shape",
    details: "Same method names and response types across every language.",
    long: "Node, Python, Go",
    icon: "📦",
  },
  {
    number: "03",
    title: "API",
    description: "Plain REST, no gymnastics",
    details: "Skip signed URLs and bucket policy JSON — just call endpoints.",
    long: "POST/v2/files/upload · GET/v2/files/:id",
    icon: "🔌",
  },
  {
    number: "04",
    title: "Instant URLs",
    description: "Every file gets a permanent link the moment it lands.",
    icon: "🔗",
  },
  {
    number: "05",
    title: "Live analytics",
    description: "Storage and usage update as files move — no second dashboard.",
    icon: "📊",
  },
  {
    number: "06",
    title: "Private by choice",
    description: "Flip files or folders to private and issue signed links.",
    long: "End-to-end encrypted · AES-256 · TLS 1.3",
    icon: "🔒",
  },
];

export function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <section id="product" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">What ships</h2>
          <p className="text-xl text-gray-600">Everything, on one plan</p>
          <p className="text-gray-600 mt-2">A tight bundle of primitives so you never have to reach past Cargo for another service.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group p-8 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-all duration-300 hover:shadow-lg"
            >
              {/* Feature Number and Icon */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 tracking-widest">{feature.number}</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{feature.title}</p>
                </div>
                <span className="text-3xl">{feature.icon}</span>
              </div>

              {/* Main Description */}
              <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.description}</h3>

              {/* Details */}
              {feature.details && (
                <p className="text-sm text-gray-600 mb-4">{feature.details}</p>
              )}

              {/* Long description */}
              {feature.long && (
                <p className="text-sm text-gray-600">{feature.long}</p>
              )}

              {/* Hover effect indicator */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                className="h-1 bg-black mt-6 rounded-full origin-left"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
