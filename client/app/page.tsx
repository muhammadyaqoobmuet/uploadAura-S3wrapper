import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";

const NOISE_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`;

export default function LandingPage() {
  return (
    <>
      {/* Fixed grain texture overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          pointerEvents: "none",
          backgroundImage: `url("${NOISE_SVG}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          opacity: 0.025,
        }}
      />

      <Navbar />

      <main>
        {/* Hero — uploadAura.png background + aa.png product screenshot */}
        <Hero />

        {/* Features grid */}
        <Features />

        {/* Product showcase — full-width aa.png with browser chrome */}
        <ProductShowcase />

        {/* How it works — 3 steps */}
        <HowItWorks />

        {/* Pricing — Free + Pro tiers */}
        <Pricing />
      </main>

      <Footer />
    </>
  );
}
