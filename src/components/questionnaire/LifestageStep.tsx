"use client";
import { useAdvisorStore } from "@/stores/useAdvisorStore";
import { useTranslation } from "@/i18n/config";
import InteractiveCard from "./InteractiveCard";
import type { Lifestage } from "@/types";

const dogLifestages: { value: Lifestage; image: string }[] = [
  { value: "Junior", image: "/images/cucciolo.png" },
  { value: "Adult", image: "/images/adulto.png" },
  { value: "Senior", image: "/images/senior.png" },
];

const catLifestages: { value: Lifestage; image: string }[] = [
  { value: "Junior", image: "/images/cat_secco_junior.jpg" },
  { value: "Adult", image: "/images/cat_secco_adult.jpg" },
  { value: "Senior", image: "/images/cat_secco_senior.jpg" },
];

export default function LifestageStep() {
  const { profile, setLifestage, nextStep } = useAdvisorStore();
  const { t, interpolate } = useTranslation();

  const isCat = profile.petType === "cat";
  const lifestages = isCat ? catLifestages : dogLifestages;
  const lifestageLabels = isCat ? t.catLifestages : t.lifestages;
  const defaultName = isCat
    ? t.hero.defaultCatName
    : t.hero.defaultDogName;

  return (
    <div>
      {/* Step label */}
      <p className="text-purina-red text-sm font-bold tracking-wider mb-1">
        {t.steps.step1Label}
      </p>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-black text-text-title mb-2">
        {interpolate(t.steps.step1Title, {
          name: (profile.name || defaultName).toUpperCase(),
        })}
      </h2>

      {/* Decorative divider */}
      <div className="h-0.5 w-16 bg-purina-red rounded-full mb-8" />

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {lifestages.map(({ value, image }) => (
          <InteractiveCard
            key={value}
            imageSrc={image}
            title={lifestageLabels[value].title}
            subtitle={lifestageLabels[value].sub}
            selected={profile.lifestage === value}
            onClick={() => setLifestage(value)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-10">
        <button
          onClick={nextStep}
          disabled={!profile.lifestage}
          className="bg-purina-red text-white font-bold py-3 px-10 rounded-full hover:bg-purina-red-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-purina-red/20 active:scale-[0.98]"
        >
          {t.steps.next} &rarr;
        </button>
      </div>
    </div>
  );
}
