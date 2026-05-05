"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/config";
import { Product, DogProfile } from "@/types";
import type { FeedingPlan as FeedingPlanData } from "@/lib/feedingPlan";

interface FeedingPlanProps {
  profile: DogProfile;
  dryProduct: Product;
  wetProduct: Product | null;
  feedingPlan: FeedingPlanData;
  crossSell: Product[];
  onAddAllToCart: () => void;
}

export default function FeedingPlan({
  profile,
  dryProduct,
  wetProduct,
  feedingPlan,
  crossSell,
  onAddAllToCart,
}: FeedingPlanProps) {
  const { t, locale } = useTranslation();
  const name = profile.name || (locale === "it" ? "Il tuo cane" : "Your Dog");
  const getName = (p: Product) => (locale === "it" ? p.name : p.nameEn);

  // Per-meal split comes straight from the science module — no string parsing.
  const dryHalf = `${feedingPlan.dryGramsPerMealLow}–${feedingPlan.dryGramsPerMealHigh}`;
  const wetLabel =
    feedingPlan.wetPouches === 1
      ? "1 × 85g"
      : `${feedingPlan.wetPouches} × 85g`;

  // Find dental/treat in crossSell
  const dental = crossSell.find((p) => p.type === "care");
  const treat = crossSell.find((p) => p.type === "snack");

  const fp = t.feedingPlan;

  return (
    <motion.div
      className="mt-10 bg-bg-card rounded-2xl border-2 border-purina-red/30 overflow-hidden shadow-xl shadow-purina-red/5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purina-red to-purina-red-hover px-5 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">&#x1F963;</span>
          <div>
            <h3 className="text-white font-black text-base sm:text-lg">
              {fp.title}
            </h3>
            <p className="text-white/80 text-xs sm:text-sm font-medium">
              {fp.subtitle.replace("{name}", name)}
            </p>
          </div>
        </div>
      </div>

      {/* Daily totals strip — same numbers as the NutritionTable above */}
      <div className="grid grid-cols-2 divide-x divide-border-dark border-b border-border-dark bg-bg-card-hover/30">
        <div className="px-5 py-3">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            {fp.totalDryLabel}
          </p>
          <p className="text-purina-red font-black text-lg tabular-nums mt-0.5">
            {feedingPlan.dryGramsLow}&#x2013;{feedingPlan.dryGramsHigh}g
          </p>
        </div>
        <div className="px-5 py-3">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            {fp.totalEnergyLabel}
          </p>
          <p className="text-purina-red font-black text-lg tabular-nums mt-0.5">
            {feedingPlan.merKcal} kcal
          </p>
        </div>
      </div>

      {/* Meal Schedule */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Morning */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-lg">&#x2600;&#xFE0F;</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-text-title text-sm">{fp.morning}</p>
            <div className="flex items-center justify-between gap-3 mt-1">
              <div className="flex items-center gap-2 min-w-0">
                <Image
                  src={dryProduct.img}
                  alt={getName(dryProduct)}
                  width={32}
                  height={32}
                  className="rounded object-contain flex-shrink-0"
                />
                <p className="text-text-body text-xs leading-relaxed truncate">
                  {getName(dryProduct)}
                </p>
              </div>
              <span className="text-purina-red font-black text-base sm:text-lg tabular-nums flex-shrink-0">
                {dryHalf}g
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border-dark/50" />

        {/* Evening */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-lg">&#x1F319;</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-text-title text-sm">{fp.evening}</p>
            <div className="flex items-center justify-between gap-3 mt-1">
              <div className="flex items-center gap-2 min-w-0">
                <Image
                  src={dryProduct.img}
                  alt={getName(dryProduct)}
                  width={32}
                  height={32}
                  className="rounded object-contain flex-shrink-0"
                />
                <p className="text-text-body text-xs leading-relaxed truncate">
                  {getName(dryProduct)}
                </p>
              </div>
              <span className="text-purina-red font-black text-base sm:text-lg tabular-nums flex-shrink-0">
                {dryHalf}g
              </span>
            </div>
            {wetProduct && (
              <div className="flex items-center justify-between gap-3 mt-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Image
                    src={wetProduct.img}
                    alt={getName(wetProduct)}
                    width={32}
                    height={32}
                    className="rounded object-contain flex-shrink-0"
                  />
                  <p className="text-text-body text-xs leading-relaxed truncate">
                    {fp.wetSchedule.replace("{product}", getName(wetProduct))}
                  </p>
                </div>
                <span className="text-purina-red font-black text-base sm:text-lg tabular-nums flex-shrink-0">
                  {wetLabel}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Treats */}
        {(dental || treat) && (
          <>
            <div className="border-t border-border-dark/50" />
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-lg">&#x1F96C;</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-text-title text-sm">
                  {fp.treats}
                </p>
                {dental && (
                  <div className="flex items-center gap-2 mt-1">
                    <Image
                      src={dental.img}
                      alt={getName(dental)}
                      width={32}
                      height={32}
                      className="rounded object-contain"
                    />
                    <p className="text-text-body text-xs">
                      {getName(dental)}{" "}
                      <span className="text-text-muted">&mdash; {fp.dailyStick}</span>
                    </p>
                  </div>
                )}
                {treat && (
                  <div className="flex items-center gap-2 mt-1">
                    <Image
                      src={treat.img}
                      alt={getName(treat)}
                      width={32}
                      height={32}
                      className="rounded object-contain"
                    />
                    <p className="text-text-body text-xs">
                      {getName(treat)}{" "}
                      <span className="text-text-muted">
                        &mdash; {fp.trainingReward}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom insight banner */}
      <div className="bg-bg-card-hover/60 px-5 sm:px-6 py-4 border-t border-border-dark">
        <p className="text-text-body text-xs leading-relaxed italic">
          &#x1F4A1; {fp.insight}
        </p>
        <p className="text-[10px] text-text-muted leading-snug font-mono tabular-nums mt-2">
          {feedingPlan.formula}
        </p>
      </div>

      {/* Add all button */}
      <div className="px-5 sm:px-6 pb-5 pt-2">
        <button
          onClick={onAddAllToCart}
          className="w-full bg-purina-red hover:bg-purina-red-hover text-white font-bold py-3.5 rounded-full transition-all duration-200 text-sm hover:shadow-lg hover:shadow-purina-red/20 active:scale-[0.97]"
        >
          &#x1F6D2; {fp.addAll}
        </button>
      </div>
    </motion.div>
  );
}
