"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/config";
import { Product, MatchExplanation } from "@/types";
import MatchScoreBadge from "./MatchScoreBadge";

interface MainProductCardProps {
  product: Product;
  dosage: { dry: string; wet: string };
  matchScore: number;
  matchExplanations?: MatchExplanation[];
  onAddToCart: () => void;
}

export default function MainProductCard({
  product,
  dosage,
  matchScore,
  matchExplanations,
  onAddToCart,
}: MainProductCardProps) {
  const { t, locale } = useTranslation();

  const name = locale === "it" ? product.name : product.nameEn;
  const desc = locale === "it" ? product.desc : product.descEn;

  return (
    <motion.div
      className="bg-bg-card rounded-2xl border-2 border-border-dark p-6 my-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={product.img}
          alt={name}
          width={160}
          height={200}
          className="rounded-xl"
        />

        <div className="flex-1">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            {t.results.recommended}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-2xl font-black text-purina-red">{name}</h2>
            <span className="text-xl font-bold text-text-title">
              €{product.price.toFixed(2)}
            </span>
          </div>

          {/* Match score + explanations */}
          <div className="mt-3">
            <MatchScoreBadge score={matchScore} explanations={matchExplanations} />
          </div>

          <p className="text-text-body mt-3">{desc}</p>

          <p className="italic text-text-muted text-sm mt-4">
            💡 {t.results.tipLabel} {t.results.tipText}
          </p>

          <button
            onClick={onAddToCart}
            className="mt-4 bg-purina-red text-white font-bold py-3 px-6 rounded-full hover:bg-purina-red-hover transition"
          >
            {t.results.addToCart}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
