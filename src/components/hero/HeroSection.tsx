"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAdvisorStore } from "@/stores/useAdvisorStore";
import { useTranslation } from "@/i18n/config";
import type { PetType } from "@/types";

export default function HeroSection() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setName, setPetType, goToStep } = useAdvisorStore();
  const [selectedPet, setSelectedPet] = useState<PetType | null>(null);
  const [inputName, setInputName] = useState("");
  const [focused, setFocused] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedName = inputName.trim();

  const handleSelectPet = (pet: PetType) => {
    setSelectedPet(pet);
    setPetType(pet);
    // Focus the name input after a brief delay for animation
    setTimeout(() => inputRef.current?.focus(), 400);
  };

  const handleStart = () => {
    if (!selectedPet) return;
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
      {/* ── Subtle hero glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 40%, rgba(233,28,36,0.05) 0%, transparent 70%)",
        }}
      />
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
          <span className="text-text-muted text-[10px] sm:text-xs font-bold tracking-widest">ADVISOR</span>
        </motion.div>

        {/* Main tagline */}
        <motion.h1
          className="text-3xl sm:text-5xl md:text-7xl font-black leading-[1.1] mb-4 sm:mb-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <span className="text-text-title">{t.hero.taglineStart}</span>
          <span className="text-purina-red italic drop-shadow-[0_0_20px_rgba(233,28,36,0.3)]">
            {t.hero.taglineHighlight}
          </span>
          <span className="text-text-title">,</span>
          <br />
          <span className="text-text-title">{t.hero.taglineEnd}</span>
          <span className="text-purina-red italic drop-shadow-[0_0_20px_rgba(233,28,36,0.3)]">
            {t.hero.taglineBrand}
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

        {/* Subtitle */}
        <motion.div
          className="mb-8 sm:mb-10 max-w-xl mx-auto"
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

        {/* Continue Challenge Banner (for returning visitors) */}
        <AnimatePresence>
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════
            PET SELECTION — Dog or Cat with cute images
           ═══════════════════════════════════════════════════════ */}
        <motion.div
          className="w-full max-w-sm sm:max-w-md mx-auto mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label className="text-text-muted text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 block">
            {t.petSelect.title}
          </label>

          <div className="grid grid-cols-2 gap-4">
            {/* Dog Card */}
            <motion.button
              onClick={() => handleSelectPet("dog")}
              className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 group ${
                selectedPet === "dog"
                  ? "border-purina-red shadow-lg shadow-purina-red/25 scale-[1.02]"
                  : "border-border-dark hover:border-text-muted/50 shadow-md shadow-black/10"
              }`}
              whileHover={{ scale: selectedPet === "dog" ? 1.02 : 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="bg-bg-card p-3 sm:p-4">
                <div className="w-full aspect-square rounded-xl bg-bg-card-hover/60 overflow-hidden mb-3 relative">
                  <Image
                    src="/images/hero_dog.jpg"
                    alt="Dog"
                    fill
                    sizes="(max-width: 640px) 45vw, 200px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className={`font-black text-lg sm:text-xl transition-colors duration-200 ${
                  selectedPet === "dog" ? "text-purina-red" : "text-text-title"
                }`}>
                  {t.petSelect.dog} &#x1F436;
                </p>
              </div>
              {/* Selected indicator */}
              <AnimatePresence>
                {selectedPet === "dog" && (
                  <motion.div
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-purina-red flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="text-white text-sm font-bold">&#x2713;</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Cat Card */}
            <motion.button
              onClick={() => handleSelectPet("cat")}
              className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 group ${
                selectedPet === "cat"
                  ? "border-purina-red shadow-lg shadow-purina-red/25 scale-[1.02]"
                  : "border-border-dark hover:border-text-muted/50 shadow-md shadow-black/10"
              }`}
              whileHover={{ scale: selectedPet === "cat" ? 1.02 : 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="bg-bg-card p-3 sm:p-4">
                <div className="w-full aspect-square rounded-xl bg-bg-card-hover/60 overflow-hidden mb-3 relative">
                  <Image
                    src="/images/hero_cat.jpg"
                    alt="Cat"
                    fill
                    sizes="(max-width: 640px) 45vw, 200px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className={`font-black text-lg sm:text-xl transition-colors duration-200 ${
                  selectedPet === "cat" ? "text-purina-red" : "text-text-title"
                }`}>
                  {t.petSelect.cat} &#x1F431;
                </p>
              </div>
              <AnimatePresence>
                {selectedPet === "cat" && (
                  <motion.div
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-purina-red flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="text-white text-sm font-bold">&#x2713;</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════
            NAME INPUT — appears after pet is selected
           ═══════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {selectedPet && (
            <motion.div
              key="name-section"
              initial={{ opacity: 0, y: 30, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              {/* Name input */}
              <div className="w-full max-w-sm sm:max-w-md mx-auto mt-2">
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
              </div>

              {/* CTA Button */}
              <div className="mt-6 sm:mt-8">
                <button
                  onClick={handleStart}
                  className={`text-white font-bold text-base sm:text-lg py-4 px-10 sm:px-14 rounded-full transition-all duration-300 tracking-wide active:scale-[0.97] ${
                    trimmedName
                      ? "bg-purina-red hover:bg-purina-red-hover cursor-pointer shadow-lg shadow-purina-red/30 hover:shadow-xl hover:shadow-purina-red/40 hover:scale-105"
                      : "bg-purina-red/80 cursor-pointer shadow-lg shadow-purina-red/20"
                  }`}
                >
                  {t.hero.cta} &rarr;
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust indicators */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mt-10 sm:mt-14 text-text-muted text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-600/20 flex items-center justify-center text-green-500 text-[10px]">&#x2713;</span>
            {t.hero.trust1}
          </span>
          <span className="w-1 h-1 rounded-full bg-border-dark hidden sm:block" />
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-600/20 flex items-center justify-center text-green-500 text-[10px]">&#x2713;</span>
            {t.hero.trust2}
          </span>
          <span className="w-1 h-1 rounded-full bg-border-dark hidden sm:block" />
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-600/20 flex items-center justify-center text-green-500 text-[10px]">&#x2713;</span>
            {t.hero.trust3}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
