"use client";

import { useTranslation } from "@/i18n/config";
import { DogProfile } from "@/types";

interface NutritionTableProps {
  profile: DogProfile;
  dosage: { dry: string; wet: string };
}

export default function NutritionTable({ profile, dosage }: NutritionTableProps) {
  const { t } = useTranslation();

  const showHealth =
    profile.health.length > 0 && !profile.health.includes("Nessuno");

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

      <div className="flex px-5 py-3 border-b border-border-dark bg-purina-red/5">
        <span className="text-text-muted text-sm w-48 flex-shrink-0 font-medium">{t.results.dosageDry}</span>
        <span className="text-purina-red font-black text-lg tabular-nums ml-auto">{dosage.dry}</span>
      </div>

      <div className="flex px-5 py-3 bg-purina-red/5">
        <span className="text-text-muted text-sm w-48 flex-shrink-0 font-medium">{t.results.dosageWet}</span>
        <span className="text-purina-red font-black text-lg tabular-nums ml-auto">{dosage.wet}</span>
      </div>
    </div>
  );
}
