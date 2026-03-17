"use client";
import { useAdvisorStore } from "@/stores/useAdvisorStore";
import { useTranslation } from "@/i18n/config";
import ChoiceButton from "./ChoiceButton";
import type { HealthConcern } from "@/types";

const healthConcerns: HealthConcern[] = [
  "Nessuno",
  "Digestione sensibile",
  "Pelle & Pelo",
  "Controllo del peso",
  "Appetito difficile",
  "Intolleranze",
];

export default function HealthStep() {
  const { profile, toggleHealth, nextStep, prevStep } = useAdvisorStore();
  const { t, interpolate } = useTranslation();

  return (
    <div>
      {/* Step label */}
      <p className="text-purina-red text-sm font-bold tracking-wider mb-1">
        {t.steps.step3Label}
      </p>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-black text-text-title mb-2">
        {interpolate(t.steps.step3Title, {
          name: (profile.name || t.hero.defaultName).toUpperCase(),
        })}
      </h2>

      {/* Decorative divider */}
      <div className="h-0.5 w-16 bg-purina-red rounded-full mb-8" />

      {/* Health concern choices */}
      <div className="flex flex-col gap-3 max-w-xl mx-auto">
        {healthConcerns.map((value) => (
          <ChoiceButton
            key={value}
            emoji={t.health[value].emoji}
            title={t.health[value].title}
            subtitle={t.health[value].sub}
            selected={profile.health.includes(value)}
            onClick={() => toggleHealth(value)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-10">
        <button
          onClick={prevStep}
          className="text-text-muted hover:text-text-title hover:bg-bg-card-hover rounded-full px-6 py-3 font-bold transition-all duration-200"
        >
          &larr; {t.steps.back}
        </button>
        <button
          onClick={nextStep}
          disabled={profile.health.length === 0}
          className="bg-purina-red text-white font-bold py-3 px-10 rounded-full hover:bg-purina-red-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-purina-red/20 active:scale-[0.98]"
        >
          {t.steps.next} &rarr;
        </button>
      </div>
    </div>
  );
}
