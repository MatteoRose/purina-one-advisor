"use client";
/* Results page — includes FeedingPlan, WeekChallenge, ShareCard, 10% discount */
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAdvisorStore } from "@/stores/useAdvisorStore";
import { useTranslation } from "@/i18n/config";
import { getRecommendation } from "@/lib/recommendation";
import RecommendationCard from "@/components/results/RecommendationCard";
import NutritionTable from "@/components/results/NutritionTable";
import MiniProductCard from "@/components/results/MiniProductCard";
import FeedingPlan from "@/components/results/FeedingPlan";
import WeekChallenge from "@/components/results/WeekChallenge";
import ShareCard from "@/components/results/ShareCard";

export default function ResultsPage() {
  const router = useRouter();
  const { t, locale, interpolate } = useTranslation();
  const profile = useAdvisorStore((s) => s.profile);
  const addToCart = useAdvisorStore((s) => s.addToCart);
  const reset = useAdvisorStore((s) => s.reset);

  useEffect(() => {
    if (!profile.lifestage) {
      router.push("/");
    }
  }, [profile.lifestage, router]);

  const result = useMemo(() => {
    if (!profile.lifestage) return null;
    return getRecommendation(profile);
  }, [profile]);

  if (!result || result.recommendations.length === 0) return null;

  const displayName = profile.name;
  const primary = result.recommendations[0];
  const others = result.recommendations.slice(1);

  const getName = (p: { name: string; nameEn: string }) =>
    locale === "it" ? p.name : p.nameEn;

  return (
    <div className="relative min-h-screen">
      {/* Page-specific accent gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 35% at 30% 15%, rgba(233,28,36,0.07) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle 500px at 85% 60%, rgba(120,20,30,0.04) 0%, transparent 55%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Section Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-purina-red text-sm font-bold tracking-wider">{t.results.heading}</p>
          <h1 className="text-2xl sm:text-3xl font-black text-text-title mt-1">
            {interpolate(t.results.subheading, { name: displayName.toUpperCase() })}
          </h1>
          <div className="h-0.5 w-16 bg-purina-red rounded-full mt-3" />
        </motion.div>

        {/* #1 -- Best Match */}
        <RecommendationCard
          rec={primary}
          rank={0}
          onAddToCart={() => addToCart(primary.product.id)}
        />

        {/* Nutrition Table (for best match) */}
        <NutritionTable profile={profile} dosage={primary.dosage} />

        {/* Wet Food for primary */}
        {primary.wet && (
          <motion.div
            className="bg-bg-card rounded-xl border border-border-dark border-l-4 border-l-blue-500/60 overflow-hidden mt-6 shadow-md shadow-black/5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-bg-card-hover/60 px-5 py-3 border-b border-border-dark">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                {t.results.wetTitle}
              </h3>
            </div>
            <div className="flex gap-5 p-5">
              <div className="w-[80px] h-[80px] flex-shrink-0 bg-bg-card-hover/40 rounded-lg flex items-center justify-center">
                <Image
                  src={primary.wet.img}
                  alt={getName(primary.wet)}
                  width={70}
                  height={70}
                  className="rounded-lg object-contain drop-shadow-sm"
                />
              </div>
              <div className="flex-1">
                <p className="font-bold text-text-title">{getName(primary.wet)}</p>
                <p className="text-sm font-bold text-purina-red mt-0.5">
                  &euro;{primary.wet.price.toFixed(2)}
                </p>
                <p className="text-xs text-text-muted mt-2 leading-relaxed">
                  &#x1F4A1; {t.results.wetTip}
                </p>
                <button
                  onClick={() => addToCart(primary.wet!.id)}
                  className="mt-3 bg-purina-red hover:bg-purina-red-hover text-white text-xs font-bold py-2 px-5 rounded-full transition-all duration-200 hover:shadow-md hover:shadow-purina-red/20 active:scale-[0.97]"
                >
                  {t.results.addToCart}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* #2 and #3 -- Also Recommended */}
        {others.length > 0 && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
              {t.results.alsoRecommended ?? "Also Recommended"}
            </h2>
            <div className="flex flex-col gap-4">
              {others.map((rec, i) => (
                <RecommendationCard
                  key={rec.product.id}
                  rec={rec}
                  rank={i + 1}
                  onAddToCart={() => addToCart(rec.product.id)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Cross-sell Section */}
        {result.crossSell.length > 0 && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
              {t.results.crossSellTitle}
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              {result.crossSell.map((product) => (
                <MiniProductCard
                  key={product.id}
                  product={product}
                  tag={
                    product.type === "care"
                      ? t.results.oralCare
                      : t.results.treatSnack
                  }
                  onAddToCart={() => addToCart(product.id)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Personalized Feeding Plan */}
        <FeedingPlan
          profile={profile}
          dryProduct={primary.product}
          wetProduct={primary.wet}
          dosage={primary.dosage}
          crossSell={result.crossSell}
          onAddAllToCart={() => {
            addToCart(primary.product.id);
            if (primary.wet) addToCart(primary.wet.id);
            result.crossSell.forEach((p) => addToCart(p.id));
          }}
        />

        {/* 3 Week Challenge */}
        <WeekChallenge />

        {/* Shareable Results Card */}
        <ShareCard
          profile={profile}
          product={primary.product}
          matchScore={primary.matchScore}
        />

        {/* Footer Navigation */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-14 pt-6 border-t border-border-dark">
          <button
            onClick={() => {
              reset();
              router.push("/");
            }}
            className="text-text-muted hover:text-text-title font-medium transition-colors duration-200"
          >
            &larr; {t.results.restart}
          </button>
          <button
            onClick={() => router.push("/cart")}
            className="w-full sm:w-auto bg-purina-red hover:bg-purina-red-hover text-white font-bold py-3.5 px-10 rounded-full transition-all duration-200 text-lg hover:shadow-lg hover:shadow-purina-red/20 active:scale-[0.97]"
          >
            {t.results.goToCart} &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
