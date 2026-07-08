"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "Is this a new storage service, or a wrapper?",
    answer:
      "A wrapper. Your files live in your own S3 bucket — Cargo just gives you one API and SDK instead of raw AWS calls, IAM policies, and bucket configuration.",
  },
  {
    question: "Do I need an AWS account first?",
    answer:
      "No. Cargo provisions and manages the underlying bucket for you on the free tier. On Pro plans you can also connect your own AWS account if you want direct ownership.",
  },
  {
    question: "What happens if I go over 2GB?",
    answer:
      "Uploads past the free limit are paused, not deleted. You'll get a notice with a one-click upgrade — nothing you've already stored is ever removed.",
  },
  {
    question: "Which languages does the SDK support?",
    answer:
      "Node, Python, and Go today, with the same method names and response shapes across all three. A REST API sits underneath, so any language can call it directly.",
  },
  {
    question: "Can I make uploaded files private?",
    answer:
      "Yes — every file defaults to a public URL, but you can flip a file or an entire folder to private and issue short-lived signed links instead.",
  },
];

export function ProductShowcase() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
    <section id="faq" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-5xl font-bold mb-4">Questions</h2>
          <p className="text-xl text-gray-600 mb-12">Before you start</p>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {faqItems.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-gray-300 transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-4"
                  >
                    <ChevronDown size={20} className="text-gray-400" />
                  </motion.div>
                </button>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: openIndex === idx ? "auto" : 0,
                    opacity: openIndex === idx ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-gray-600 border-t border-gray-100">
                    {item.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
