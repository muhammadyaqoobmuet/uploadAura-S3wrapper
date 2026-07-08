"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Upload,
  Key,
  Zap,
  Shield,
  BarChart3,
  Code2,
  Check,
  ArrowRight,
  Github,
  Twitter,
  Globe,
  FileCode,
  Image as ImageIcon,
  Film,
  FileArchive,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function UploadAuraLanding() {
  const [email, setEmail] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-content">
          <div className="nav-logo">
            <div className="logo-orb" />
            <span className="logo-text">UploadAura</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="nav-actions">
            <Link href="/login" className="nav-btn-ghost">
              Sign in
            </Link>
            <Link href="/register" className="nav-btn-primary">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section ref={heroRef} className="hero" style={{ opacity }}>
        <div className="hero-bg-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <motion.div className="hero-content" style={{ y }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-badge"
          >
            <Sparkles size={14} />
            <span>2GB free forever · No credit card needed</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-title"
          >
            One API key.
            <br />
            Every file on <span className="hero-gradient">S3</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-subtitle"
          >
            Skip AWS buckets, IAM policies, and configuration hell.
            <br />
            Upload, store, and serve files with a single SDK call.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hero-actions"
          >
            <Link href="/register" className="btn-hero-primary">
              Get API key
              <ArrowRight size={18} />
            </Link>
            <Link href="#how-it-works" className="btn-hero-secondary">
              <Globe size={18} />
              See how it works
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hero-code"
          >
            <div className="code-header">
              <div className="code-dots">
                <span />
                <span />
                <span />
              </div>
              <span className="code-title">upload.js</span>
            </div>
            <pre className="code-content">
              <code>
                <span className="code-comment">// Upload with UploadAura SDK</span>
                {"\n"}
                <span className="code-keyword">const</span> file ={" "}
                <span className="code-keyword">await</span> uploadAura.
                <span className="code-function">upload</span>(
                <span className="code-string">'./image.png'</span>);
                {"\n"}
                <span className="code-keyword">console</span>.
                <span className="code-function">log</span>(file.
                <span className="code-property">url</span>);
                {"\n"}
                <span className="code-comment">
                  // → https://cdn.uploadaura.dev/abc123.png
                </span>
              </code>
            </pre>
          </motion.div>
        </motion.div>

        {/* Floating file icons */}
        <div className="floating-icons">
          <motion.div
            className="float-icon"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ImageIcon size={24} />
          </motion.div>
          <motion.div
            className="float-icon"
            animate={{
              y: [0, -25, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <Film size={24} />
          </motion.div>
          <motion.div
            className="float-icon"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 3, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <FileCode size={24} />
          </motion.div>
          <motion.div
            className="float-icon"
            animate={{
              y: [0, -22, 0],
              rotate: [0, -4, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          >
            <FileArchive size={24} />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section id="features" className="features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Everything you need</span>
            <h2 className="section-title">Built for developers who ship fast</h2>
            <p className="section-description">
              Stop wrestling with AWS. Start building your product.
            </p>
          </div>

          <div className="features-grid">
            <FeatureCard
              icon={<Upload size={24} />}
              title="Simple Upload API"
              description="One SDK method. That's it. Upload files from Node, Python, Go, or plain REST."
              gradient="from-blue-500/20 to-cyan-500/20"
            />
            <FeatureCard
              icon={<Key size={24} />}
              title="API Key Management"
              description="Generate keys from the dashboard. Revoke instantly. No AWS IAM policies required."
              gradient="from-purple-500/20 to-pink-500/20"
            />
            <FeatureCard
              icon={<Zap size={24} />}
              title="Instant CDN URLs"
              description="Every file gets a permanent public URL the moment it lands. Copy, share, done."
              gradient="from-amber-500/20 to-orange-500/20"
            />
            <FeatureCard
              icon={<Shield size={24} />}
              title="Private Files"
              description="Flip any file or folder to private. Issue short-lived signed links on demand."
              gradient="from-green-500/20 to-emerald-500/20"
            />
            <FeatureCard
              icon={<BarChart3 size={24} />}
              title="Live Analytics"
              description="Storage, bandwidth, and API calls update in real-time. No second dashboard."
              gradient="from-red-500/20 to-rose-500/20"
            />
            <FeatureCard
              icon={<Code2 size={24} />}
              title="TypeScript First"
              description="Full type safety across SDK and API. Auto-complete in your editor."
              gradient="from-indigo-500/20 to-violet-500/20"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Three steps</span>
            <h2 className="section-title">From zero to production in minutes</h2>
          </div>

          <div className="steps">
            <Step
              number="01"
              title="Get your API key"
              description="Sign up, click generate. Copy your key from the dashboard."
              code={`curl -X POST https://api.uploadaura.dev/register \\
  -d '{"email":"you@example.com"}'`}
            />
            <Step
              number="02"
              title="Install the SDK"
              description="One command. Works with npm, pip, or go get."
              code={`npm install @uploadaura/sdk
# or: pip install uploadaura
# or: go get uploadaura.dev/sdk`}
            />
            <Step
              number="03"
              title="Upload your first file"
              description="Three lines of code. Returns a public CDN URL instantly."
              code={`import { UploadAura } from '@uploadaura/sdk';

const client = new UploadAura(process.env.API_KEY);
const file = await client.upload('./photo.jpg');
console.log(file.url); // Done!`}
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Simple pricing</span>
            <h2 className="section-title">Start free. Scale when ready.</h2>
          </div>

          <div className="pricing-cards">
            <PricingCard
              name="Free"
              price="$0"
              period="forever"
              features={[
                "2 GB storage",
                "100 MB per file",
                "Unlimited API keys",
                "Public & private files",
                "Community support",
              ]}
              cta="Get started"
              ctaHref="/register"
            />
