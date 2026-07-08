"use client";

import { motion } from "framer-motion";

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-20 px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center"
      >
        {/* Main Headline */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            One{" "}
            <span className="inline-block">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block mr-2"
              >
                🔑
              </motion.span>
            </span>
            key. Every file on{" "}
            <span className="text-gray-400">S3</span>.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cargo puts a single API and SDK in front of Amazon S3 — upload, store, and serve files without ever opening
            the AWS console.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button className="btn-primary px-8 py-3 text-lg">Get API key →</button>
          <button className="btn-secondary px-8 py-3 text-lg">See what ships</button>
        </motion.div>

        {/* Live Upload Demo */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-lg"
        >
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <p className="text-sm font-semibold text-gray-900">app.cargo.dev/dashboard</p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Recent Files */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">Recent files</h3>
                <div className="space-y-3">
                  {[
                    { icon: "IMG", name: "hero-banner.png" },
                    { icon: "PDF", name: "invoice-q3.pdf" },
                    { icon: "MP4", name: "product-demo.mp4" },
                    { icon: "ZIP", name: "assets-v2.zip" },
                    { icon: "JS", name: "build.js" },
                    { icon: "CSV", name: "users.csv" },
                  ].map((file, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="bg-gray-100 w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                        {file.icon}
                      </span>
                      <span className="text-gray-600">{file.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right: Upload Status & Stats */}
              <div className="space-y-8">
                {/* Upload Status */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Uploading to S3</h3>
                  <p className="text-xs text-gray-500 mb-3">2.3s · 1.4 MB/s</p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-700">hero-banner.png</span>
                        <span className="text-xs text-gray-500">78%</span>
                      </div>
                      <motion.div
                        className="h-2 bg-gray-200 rounded-full overflow-hidden"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 2, delay: 0.5 }}
                      >
                        <motion.div
                          className="h-full bg-black"
                          initial={{ width: "0%" }}
                          animate={{ width: "78%" }}
                          transition={{ duration: 2, delay: 0.5 }}
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="bg-gray-50 p-3 rounded border border-gray-200 mt-4"
                    >
                      <p className="text-xs text-gray-500 mb-2">https://cdn.cargo.dev/hero-banner.png</p>
                      <p className="text-xs font-semibold text-gray-900">COPY</p>
                    </motion.div>
                  </div>

                  {/* Code snippet */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="bg-gray-900 text-gray-100 p-3 rounded mt-4 text-left font-mono text-xs"
                  >
                    <p>// Upload with the Cargo SDK</p>
                    <p className="text-blue-400">const</p>
                    <p>
                      file = <span className="text-blue-400">await</span> cargo.upload(
                      <span className="text-green-400">'./banner.png'</span>);
                    </p>
                    <p>console.log(file.url);</p>
                    <p className="text-gray-500">// → https://cdn.cargo.dev/hero-banner.png</p>
                  </motion.div>
                </div>

                {/* Stats */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">This month</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Storage used", value: "1.24 / 2 GB" },
                      { label: "Files uploaded", value: "1,284" },
                      { label: "Bandwidth", value: "18.7GB" },
                      { label: "API calls", value: "42.1k" },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8 + i * 0.1 }}
                        className="text-left"
                      >
                        <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                        <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
