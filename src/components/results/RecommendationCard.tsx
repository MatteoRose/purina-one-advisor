"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/config";
import { ScoredRecommendation } from "@/types";
import MatchScoreBadge from "./MatchScoreBadge";

interface RecommendationCardProps {
  rec: ScoredRecommendation;
  rank: number;
  onAddToCart: () => void;
}

export default function RecommendationCard({ rec, rank, onAddToCart }: RecommendationCardProps) {
  const { t, locale } = useTranslation();

  const name = locale === "it" ? rec.product.name : rec.product.nameEn;
  const desc = locale === "it" ? rec.product.desc : rec.product.descEn;
  const reasons = locale === "it" ? rec.reasonsIt : rec.reasons;

  const isPrimary = rank === 0;

  return (
    <motion.div
      className={`rounded-2xl border-2 overflow-hidden ${
        isPrimary
          ? "border-purina-red bg-gradient-to-br from-bg-card via-bg-card to-hover-red-bg/20 shadow-2xl shadow-purina-red/15"
          : "bg-bg-card border-border-dark shadow-lg shadow-black/25 hover:border-text-muted/50 transition-all duration-200 hover:shadow-xl hover:shadow-black/20"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.15 }}
    >
      {/* Top accent bar for primary */}
      {isPrimary && (
        <div className="h-1 bg-gradient-to-r from-purina-red via-purina-red to-transparent" />
      )}

      <div className="p-5">
        {/* Label */}
        <div className="flex items-center gap-2 mb-4">
          {isPrimary ? (
            <span className="bg-purina-red text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase flex items-center gap-1.5 shadow-md shadow-purina-red/20">
              <span className="text-sm">&#x2B50;</span> {t.results.recommended}
            </span>
          ) : (
            <span className="bg-bg-card-hover text-text-muted text-[10px] font-bold px-3 py-1 rounded-full uppercase border border-border-dark">
              #{rank + 1} &mdash; {t.results.alsoRecommended ?? "Also Recommended"}
            </span>
          )}
        </div>

        <div className={`flex ${isPrimary ? "flex-col md:flex-row" : "flex-row"} gap-5`}>
          {/* Product Image */}
          <div className={`flex-shrink-0 bg-bg-card-hover/60 rounded-xl flex items-center justify-center shadow-inner ${
            isPrimary ? "w-[180px] h-[220px] self-center md:self-start" : "w-[100px] h-[100px]"
          }`}>
            <Image
              src={rec.product.img}
              alt={name}
              width={isPrimary ? 150 : 85}
              height={isPrimary ? 190 : 85}
              className="rounded-xl object-contain drop-shadow-md"
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + Price row */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <h3 className={`font-black text-purina-red ${isPrimary ? "text-2xl" : "text-lg"}`}>
                {name}
              </h3>
              <span className={`font-bold text-text-title ${isPrimary ? "text-xl" : "text-base"}`}>
                &euro;{rec.product.price.toFixed(2)}
              </span>
            </div>

            {/* Match Score Badge */}
            <div className="mt-3">
              <MatchScoreBadge score={rec.matchScore} explanations={rec.matchExplanations} />
            </div>

            {/* Description */}
            <p className={`text-text-body mt-3 leading-relaxed ${isPrimary ? "text-sm" : "text-xs"}`}>{desc}</p>

            {/* Reasons */}
            {reasons.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {reasons.map((reason, i) => (
                  <span key={i} className="text-xs text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full flex items-center gap-1 border border-green-400/20">
                    <span className="font-bold">&#x2713;</span> {reason}
                  </span>
                ))}
              </div>
            )}

            {/* Dosage info for primary */}
            {isPrimary && (
              <div className="mt-4 p-3 bg-bg-card-hover/40 rounded-lg border border-border-dark">
                <p className="text-text-muted text-xs leading-relaxed">
                  <span className="text-purina-red font-bold">{t.results.tipLabel}</span> {t.results.tipText}
                </p>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={onAddToCart}
              className={`mt-4 bg-purina-red text-white font-bold rounded-full hover:bg-purina-red-hover transition-all duration-200 hover:shadow-lg hover:shadow-purina-red/20 active:scale-[0.97] ${
                isPrimary ? "py-3 px-8 text-sm" : "py-2 px-5 text-xs"
              }`}
            >
              {t.results.addToCart}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
