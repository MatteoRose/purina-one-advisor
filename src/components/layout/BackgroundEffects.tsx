"use client";

import { motion } from "framer-motion";

/**
 * Site-wide ambient background — uniform warm dark tone
 * with subtle depth and animated breathing glows.
 * Uses `fixed inset-0` so the background always fills the viewport.
 */
export default function BackgroundEffects() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* ── 1. Uniform warm dark base ──────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "#1A1315" }}
      />

      {/* ── 2. Very subtle center warmth — barely visible ──────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 150% 150% at 50% 50%, rgba(233,28,36,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── 3. Animated glow A — slow breathe upper-left ───────────── */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle 400px at 15% 30%, rgba(233,28,36,0.045) 0%, transparent 60%)",
        }}
      />

      {/* ── 4. Animated glow B — slow breathe lower-right ──────────── */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{
          background:
            "radial-gradient(circle 450px at 85% 70%, rgba(180,40,30,0.04) 0%, transparent 55%)",
        }}
      />

      {/* ── 5. Animated glow C — center breathe ────────────────────── */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        style={{
          background:
            "radial-gradient(circle 350px at 50% 50%, rgba(140,30,35,0.035) 0%, transparent 50%)",
        }}
      />

      {/* ── 6. Fine grain/noise texture ────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── 7. Soft vignette — very subtle edge darkening ──────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(0,0,0,0.12) 100%)",
        }}
      />
    </div>
  );
}
