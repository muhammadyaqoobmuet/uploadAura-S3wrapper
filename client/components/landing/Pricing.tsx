"use client";

import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Get started",
    features: [
      "2GB storage",
      "Unlimited files",
      "Public URLs",
      "Basic analytics",
      "Community support",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For growing teams",
    features: [
      "1TB storage",
      "Unlimited files",
      "Private files",
      "Advanced analytics",
      "Priority support",
      "Custom domain",
      "Webhooks",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For enterprises",
    features: [
      "Unlimited storage",
      "Unlimited files",
      "Advanced security",
      "24/7 support",
      "SLA guarantee",
      "Dedicated account manager",
      "Custom integration",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export function Pricing() {
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

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">Simple pricing</h2>
          <p className="text-xl text-gray-600">Choose the plan that works for you</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`rounded-lg p-8 transition-all duration-300 ${
                plan.highlight
                  ? "border-2 border-black bg-white shadow-lg scale-105"
                  : "border border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {/* Badge */}
              {plan.highlight && (
                <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold rounded-full mb-4">
                  Popular
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-gray-600">/mo</span>}
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-3 rounded-lg font-medium mb-8 transition-all duration-300 ${
                  plan.highlight
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
              >
                {plan.cta}
              </button>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, fIdx) => (
                  <motion.li
                    key={fIdx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: fIdx * 0.05 }}
                    className="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="w-2 h-2 bg-green-600 rounded-full" />
                    </span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
