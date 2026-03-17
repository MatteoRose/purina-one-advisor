"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAdvisorStore } from "@/stores/useAdvisorStore";
import { useTranslation } from "@/i18n/config";

export default function HeroSection() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setName, goToStep } = useAdvisorStore();
  const [inputName, setInputName] = useState("");
  const [focused, setFocused] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedName = inputName.trim();

  const handleStart = () => {
    if (!trimmedName) {
      setShaking(true);
      inputRef.current?.focus();
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setName(trimmedName);
    goToStep(1);
    router.push("/questionnaire");
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden pb-16">
      {/* ── Hero-specific gradient layers (on top of BackgroundEffects) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 65% at 50% 38%, rgba(233,28,36,0.14) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 18% 82%, rgba(233,28,36,0.07) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 82% 18%, rgba(233,28,36,0.05) 0%, transparent 40%)",
        }}
      />
      {/* Extra warm wash for the hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 70%, rgba(120,20,30,0.06) 0%, transparent 60%)",
        }}
      />
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative top accent */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purina-red to-transparent opacity-40"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-2xl text-center w-full">
        {/* Brand pill */}
        <motion.div
          className="inline-flex items-center gap-2 sm:gap-2.5 bg-bg-card/80 backdrop-blur-sm border border-border-dark rounded-full px-4 sm:px-6 py-2 sm:py-2.5 mb-8 sm:mb-10 shadow-lg shadow-black/10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        >
          <span className="text-purina-red font-black text-xs sm:text-sm tracking-wider">PURINA ONE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-purina-red" />
          <span className="text-text-muted text-[10px] sm:text-xs font-bold tracking-widest">MINI ADVISOR</span>
        </motion.div>

        {/* Main tagline */}
        <motion.h1
          className="text-3xl sm:text-5xl md:text-7xl font-black leading-[1.1] mb-4 sm:mb-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <span className="text-text-title">{t.hero.taglineStart ?? "Guided by "}</span>
          <span className="text-purina-red italic drop-shadow-[0_0_20px_rgba(233,28,36,0.3)]">
            {t.hero.taglineHighlight ?? "Nutrition"}
          </span>
          <span className="text-text-title">,</span>
          <br />
          <span className="text-text-title">{t.hero.taglineEnd ?? "Led by "}</span>
          <span className="text-purina-red italic drop-shadow-[0_0_20px_rgba(233,28,36,0.3)]">
            {t.hero.taglineBrand ?? "Purina"}
          </span>
          <span className="text-text-title">.</span>
        </motion.h1>

        {/* Decorative divider */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-4 sm:mb-5"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-purina-red/40" />
          <div className="w-2 h-2 rounded-full bg-purina-red/40" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-purina-red/40" />
        </motion.div>

        {/* Subtitle -- two lines */}
        <motion.div
          className="mb-8 sm:mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-text-muted text-xs sm:text-base md:text-lg leading-relaxed">
            {t.hero.subtitle}
          </p>
          <p className="text-purina-red text-xs sm:text-base md:text-lg font-bold italic mt-1.5 tracking-wide">
            {t.hero.subtitleAccent}
          </p>
        </motion.div>

        {/* Name input section */}
        <motion.div
          className="w-full max-w-sm sm:max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <label className="text-text-muted text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 block">
            {t.hero.question}
          </label>

          <div className={`relative rounded-2xl transition-shadow duration-300 ${shaking ? "animate-shake" : ""} ${
            focused ? "shadow-[0_0_40px_rgba(233,28,36,0.18)]" : "shadow-lg shadow-black/10"
          }`}>
            <input
              ref={inputRef}
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={t.hero.placeholder}
              className="w-full bg-bg-card border-2 border-border-dark rounded-2xl px-5 sm:px-6 py-4 sm:py-5 text-xl sm:text-2xl text-center text-text-title placeholder-text-muted focus:border-purina-red focus:outline-none transition-all duration-200 font-bold"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleStart();
              }}
            />
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <button
            onClick={handleStart}
            className={`text-white font-bold text-base sm:text-lg py-4 px-10 sm:px-14 rounded-full mt-6 sm:mt-8 transition-all duration-300 tracking-wide active:scale-[0.97] ${
              trimmedName
                ? "bg-purina-red hover:bg-purina-red-hover cursor-pointer shadow-lg shadow-purina-red/30 hover:shadow-xl hover:shadow-purina-red/40 hover:scale-105"
                : "bg-purina-red/80 cursor-pointer shadow-lg shadow-purina-red/20"
            }`}
          >
            {t.hero.cta} &rarr;
          </button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mt-10 sm:mt-14 text-text-muted text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-600/20 flex items-center justify-center text-green-500 text-[10px]">&#x2713;</span>
            {t.hero.trust1 ?? "Science-backed formulas"}
          </span>
          <span className="w-1 h-1 rounded-full bg-border-dark hidden sm:block" />
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-600/20 flex items-center justify-center text-green-500 text-[10px]">&#x2713;</span>
            {t.hero.trust2 ?? "Tailored to your dog"}
          </span>
          <span className="w-1 h-1 rounded-full bg-border-dark hidden sm:block" />
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-600/20 flex items-center justify-center text-green-500 text-[10px]">&#x2713;</span>
            {t.hero.trust3 ?? "100% complete nutrition"}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
