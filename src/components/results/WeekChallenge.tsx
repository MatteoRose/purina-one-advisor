"use client";

/**
 * WeekChallenge → "Win a Gadget" email-capture mock.
 *
 * Replaces the former 3-week interactive challenge with a single-tap
 * email signup framed as "subscribe to weekly surveys, win a gadget".
 * No email is actually sent — the submit is a faux network call that
 * resolves into a confirmation state. Keeps the amber/orange visual
 * language so it slots into the existing results-page rhythm.
 *
 * Props are kept (product, matchScore) but unused — preserves the
 * existing call site contract in `app/results/page.tsx`.
 */

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/config";
import type { Product } from "@/types";

interface WeekChallengeProps {
  product?: Product;
  matchScore?: number;
}

type Status = "idle" | "submitting" | "done" | "error";

// RFC-5322-lite email check — good enough for client-side UX feedback.
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function WeekChallenge(_props: WeekChallengeProps) {
  const { t } = useTranslation();
  const wc = t.weekChallenge;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    // Fake latency so the spring transition reads as "real submit".
    // No network request is made — the email is intentionally discarded.
    await new Promise((r) => setTimeout(r, 700));
    setStatus("done");
  };

  return (
    <motion.div
      className="mt-10 rounded-2xl overflow-hidden shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="relative bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500 p-6 sm:p-8">
        {/* Decorative circles — same visual language as the old challenge CTA */}
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/5" />
        <div className="absolute bottom-4 left-8 w-14 h-14 rounded-full bg-white/5" />

        <div className="relative">
          <AnimatePresence mode="wait">
            {status !== "done" ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <motion.span
                  className="inline-block text-5xl mb-3"
                  animate={{ rotate: [0, -8, 8, -4, 0], y: [0, -2, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.5 }}
                >
                  {"🎁"}
                </motion.span>
                <h3 className="font-black text-white text-xl sm:text-2xl drop-shadow-sm">
                  {wc.gadgetTitle}
                </h3>
                <p className="text-white/85 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                  {wc.gadgetDesc}
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
                  noValidate
                >
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder={wc.gadgetEmailPlaceholder}
                    aria-label={wc.gadgetEmailPlaceholder}
                    aria-invalid={status === "error"}
                    disabled={status === "submitting"}
                    className={`flex-1 px-5 py-3 rounded-full bg-white/95 text-amber-900 placeholder:text-amber-700/50 text-sm font-medium outline-none transition-all duration-200 shadow-inner ${
                      status === "error"
                        ? "ring-2 ring-red-500/90 animate-shake"
                        : "focus:ring-2 focus:ring-white/80"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="bg-white text-amber-700 font-black py-3 px-7 rounded-full text-sm hover:bg-amber-50 transition-all duration-200 shadow-lg shadow-black/15 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {status === "submitting"
                      ? wc.gadgetSubmitting
                      : `${wc.gadgetSubmit} →`}
                  </button>
                </form>

                <AnimatePresence>
                  {status === "error" && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-white text-xs mt-3 font-semibold"
                    >
                      {wc.gadgetInvalidEmail}
                    </motion.p>
                  )}
                </AnimatePresence>

                <p className="text-white/60 text-[10px] mt-4 max-w-xs mx-auto">
                  {wc.gadgetDisclaimer}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="text-center py-2"
              >
                <motion.div
                  className="mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3 shadow-lg shadow-black/15"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                    delay: 0.05,
                  }}
                >
                  <motion.span
                    className="text-amber-600 text-3xl font-black"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 320 }}
                  >
                    {"✓"}
                  </motion.span>
                </motion.div>
                <h3 className="font-black text-white text-xl sm:text-2xl drop-shadow-sm">
                  {wc.gadgetConfirmTitle}
                </h3>
                <p className="text-white/90 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                  {wc.gadgetConfirmDesc}
                </p>
                <motion.p
                  className="text-white/70 text-xs mt-3 font-mono break-all"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {email}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
