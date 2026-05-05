"use client";

import { useTranslation } from "@/i18n/config";
import { DogProfile } from "@/types";
import type { FeedingPlan } from "@/lib/feedingPlan";

interface NutritionTableProps {
  profile: DogProfile;
  feedingPlan: FeedingPlan;
}

export default function NutritionTable({ profile, feedingPlan }: NutritionTableProps) {
  const { t } = useTranslation();

  const showHealth =
    profile.health.length > 0 && !profile.health.includes("Nessuno");

  const dryStr = `${feedingPlan.dryGramsLow}–${feedingPlan.dryGramsHigh}g`;
  const wetStr =
    feedingPlan.wetPouches === 0
      ? "—"
      : feedingPlan.wetPouches === 1
        ? `1 × 85g (${feedingPlan.wetKcal} kcal)`
        : `${feedingPlan.wetPouches} × 85g (${feedingPlan.wetKcal} kcal)`;

  return (
    <div className="bg-bg-card rounded-xl border border-border-dark border-l-4 border-l-purina-red overflow-hidden my-6 shadow-md shadow-black/5">
      <div className="bg-bg-card-hover/60 px-5 py-3 border-b border-border-dark">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
          {t.results.dosageTitle}
        </h3>
      </div>

      <div className="flex px-5 py-3 border-b border-border-dark">
        <span className="text-text-muted text-sm w-48 flex-shrink-0 font-medium">{t.results.dosageSubject}</span>
        <span className="text-sm text-text-title font-bold">
          {profile.name} ({profile.weight} kg)
        </span>
      </div>

      <div className="flex px-5 py-3 border-b border-border-dark">
        <span className="text-text-muted text-sm w-48 flex-shrink-0 font-medium">{t.results.dosageProfile}</span>
        <span className="text-sm text-text-body">
          {profile.lifestage} &mdash; {profile.activity}
        </span>
      </div>

      {showHealth && (
        <div className="flex px-5 py-3 border-b border-border-dark">
          <span className="text-text-muted text-sm w-48 flex-shrink-0 font-medium">{t.results.dosageHealth}</span>
          <span className="text-sm text-text-body">{profile.health.join(", ")}</span>
        </div>
      )}

      {/* Energy requirement — the scientific anchor for the gram values below */}
      <div className="flex px-5 py-3 border-b border-border-dark">
        <span className="text-text-muted text-sm w-48 flex-shrink-0 font-medium">
          {t.results.dosageEnergy}
        </span>
        <span className="text-sm text-text-body tabular-nums">
          {feedingPlan.merKcal} kcal/day
          <span className="text-text-muted text-xs ml-2">
            (RER × {feedingPlan.activityFactor.toFixed(2)})
          </span>
        </span>
      </div>

      <div className="flex px-5 py-3 border-b border-border-dark bg-purina-red/5">
        <span className="text-text-muted text-sm w-48 flex-shrink-0 font-medium">{t.results.dosageDry}</span>
        <span className="text-purina-red font-black text-base sm:text-lg tabular-nums ml-auto">{dryStr}</span>
      </div>

      <div className="flex px-5 py-3 bg-purina-red/5">
        <span className="text-text-muted text-sm w-48 flex-shrink-0 font-medium">{t.results.dosageWet}</span>
        <span className="text-purina-red font-black text-base sm:text-lg tabular-nums ml-auto">{wetStr}</span>
      </div>

      {/* Formula footer — small print, always present, prints with the page */}
      <div className="px-5 py-2.5 bg-bg-card-hover/40 border-t border-border-dark">
        <p className="text-[10px] text-text-muted leading-snug font-mono tabular-nums">
          {feedingPlan.formula}
        </p>
      </div>
    </div>
  );
}
