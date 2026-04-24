"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/config";
import { Product, DogProfile } from "@/types";

interface ShareCardProps {
  profile: DogProfile;
  product: Product;
  matchScore: number;
}

export default function ShareCard({
  profile,
  product,
  matchScore,
}: ShareCardProps) {
  const { t, locale } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [shared, setShared] = useState(false);
  const name = profile.name || (locale === "it" ? "Il tuo cane" : "Your Dog");
  const productName = locale === "it" ? product.name : product.nameEn;
  const sc = t.shareCard;

  const handleShare = async () => {
    // Try Web Share API (works on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: sc.shareTitle.replace("{name}", name),
          text: sc.shareText
            .replace("{name}", name)
            .replace("{score}", String(matchScore))
            .replace("{product}", productName),
          url: window.location.origin,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        /* user cancelled */
      }
    } else {
      // Fallback: copy text to clipboard
      const shareText = `${sc.shareText
        .replace("{name}", name)
        .replace("{score}", String(matchScore))
        .replace("{product}", productName)} ${window.location.origin}`;
      try {
        await navigator.clipboard.writeText(shareText);
      } catch {
        // Final fallback: use textarea trick for older browsers
        const ta = document.createElement("textarea");
        ta.value = shareText;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      {/* The Card — designed to look good as a screenshot */}
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-bg-card via-bg-card to-hover-red-bg/30 rounded-2xl border-2 border-purina-red/20 overflow-hidden shadow-xl"
      >
        {/* Top brand strip */}
        <div className="bg-purina-red px-5 py-2.5 flex items-center justify-between">
          <span className="text-white font-black text-xs tracking-wider">
            PURINA ONE &#x2022; ADVISOR
          </span>
          <span className="text-white/80 text-[10px]">purina.it</span>
        </div>

        <div className="p-5 sm:p-6">
          {/* Dog name + match */}
          <div className="text-center mb-4">
            <p className="text-text-muted text-[10px] uppercase tracking-[0.2em] font-bold">
              {sc.label}
            </p>
            <h3 className="text-text-title font-black text-xl sm:text-2xl mt-1">
              {name}
            </h3>
          </div>

          {/* Product + score circle */}
          <div className="flex items-center justify-center gap-5 my-4">
            <div className="w-[80px] h-[100px] bg-bg-card-hover/50 rounded-xl flex items-center justify-center">
              <Image
                src={product.img}
                alt={productName}
                width={70}
                height={90}
                className="object-contain drop-shadow-md"
              />
            </div>

            {/* Score ring */}
            <div className="relative w-20 h-20">
              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 80 80"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-border-dark"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="#E91C24"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={
                    2 * Math.PI * 34 * (1 - matchScore / 100)
                  }
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-purina-red font-black text-lg">
                  {matchScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Product name */}
          <p className="text-center text-purina-red font-bold text-sm">
            {productName}
          </p>

          {/* Profile summary row */}
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            {profile.lifestage && (
              <span className="text-[10px] bg-bg-card-hover px-2.5 py-1 rounded-full text-text-muted border border-border-dark">
                {profile.lifestage}
              </span>
            )}
            {profile.activity && (
              <span className="text-[10px] bg-bg-card-hover px-2.5 py-1 rounded-full text-text-muted border border-border-dark">
                {profile.activity}
              </span>
            )}
            <span className="text-[10px] bg-bg-card-hover px-2.5 py-1 rounded-full text-text-muted border border-border-dark">
              {profile.weight.toFixed(1)} kg
            </span>
          </div>

          {/* Tagline */}
          <p className="text-center text-text-muted text-[10px] mt-4 italic">
            {sc.tagline}
          </p>
        </div>
      </div>

      {/* Share / Screenshot button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-bg-card hover:bg-bg-card-hover border border-border-dark px-6 py-3 rounded-full transition-all duration-200 text-sm font-bold text-text-title active:scale-[0.97]"
        >
          {shared ? (
            <>
              <span className="text-green-400 text-lg">&#x2713;</span>
              <span className="text-green-400 font-bold">{sc.shared}</span>
            </>
          ) : (
            <>
              <span className="text-lg">&#x1F517;</span>
              <span>{sc.button}</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
