"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-black">
          ★ CARGO
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link href="#product" className="text-gray-600 hover:text-black transition-colors">
            Product
          </Link>
          <Link href="#watch" className="text-gray-600 hover:text-black transition-colors">
            Watch it work
          </Link>
          <Link href="#faq" className="text-gray-600 hover:text-black transition-colors">
            FAQ
          </Link>
          <Link href="#docs" className="text-gray-600 hover:text-black transition-colors">
            Docs
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-black transition-colors px-3 py-2">
            Sign in
          </Link>
          <Link href="/register" className="btn-primary text-sm">
            Get API key
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
