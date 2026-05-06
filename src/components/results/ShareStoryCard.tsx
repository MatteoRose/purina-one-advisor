"use client";

/**
 * ShareStoryCard — Spotify-Wrapped-style 9:16 share card.
 *
 * One-page layout: hero (product + match score) → 3 big-number stat cards
 * → footer. No daily plan (FeedingPlan lives separately on the results
 * page). Stat-card colors come from a rotating palette set so two pets
 * never share the same vibe; "Shuffle colors" cycles through PALETTES.
 *
 * Export: html-to-image at 3× → 1080×1920 PNG. Sharing prefers the Web
 * Share API with file attachment (mobile native share sheet → IG/WA
 * Stories, Save to Photos), falling back to a blob-URL download on
 * desktop. Blob URL + DOM-attached anchor is the only reliable path on
 * iOS Safari, where data-URL clicks silently navigate instead of saving.
 */

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { useTranslation } from "@/i18n/config";
import type { DogProfile, Product, DosageResult } from "@/types";
import { getStatsFor, type ScienceStat } from "@/lib/scienceStats";
import { PALETTES, paletteIndexFor } from "@/lib/palettes";

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
  dosage: _dosage,
  matchScore,
}: ShareStoryCardProps) {
  const { t, locale, interpolate } = useTranslation();
  const ss = t.shareStory;

  const cardRef = useRef<HTMLDivElement>(null);
  const [generated, setGenerated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<"saved" | "shared" | null>(null);

  // Deterministic starting palette per pet → same name = same opening vibe.
  // Shuffle cycles forward so users can iterate to a preferred set.
  const [paletteIndex, setPaletteIndex] = useState(() =>
    paletteIndexFor(profile.name || "default")
  );
  const palette = PALETTES[paletteIndex];

  const name = profile.name || (locale === "it" ? "Il tuo pet" : "Your Pet");
  const productName = locale === "it" ? product.name : product.nameEn;

  // Pre-compute 3 stats for this profile + product (priority-sorted).
  const stats = getStatsFor(profile, product, 3);

  // ───────────────────── Export ─────────────────────
  const exportPng = async (): Promise<{ blob: Blob; file: File } | null> => {
    if (!cardRef.current) return null;
    // 3× pixelRatio renders the 360×640 source DOM at a crisp 1080×1920.
    const dataUrl = await htmlToImage.toPng(cardRef.current, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#0a0a0a",
    });
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `${name}-purina-wrapped.png`, {
      type: "image/png",
    });
    return { blob, file };
  };

  /**
   * Single share/save handler.
   * Mobile: prefers Web Share API with file → native sheet exposes
   *         IG/WhatsApp/Save to Photos in one tap.
   * Desktop: downloads via blob URL + DOM-attached anchor (the only
   *          path that works reliably across Chrome/Firefox/Safari).
   */
  const handleShare = async () => {
    setBusy(true);
    try {
      const out = await exportPng();
      if (!out) return;

      const navAny = navigator as Navigator & {
        canShare?: (data: { files: File[] }) => boolean;
      };
      const canNativeShare =
        typeof navigator.share === "function" &&
        navAny.canShare?.({ files: [out.file] });

      if (canNativeShare) {
        try {
          await navigator.share({
            files: [out.file],
            title: interpolate(ss.storyHero, { name }),
            text: ss.footerUrl,
          });
          setFeedback("shared");
        } catch (err: unknown) {
          // AbortError = user dismissed the sheet — silent.
          const e = err as { name?: string };
          if (e?.name !== "AbortError") {
            // Real failure — fall back to download so the user still gets the PNG.
            triggerBlobDownload(out.blob, out.file.name);
            setFeedback("saved");
          }
        }
      } else {
        triggerBlobDownload(out.blob, out.file.name);
        setFeedback("saved");
      }
      setTimeout(() => setFeedback(null), 2200);
    } finally {
      setBusy(false);
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

      {/* ════════════ TEASER PLACEHOLDER (before user clicks Generate) ════════════
           Hides the actual card until after the reveal click — gives a "gift
           unboxing" moment instead of a sad faded preview. */}
      {!generated && (
        <motion.div
          className="relative mx-auto cursor-pointer"
          style={{ width: 360, maxWidth: "100%" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setGenerated(true)}
        >
          <div
            className="relative overflow-hidden rounded-3xl shadow-2xl shadow-purina-red/30"
            style={{
              width: 360,
              maxWidth: "100%",
              height: 320,
              background:
                "linear-gradient(135deg, #0a0a0a 0%, #1a0a0c 50%, #0a0a0a 100%)",
            }}
          >
            {/* Animated red glow that breathes */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "radial-gradient(circle 280px at 50% 50%, rgba(233,28,36,0.35) 0%, transparent 70%)",
              }}
            />
            {/* Subtle grain texture */}
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
              }}
            />

            {/* Centered content */}
            <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
              <motion.span
                className="text-5xl mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {"✨"}
              </motion.span>
              <p className="text-[10px] font-black tracking-[0.42em] text-white/70 mb-1">
                PURINA&nbsp;&nbsp;ONE
              </p>
              <h3 className="text-white font-black text-2xl leading-tight tracking-tight">
                {interpolate(ss.storyHero, { name: name.toUpperCase() })}
              </h3>
              <p className="text-purina-red font-black text-[11px] tracking-[0.3em] mt-1">
                KIN&nbsp;ADVISOR&nbsp;WRAPPED
              </p>
              <div className="h-px w-16 bg-purina-red/60 mt-3 mb-3" />
              <p className="text-white/75 text-xs max-w-[260px] leading-snug">
                {ss.teaserSub}
              </p>

              {/* CTA button INSIDE the box */}
              <div className="mt-5 bg-gradient-to-r from-purina-red via-rose-500 to-orange-500 text-white font-black py-3 px-7 rounded-full text-sm tracking-wide shadow-lg shadow-purina-red/40">
                {"✨"} {ss.generateBtn}
              </div>
              <p className="text-white/40 text-[10px] mt-3 italic">
                Guided by Nutrition. Led by Purina.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════ THE CARD (360×640 source → 1080×1920 PNG) ════════════
           Only rendered AFTER generated=true so it can spring in dramatically. */}
      {generated && (
      <div className="relative mx-auto" style={{ width: 360, maxWidth: "100%" }}>
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl shadow-2xl shadow-purina-red/20"
          style={{
            width: 360,
            height: 640,
            background: palette.bg,
          }}
        >
          {/* ─── HERO: product + match score (the emphasized recommendation) ─── */}
          <motion.div
            className="relative px-5 pt-5 pb-5 bg-gradient-to-br from-purina-red via-rose-600 to-red-700"
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
                <span className="text-white text-[9px] font-black tracking-wider">
                  {ss.perfectMatch}
                </span>
              </div>
            </div>

            {/* BIG pet name */}
            <h2 className="text-white font-black text-4xl mt-2 leading-none tracking-tight drop-shadow-md">
              {interpolate(ss.storyHero, { name: name.toUpperCase() })}
            </h2>
            <p className="text-white/85 text-[10px] mt-0.5 font-medium">
              {ss.storyHeroSub}
            </p>

            {/* HERO product card — bigger image, score loud */}
            <div className="mt-3 flex items-center gap-3 bg-white/12 backdrop-blur-sm rounded-2xl p-2.5 border border-white/20">
              <div className="w-[72px] h-[72px] bg-white/95 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden shadow-md">
                <Image
                  src={product.img}
                  alt={productName}
                  width={64}
                  height={64}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-black text-xs leading-tight">
                  {productName}
                </p>
                <p className="text-white/75 text-[9px] mt-1">
                  {profile.lifestage} ·{" "}
                  {interpolate(ss.weight, { kg: profile.weight.toFixed(1) })}
                </p>
                <div className="mt-1.5 inline-flex items-baseline gap-1">
                  <span className="text-white font-black text-2xl leading-none tabular-nums drop-shadow-sm">
                    {matchScore}%
                  </span>
                  <span className="text-white/80 text-[9px] font-bold uppercase tracking-wider">
                    match
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── 3 BIG-NUMBER STAT CARDS — palette-driven gradients ─── */}
          <div className="px-4 pt-3 pb-4 space-y-2">
            <p className="text-white/55 text-[9px] font-black tracking-[0.2em] mb-1">
              {ss.sciSection.toUpperCase()}
            </p>
            {stats.map((stat, i) => (
              <StatCard
                key={`${stat.id}-${paletteIndex}`}
                stat={stat}
                gradient={palette.cards[i] ?? palette.cards[0]}
                index={i}
                generated={generated}
                locale={locale}
              />
            ))}
          </div>

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

      )}

      {/* ════════════ ACTIONS — only after generation ════════════ */}
      {generated && (
        <div className="mt-5 flex flex-col gap-2 max-w-sm mx-auto">
            <button
              onClick={handleShare}
              disabled={busy}
              className="bg-purina-red hover:bg-purina-red-hover text-white font-bold py-3.5 rounded-full text-sm tracking-wide shadow-md shadow-purina-red/20 active:scale-[0.97] transition-all duration-200 disabled:opacity-50"
            >
              {busy
                ? ss.sharing
                : feedback === "shared"
                ? `\u2713 ${ss.shared}`
                : feedback === "saved"
                ? `\u2713 ${ss.saved}`
                : `\uD83D\uDCF1 ${ss.shareCta}`}
            </button>
            <button
              onClick={() =>
                setPaletteIndex((idx) => (idx + 1) % PALETTES.length)
              }
              className="text-text-muted hover:text-text-title text-xs underline underline-offset-2 mt-1"
            >
              {ss.regenerate}
            </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Helper: cross-browser blob-URL download.
// iOS Safari refuses to download data: URLs from synthetic clicks but
// happily accepts blob: URLs; Firefox additionally requires the anchor
// to be in the DOM at click time. This satisfies both.
// ────────────────────────────────────────────────────────────────────
function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revoke so Safari has time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// ────────────────────────────────────────────────────────────────────
// StatCard — one Spotify-Wrapped-style row inside the story
// ────────────────────────────────────────────────────────────────────
function StatCard({
  stat,
  gradient,
  index,
  generated,
  locale,
}: {
  stat: ScienceStat;
  gradient: string;
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
        className={`rounded-xl bg-gradient-to-br ${gradient} p-3 shadow-lg`}
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
            <p className="text-white font-black text-5xl leading-none tracking-tight tabular-nums drop-shadow-md">
              {stat.value}
            </p>
            <p className="text-white/95 font-black text-[11px] tracking-tight mt-1.5 leading-tight">
              {label}
            </p>
          </div>
          <span className="text-3xl flex-shrink-0">{stat.emoji}</span>
        </div>
        <p className="text-white/85 text-[9px] mt-1.5 leading-snug">
          {caption}
        </p>
        <p className="text-white/55 text-[7.5px] mt-1 italic">{stat.source}</p>
      </motion.div>
    </AnimatePresence>
  );
}
