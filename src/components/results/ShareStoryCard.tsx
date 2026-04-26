"use client";

/**
 * ShareStoryCard — Spotify-Wrapped-style vertical 9:16 share card.
 *
 * Renders an in-app preview that animates section-by-section on "Generate".
 * Exports a 1080×1920 PNG via html-to-image, then offers Web Share API
 * (with file attachment when supported) so users can post directly to
 * Instagram / WhatsApp Stories from their phone.
 */

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { useTranslation } from "@/i18n/config";
import type { DogProfile, Product, DosageResult } from "@/types";
import { getStatsFor, type ScienceStat } from "@/lib/scienceStats";

interface ShareStoryCardProps {
  profile: DogProfile;
  product: Product;
  wetProduct: Product | null;
  dosage: DosageResult;
  matchScore: number;
}

export default function ShareStoryCard({
  profile,
  product,
  wetProduct,
  dosage,
  matchScore,
}: ShareStoryCardProps) {
  const { t, locale, interpolate } = useTranslation();
  const ss = t.shareStory;

  const cardRef = useRef<HTMLDivElement>(null);
  const [generated, setGenerated] = useState(false);
  const [busy, setBusy] = useState<"idle" | "saving" | "sharing">("idle");
  const [feedback, setFeedback] = useState<"saved" | "shared" | null>(null);

  const name = profile.name || (locale === "it" ? "Il tuo pet" : "Your Pet");
  const productName = locale === "it" ? product.name : product.nameEn;

  // Pre-compute 3 stats for this profile + product
  const stats = getStatsFor(profile, product, 3);

  // Per-meal dry split (e.g. "68–83g" → "34–42g")
  const dryHalf = dosage.dry
    .replace("g", "")
    .split("\u2013")
    .map((v) => Math.round(parseInt(v) / 2))
    .join("\u2013");

  // ───────────────────── Export to PNG ─────────────────────
  const exportPng = async (): Promise<{ dataUrl: string; file: File } | null> => {
    if (!cardRef.current) return null;
    // Render at 3× pixel density for crisp 1080×1920 output from a 360×640 source.
    const dataUrl = await htmlToImage.toPng(cardRef.current, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#0a0a0a",
    });
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `${name}-purina-wrapped.png`, {
      type: "image/png",
    });
    return { dataUrl, file };
  };

  const handleSave = async () => {
    setBusy("saving");
    try {
      const out = await exportPng();
      if (!out) return;
      const link = document.createElement("a");
      link.href = out.dataUrl;
      link.download = out.file.name;
      link.click();
      setFeedback("saved");
      setTimeout(() => setFeedback(null), 2200);
    } finally {
      setBusy("idle");
    }
  };

  const handleShareToStory = async () => {
    setBusy("sharing");
    try {
      const out = await exportPng();
      if (!out) return;
      // Web Share API with files — works on iOS Safari & Chrome Android.
      // Falls back to clipboard + download for desktop browsers.
      const navAny = navigator as Navigator & {
        canShare?: (data: { files: File[] }) => boolean;
      };
      if (navAny.canShare?.({ files: [out.file] }) && navigator.share) {
        await navigator.share({
          files: [out.file],
          title: interpolate(ss.storyHero, { name }),
          text: ss.footerUrl,
        });
        setFeedback("shared");
      } else {
        // Desktop fallback: download + copy URL
        const link = document.createElement("a");
        link.href = out.dataUrl;
        link.download = out.file.name;
        link.click();
        setFeedback("saved");
      }
      setTimeout(() => setFeedback(null), 2200);
    } catch {
      // user cancelled native share — silent
    } finally {
      setBusy("idle");
    }
  };

  return (
    <div className="mt-10">
      {/* Section heading + teaser */}
      <div className="text-center mb-4">
        <p className="text-purina-red text-sm font-bold tracking-wider">
          {ss.teaser.toUpperCase()}
        </p>
        <p className="text-text-muted text-xs mt-1">{ss.teaserSub}</p>
      </div>

      {/* ════════════ THE CARD ════════════
           Rendered at 360×640 in-app for preview, exported at 1080×1920
           (pixelRatio: 3). Aspect ratio is locked to 9:16 so it slots
           perfectly into IG / WhatsApp story canvas. */}
      <div className="relative mx-auto" style={{ width: 360, maxWidth: "100%" }}>
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl shadow-2xl shadow-purina-red/20"
          style={{
            width: 360,
            height: 640,
            background:
              "linear-gradient(180deg, #0a0a0a 0%, #1a0a0c 50%, #0a0a0a 100%)",
          }}
        >
          {/* ─── HERO ─── */}
          <motion.div
            className="relative px-5 pt-5 pb-4 bg-gradient-to-br from-purina-red via-rose-600 to-red-700"
            initial={{ opacity: 0, y: -20 }}
            animate={generated ? { opacity: 1, y: 0 } : { opacity: 0.85, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-[10px] font-black tracking-[0.25em]">
                  PURINA ONE
                </p>
                <p className="text-white/60 text-[8px] font-bold tracking-[0.2em]">
                  ADVISOR · {new Date().getFullYear()}
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/30">
                <span className="text-white text-[10px] font-black">
                  {interpolate(ss.matchPct, { score: String(matchScore) })}
                </span>
              </div>
            </div>

            <h2 className="text-white font-black text-2xl mt-3 leading-tight drop-shadow-md">
              {interpolate(ss.storyHero, { name: name.toUpperCase() })}
            </h2>

            <div className="mt-2 flex items-center gap-2">
              <div className="w-10 h-10 bg-white/15 rounded-lg flex-shrink-0 flex items-center justify-center backdrop-blur-sm border border-white/20 overflow-hidden">
                <Image
                  src={product.img}
                  alt={productName}
                  width={36}
                  height={36}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-[11px] truncate">
                  {productName}
                </p>
                <p className="text-white/70 text-[9px]">
                  {profile.lifestage} ·{" "}
                  {interpolate(ss.weight, { kg: profile.weight.toFixed(1) })}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ─── 3 BIG-NUMBER STAT CARDS (Spotify-Wrapped style) ─── */}
          <div className="px-4 py-3 space-y-2">
            <p className="text-white/50 text-[9px] font-black tracking-[0.2em] mb-1">
              {ss.sciSection.toUpperCase()}
            </p>
            {stats.map((stat, i) => (
              <StatCard
                key={stat.id}
                stat={stat}
                index={i}
                generated={generated}
                locale={locale}
              />
            ))}
          </div>

          {/* ─── FULL DAILY PLAN ─── */}
          <motion.div
            className="mx-4 mt-1 mb-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={
              generated ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 0 }
            }
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <p className="text-white/50 text-[9px] font-black tracking-[0.2em] mb-2">
              {ss.planSection.toUpperCase()}
            </p>

            <div className="grid grid-cols-2 gap-2 text-white">
              <div className="bg-amber-500/15 rounded-lg p-2 border border-amber-500/30">
                <p className="text-amber-300 text-[8px] font-black tracking-wider">
                  {ss.morning.toUpperCase()}
                </p>
                <p className="font-black text-base mt-0.5 tabular-nums">
                  {dryHalf}g
                </p>
                <p className="text-white/60 text-[8px]">{ss.dryFood}</p>
              </div>
              <div className="bg-indigo-500/15 rounded-lg p-2 border border-indigo-500/30">
                <p className="text-indigo-300 text-[8px] font-black tracking-wider">
                  {ss.evening.toUpperCase()}
                </p>
                <p className="font-black text-base mt-0.5 tabular-nums">
                  {dryHalf}g
                </p>
                <p className="text-white/60 text-[8px]">
                  {ss.dryFood}
                  {wetProduct ? ` + ${dosage.wet} ${ss.wetFood.toLowerCase()}` : ""}
                </p>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-baseline">
              <span className="text-white/60 text-[9px] font-bold tracking-wider">
                {ss.dryFood.toUpperCase()} {ss.perDay}
              </span>
              <span className="text-purina-red font-black text-sm tabular-nums">
                {dosage.dry}
              </span>
            </div>
            {wetProduct && (
              <div className="mt-1 flex justify-between items-baseline">
                <span className="text-white/60 text-[9px] font-bold tracking-wider">
                  {ss.wetFood.toUpperCase()} {ss.perDay}
                </span>
                <span className="text-purina-red font-black text-sm tabular-nums">
                  {dosage.wet}
                </span>
              </div>
            )}
          </motion.div>

          {/* ─── FOOTER ─── */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent px-5 py-3"
            initial={{ opacity: 0 }}
            animate={generated ? { opacity: 1 } : { opacity: 0.6 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-black text-[11px] tracking-tight">
                  {ss.footerCta}
                </p>
                <p className="text-white/60 text-[9px] font-mono">
                  {ss.footerUrl}
                </p>
              </div>
              <div className="text-right">
                <p className="text-purina-red font-black text-[10px] tracking-[0.2em]">
                  PURINA
                </p>
                <p className="text-white/80 font-black text-[10px] tracking-[0.2em]">
                  ONE
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ════════════ ACTIONS ════════════ */}
      <div className="mt-5 flex flex-col gap-2 max-w-sm mx-auto">
        {!generated ? (
          <button
            onClick={() => setGenerated(true)}
            className="bg-gradient-to-r from-purina-red via-rose-500 to-orange-500 text-white font-black py-3.5 rounded-full text-sm tracking-wide shadow-lg shadow-purina-red/30 hover:shadow-xl hover:shadow-purina-red/50 active:scale-[0.97] transition-all duration-200"
          >
            &#x2728; {ss.generateBtn}
          </button>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSave}
                disabled={busy !== "idle"}
                className="bg-bg-card border border-border-dark hover:bg-bg-card-hover text-text-title font-bold py-3 rounded-full text-xs tracking-wide active:scale-[0.97] transition-all duration-200 disabled:opacity-50"
              >
                {busy === "saving"
                  ? ss.sharing
                  : feedback === "saved"
                  ? `\u2713 ${ss.saved}`
                  : `\u2B07 ${ss.saveImage}`}
              </button>
              <button
                onClick={handleShareToStory}
                disabled={busy !== "idle"}
                className="bg-purina-red hover:bg-purina-red-hover text-white font-bold py-3 rounded-full text-xs tracking-wide shadow-md shadow-purina-red/20 active:scale-[0.97] transition-all duration-200 disabled:opacity-50"
              >
                {busy === "sharing"
                  ? ss.sharing
                  : feedback === "shared"
                  ? `\u2713 ${ss.shared}`
                  : `\uD83D\uDCF1 ${ss.shareToStory}`}
              </button>
            </div>
            <button
              onClick={() => {
                setGenerated(false);
                setTimeout(() => setGenerated(true), 50);
              }}
              className="text-text-muted hover:text-text-title text-xs underline underline-offset-2 mt-1"
            >
              {ss.regenerate}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// StatCard — one Spotify-Wrapped-style row inside the story
// ────────────────────────────────────────────────────────────────────
function StatCard({
  stat,
  index,
  generated,
  locale,
}: {
  stat: ScienceStat;
  index: number;
  generated: boolean;
  locale: string;
}) {
  const label = locale === "it" ? stat.labelIt : stat.labelEn;
  const caption = locale === "it" ? stat.captionIt : stat.captionEn;

  return (
    <AnimatePresence>
      <motion.div
        key={stat.id}
        className={`rounded-xl bg-gradient-to-br ${stat.gradient} p-3 shadow-lg`}
        initial={{ opacity: 0, scale: 0.85, y: 15 }}
        animate={
          generated
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0.5, scale: 0.95, y: 0 }
        }
        transition={{
          delay: 0.15 + index * 0.18,
          type: "spring",
          stiffness: 260,
          damping: 22,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-3xl leading-none tracking-tight tabular-nums drop-shadow-md">
              {stat.value}
            </p>
            <p className="text-white/95 font-black text-[10px] tracking-tight mt-0.5 leading-tight">
              {label}
            </p>
          </div>
          <span className="text-2xl flex-shrink-0">{stat.emoji}</span>
        </div>
        <p className="text-white/80 text-[8.5px] mt-1 leading-snug">
          {caption}
        </p>
        <p className="text-white/55 text-[7px] mt-1 italic">{stat.source}</p>
      </motion.div>
    </AnimatePresence>
  );
}
