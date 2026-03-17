"use client";

/**
 * Site-wide ambient background — renders behind every page.
 * Multiple radial gradients + a subtle dot pattern give the flat
 * dark (#111) surface visual depth without competing with content.
 */
export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden>
      {/* Primary warm glow — upper-center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 25%, rgba(233,28,36,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Secondary accent — bottom-left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 600px at 10% 90%, rgba(233,28,36,0.04) 0%, transparent 60%)",
        }}
      />

      {/* Tertiary accent — top-right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 500px at 90% 15%, rgba(233,28,36,0.035) 0%, transparent 55%)",
        }}
      />

      {/* Cool-tone counterbalance — mid-right (prevents all-red monotony) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 400px at 85% 60%, rgba(59,130,246,0.015) 0%, transparent 50%)",
        }}
      />

      {/* Subtle dot pattern for texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle 1px at center, rgba(255,255,255,0.4) 0%, transparent 100%)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Vignette — darkens the edges to draw focus to the center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.15) 100%)",
        }}
      />
    </div>
  );
}
