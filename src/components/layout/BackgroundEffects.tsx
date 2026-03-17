"use client";

import { motion } from "framer-motion";

/**
 * Site-wide ambient background — renders behind every page.
 * Multiple radial gradients, mesh-like layers, animated glow spots,
 * noise texture, and warm undertones give the dark surface
 * visual depth and richness.
 *
 * Uses `fixed inset-0` so the layers always fill the full viewport
 * and scroll-content never "falls off" the background.
 */
export default function BackgroundEffects() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* ── 1. Base gradient ───────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 140% 140% at 50% 40%, #1F1518 0%, #181214 35%, #151012 70%, #121010 100%)",
        }}
      />

      {/* ── 2. Primary warm glow — upper center ───────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 18%, rgba(233,28,36,0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── 3. Deep burgundy wash — mid-left ─────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 15% 55%, rgba(120,20,30,0.08) 0%, transparent 65%)",
        }}
      />

      {/* ── 4. Dark amber wash — lower-right ─────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 80% 75%, rgba(160,80,20,0.08) 0%, transparent 65%)",
        }}
      />

      {/* ── 4b. Bottom-center warm fill — prevents dark falloff ─── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 50% at 50% 95%, rgba(140,40,30,0.10) 0%, transparent 60%)",
        }}
      />

      {/* ── 5. Secondary Purina-red accent — bottom-left ─────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 800px at 5% 85%, rgba(233,28,36,0.09) 0%, transparent 55%)",
        }}
      />

      {/* ── 6. Tertiary accent — top-right ───────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 600px at 95% 8%, rgba(233,28,36,0.06) 0%, transparent 50%)",
        }}
      />

      {/* ── 7. Warm mid-tone — center-right (depth) ──────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 70% 50%, rgba(180,80,50,0.04) 0%, transparent 60%)",
        }}
      />

      {/* ── 8. Cool counterbalance — mid-left ────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 500px at 12% 45%, rgba(59,130,246,0.025) 0%, transparent 50%)",
        }}
      />

      {/* ── 9. Subtle upper lift highlight ───────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 25% at 50% 3%, rgba(255,255,255,0.018) 0%, transparent 50%)",
        }}
      />

      {/* ── 10. Animated glow spot A — slow drift upper-left ─────── */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle 350px at 20% 25%, rgba(233,28,36,0.06) 0%, transparent 60%)",
        }}
      />

      {/* ── 11. Animated glow spot B — slow pulse lower-right ────── */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        style={{
          background:
            "radial-gradient(circle 400px at 80% 70%, rgba(200,50,40,0.05) 0%, transparent 55%)",
        }}
      />

      {/* ── 12. Animated glow spot C — center pulse ──────────────── */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        style={{
          background:
            "radial-gradient(circle 300px at 50% 50%, rgba(140,30,35,0.04) 0%, transparent 50%)",
        }}
      />

      {/* ── 13. Subtle dot pattern for texture ───────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle 1px at center, rgba(255,255,255,0.5) 0%, transparent 100%)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── 14. Fine grain/noise texture via SVG ─────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── 16. Vignette — darkens edges for focus ───────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 85% at 50% 45%, transparent 40%, rgba(0,0,0,0.18) 100%)",
        }}
      />
    </div>
  );
}
