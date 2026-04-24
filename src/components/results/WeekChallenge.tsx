"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/config";
import { useAdvisorStore } from "@/stores/useAdvisorStore";
import {
  ChallengeData,
  ChallengeChecks,
  loadChallenge,
  saveChallenge,
  startChallenge,
  getDaysSinceStart,
  getCurrentWeek,
  getTotalChecked,
} from "@/lib/challengeStore";
import { Product } from "@/types";

interface WeekChallengeProps {
  product?: Product;
  matchScore?: number;
}

export default function WeekChallenge({ product, matchScore }: WeekChallengeProps) {
  const { t } = useTranslation();
  const profile = useAdvisorStore((s) => s.profile);
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [celebrating, setCelebrating] = useState<string | null>(null);

  // Load on mount
  useEffect(() => {
    const data = loadChallenge();
    if (data) setChallenge(data);
    setLoaded(true);
  }, []);

  const handleStart = useCallback(() => {
    if (!product) return;
    const data = startChallenge(profile, product, matchScore ?? 0);
    setChallenge(data);
  }, [profile, product, matchScore]);

  const toggle = useCallback(
    (week: keyof ChallengeChecks, idx: number) => {
      if (!challenge) return;
      const arr = [...challenge.checks[week]];
      const wasChecked = arr[idx];
      arr[idx] = !arr[idx];
      const newChecks = { ...challenge.checks, [week]: arr };
      const updated = { ...challenge, checks: newChecks };
      setChallenge(updated);
      saveChallenge(updated);

      // Celebrate week completion
      if (!wasChecked) {
        const weekChecks = newChecks[week];
        if (weekChecks.every(Boolean)) {
          setCelebrating(week);
          setTimeout(() => setCelebrating(null), 2500);
        }
      }
    },
    [challenge]
  );

  const handleNotifications = useCallback(async () => {
    if (!challenge) return;
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        const updated = { ...challenge, notificationsEnabled: true };
        setChallenge(updated);
        saveChallenge(updated);
        new Notification("Purina ONE Challenge", {
          body: t.weekChallenge.notificationSet,
          icon: "/favicon.svg",
        });
      }
    }
  }, [challenge, t]);

  if (!loaded) return null;

  const wc = t.weekChallenge;

  // ── CTA State (not started) ──
  if (!challenge) {
    return (
      <motion.div
        className="mt-10 rounded-2xl overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {/* Gradient background */}
        <div className="relative bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500 p-6 sm:p-8">
          {/* Decorative circles */}
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/5" />
          <div className="absolute bottom-4 left-8 w-14 h-14 rounded-full bg-white/5" />

          <div className="relative text-center">
            <motion.span
              className="inline-block text-5xl mb-3"
              animate={{ rotate: [0, -10, 10, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            >
              &#x1F3AF;
            </motion.span>
            <h3 className="font-black text-white text-xl sm:text-2xl">
              {wc.ctaTitle}
            </h3>
            <p className="text-white/80 text-sm mt-2 max-w-md mx-auto leading-relaxed">
              {wc.ctaDesc}
            </p>

            {/* 3 preview steps */}
            <div className="flex justify-center gap-6 mt-6">
              {[
                { emoji: "\u26A1", label: wc.week1Short ?? "Energy" },
                { emoji: "\uD83C\uDF3F", label: wc.week2Short ?? "Digestion" },
                { emoji: "\u2728", label: wc.week3Short ?? "Coat" },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-1">
                    <span className="text-xl">{step.emoji}</span>
                  </div>
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleStart}
              className="mt-6 bg-white text-amber-700 font-black py-3.5 px-10 rounded-full text-sm hover:bg-amber-50 transition-all duration-200 shadow-lg shadow-black/15 active:scale-[0.97] hover:shadow-xl"
            >
              {wc.ctaButton} &#x2192;
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Active Challenge ──
  const totalChecked = getTotalChecked(challenge.checks);
  const progress = Math.round((totalChecked / 9) * 100);
  const daysSince = getDaysSinceStart(challenge);
  const currentWeek = getCurrentWeek(challenge);
  const isComplete = progress === 100;

  const weeks: {
    key: keyof ChallengeChecks;
    emoji: string;
    title: string;
    items: string[];
    weekNum: number;
  }[] = [
    { key: "week1", emoji: "\u26A1", title: wc.week1Title, items: wc.week1Items, weekNum: 1 },
    { key: "week2", emoji: "\uD83C\uDF3F", title: wc.week2Title, items: wc.week2Items, weekNum: 2 },
    { key: "week3", emoji: "\u2728", title: wc.week3Title, items: wc.week3Items, weekNum: 3 },
  ];

  return (
    <motion.div
      className="mt-10 bg-bg-card rounded-2xl border-2 border-amber-500/30 overflow-hidden shadow-xl shadow-amber-500/5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      {/* Header with progress */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-5 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">&#x1F3AF;</span>
            <div>
              <h3 className="text-white font-black text-sm sm:text-base">
                {wc.title}
              </h3>
              <p className="text-white/70 text-[10px]">
                {wc.dayLabel ?? "Day"} {daysSince + 1} &bull; {wc.subtitle}
              </p>
            </div>
          </div>
          <motion.div
            className="text-white font-black text-xl"
            key={progress}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
          >
            {progress}%
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2.5 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="flex justify-between px-8 py-4 bg-bg-card-hover/30 border-b border-border-dark">
        {weeks.map((w, i) => {
          const weekChecked = challenge.checks[w.key].filter(Boolean).length;
          const weekComplete = weekChecked === 3;
          const isCurrent = w.weekNum === currentWeek && !isComplete;

          return (
            <div key={w.key} className="flex items-center gap-0 flex-1">
              {/* Node */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 ${
                    weekComplete
                      ? "bg-green-500 text-white shadow-md shadow-green-500/30"
                      : isCurrent
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-400/50 ring-offset-2 ring-offset-bg-card"
                      : "bg-bg-card-hover border-2 border-border-dark text-text-muted"
                  }`}
                  animate={isCurrent ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {weekComplete ? "\u2713" : w.emoji}
                </motion.div>
                <span className={`text-[9px] font-bold mt-1 uppercase tracking-wider ${
                  weekComplete ? "text-green-400" : isCurrent ? "text-amber-400" : "text-text-muted"
                }`}>
                  {wc.weekLabel ?? "Week"} {w.weekNum}
                </span>
              </div>

              {/* Connector line */}
              {i < 2 && (
                <div className="flex-1 h-[2px] mx-2 mt-[-12px]">
                  <div
                    className={`h-full rounded-full transition-colors duration-500 ${
                      weekComplete ? "bg-green-500/60" : "bg-border-dark"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Weeks Content */}
      <div className="p-5 sm:p-6 space-y-6">
        {weeks.map(({ key, emoji, title, items, weekNum }) => {
          const weekChecked = challenge.checks[key].filter(Boolean).length;
          const weekComplete = weekChecked === 3;
          const isCurrent = weekNum === currentWeek && !isComplete;

          return (
            <div key={key}>
              {/* Week header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">{emoji}</span>
                  <h4 className={`font-bold text-sm ${
                    weekComplete ? "text-green-400" : "text-text-title"
                  }`}>
                    {title}
                  </h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  weekComplete
                    ? "bg-green-500/15 text-green-400 border border-green-500/20"
                    : "bg-bg-card-hover text-text-muted border border-border-dark"
                }`}>
                  {weekChecked}/3
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {items.map((item, idx) => {
                  const checked = challenge.checks[key][idx];
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => toggle(key, idx)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 text-xs ${
                        checked
                          ? "bg-green-500/10 border border-green-500/30 text-green-400"
                          : "bg-bg-card-hover/40 border border-border-dark text-text-body hover:border-amber-500/40 hover:bg-bg-card-hover/60"
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                          checked
                            ? "bg-green-500 text-white"
                            : "border-2 border-border-dark"
                        }`}
                        animate={checked ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {checked && (
                          <motion.span
                            className="text-xs font-bold"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            &#x2713;
                          </motion.span>
                        )}
                      </motion.div>
                      <span className={checked ? "line-through opacity-70" : ""}>
                        {item}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Week completion celebration */}
              <AnimatePresence>
                {celebrating === key && (
                  <motion.div
                    className="mt-3 bg-green-500/10 border border-green-500/25 rounded-xl py-3 px-4 text-center"
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  >
                    <span className="text-2xl">&#x1F389;</span>
                    <p className="text-green-400 font-bold text-xs mt-1">
                      {wc.weekComplete ?? "Week complete! Amazing progress!"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Notification Reminder */}
      {!challenge.notificationsEnabled && !isComplete && "Notification" in (typeof window !== "undefined" ? window : {}) && (
        <div className="px-5 sm:px-6 pb-4">
          <button
            onClick={handleNotifications}
            className="w-full flex items-center justify-center gap-2 bg-bg-card-hover/60 border border-border-dark py-3 rounded-xl text-text-muted text-xs font-bold hover:border-amber-500/40 hover:text-amber-400 transition-all duration-200"
          >
            <span>&#x1F514;</span>
            <span>{wc.remindMe ?? "Remind me to check back"}</span>
          </button>
        </div>
      )}

      {/* Full Completion */}
      {isComplete && (
        <motion.div
          className="bg-gradient-to-r from-green-500/15 to-green-500/5 border-t border-green-500/30 px-5 sm:px-6 py-5 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.span
            className="inline-block text-3xl"
            animate={{ rotate: [0, -10, 10, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            &#x1F389;
          </motion.span>
          <p className="text-green-400 font-black text-sm mt-2">
            {wc.complete}
          </p>
          <p className="text-text-muted text-[10px] mt-1">
            {wc.completeSubtext ?? "Your dog is thriving with Purina ONE!"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
