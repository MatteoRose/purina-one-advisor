"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/config";

interface CheckState {
  week1: boolean[];
  week2: boolean[];
  week3: boolean[];
}

const STORAGE_KEY = "purina-3week-challenge";

const defaultState: CheckState = {
  week1: [false, false, false],
  week2: [false, false, false],
  week3: [false, false, false],
};

export default function WeekChallenge() {
  const { t } = useTranslation();
  const [started, setStarted] = useState(false);
  const [checks, setChecks] = useState<CheckState>(defaultState);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setChecks(parsed.checks ?? defaultState);
        setStarted(parsed.started ?? false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (started) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ started, checks })
      );
    }
  }, [started, checks]);

  const toggle = (week: keyof CheckState, idx: number) => {
    setChecks((prev) => {
      const arr = [...prev[week]];
      arr[idx] = !arr[idx];
      return { ...prev, [week]: arr };
    });
  };

  const totalChecked = [
    ...checks.week1,
    ...checks.week2,
    ...checks.week3,
  ].filter(Boolean).length;
  const progress = Math.round((totalChecked / 9) * 100);

  const wc = t.weekChallenge;

  if (!started) {
    return (
      <motion.div
        className="mt-8 bg-bg-card rounded-2xl border-2 border-amber-500/30 overflow-hidden shadow-lg shadow-amber-500/5"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="p-5 sm:p-6 text-center">
          <span className="text-4xl">&#x1F3AF;</span>
          <h3 className="font-black text-text-title text-lg mt-3">
            {wc.ctaTitle}
          </h3>
          <p className="text-text-muted text-sm mt-2 max-w-md mx-auto leading-relaxed">
            {wc.ctaDesc}
          </p>
          <button
            onClick={() => setStarted(true)}
            className="mt-5 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 text-sm hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.97]"
          >
            {wc.ctaButton}
          </button>
        </div>
      </motion.div>
    );
  }

  const weeks: { key: keyof CheckState; emoji: string; title: string; items: string[] }[] = [
    {
      key: "week1",
      emoji: "\u26A1",
      title: wc.week1Title,
      items: wc.week1Items,
    },
    {
      key: "week2",
      emoji: "\uD83C\uDF3F",
      title: wc.week2Title,
      items: wc.week2Items,
    },
    {
      key: "week3",
      emoji: "\u2728",
      title: wc.week3Title,
      items: wc.week3Items,
    },
  ];

  return (
    <motion.div
      className="mt-8 bg-bg-card rounded-2xl border-2 border-amber-500/30 overflow-hidden shadow-lg shadow-amber-500/5"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-5 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">&#x1F3AF;</span>
            <div>
              <h3 className="text-white font-black text-sm sm:text-base">
                {wc.title}
              </h3>
              <p className="text-white/80 text-xs">{wc.subtitle}</p>
            </div>
          </div>
          <div className="text-white font-black text-lg">{progress}%</div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Weeks */}
      <div className="p-5 sm:p-6 space-y-5">
        {weeks.map(({ key, emoji, title, items }) => (
          <div key={key}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{emoji}</span>
              <h4 className="font-bold text-text-title text-sm">{title}</h4>
            </div>
            <div className="space-y-2">
              {items.map((item, idx) => {
                const checked = checks[key][idx];
                return (
                  <button
                    key={idx}
                    onClick={() => toggle(key, idx)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-200 text-xs ${
                      checked
                        ? "bg-green-500/10 border border-green-500/30 text-green-400"
                        : "bg-bg-card-hover/40 border border-border-dark text-text-body hover:border-amber-500/40"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                        checked
                          ? "bg-green-500 text-white"
                          : "border-2 border-border-dark"
                      }`}
                    >
                      {checked && (
                        <span className="text-xs font-bold">&#x2713;</span>
                      )}
                    </div>
                    <span className={checked ? "line-through opacity-70" : ""}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Completion message */}
      {progress === 100 && (
        <div className="bg-green-500/10 border-t border-green-500/30 px-5 sm:px-6 py-4 text-center">
          <span className="text-2xl">&#x1F389;</span>
          <p className="text-green-400 font-bold text-sm mt-1">
            {wc.complete}
          </p>
        </div>
      )}
    </motion.div>
  );
}
