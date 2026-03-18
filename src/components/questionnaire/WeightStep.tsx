"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAdvisorStore } from "@/stores/useAdvisorStore";
import { useTranslation } from "@/i18n/config";

export default function WeightStep() {
  const router = useRouter();
  const { profile, setWeight, prevStep } = useAdvisorStore();
  const { t, interpolate } = useTranslation();

  const handleCalculate = () => {
    router.push("/results");
  };

  // Slider range: 1 to 10. Fill percentage for gradient background.
  const fillPercent = ((profile.weight - 1) / 9) * 100;

  // Scale markers positioned to match actual slider values
  const markers = [1, 3, 5, 7, 10];

  return (
    <div>
      {/* Step label */}
      <p className="text-purina-red text-sm font-bold tracking-wider mb-1">
        {t.steps.step4Label}
      </p>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-black text-text-title mb-2">
        {interpolate(t.steps.step4Title, {
          name: (profile.name || t.hero.defaultName).toUpperCase(),
        })}
      </h2>

      {/* Decorative divider */}
      <div className="h-0.5 w-16 bg-purina-red rounded-full mb-8" />

      {/* Weight card */}
      <div className="bg-bg-card rounded-2xl border-2 border-border-dark p-5 sm:p-8 max-w-lg mx-auto shadow-xl shadow-black/20">
        {/* Weight display */}
        <motion.div
          key={profile.weight.toFixed(1)}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.15 }}
          className="text-center mb-2"
        >
          <span className="text-5xl sm:text-7xl font-black text-purina-red tabular-nums drop-shadow-[0_0_25px_rgba(233,28,36,0.25)]">
            {profile.weight.toFixed(1)}
          </span>
        </motion.div>
        <p className="text-text-muted text-center text-lg font-bold tracking-[0.3em] mb-8">
          KG
        </p>

        {/* Scale markers — absolutely positioned to match slider scale */}
        <div className="relative h-5 mb-1">
          {markers.map((kg) => {
            const pos = ((kg - 1) / 9) * 100;
            return (
              <span
                key={kg}
                className={`absolute text-xs font-bold -translate-x-1/2 ${
                  Math.abs(profile.weight - kg) < 0.3
                    ? "text-purina-red"
                    : "text-text-muted"
                }`}
                style={{ left: `${pos}%` }}
              >
                {kg}
              </span>
            );
          })}
        </div>

        {/* Tick marks */}
        <div className="relative h-2 mb-1">
          {markers.map((kg) => {
            const pos = ((kg - 1) / 9) * 100;
            return (
              <div
                key={kg}
                className={`absolute w-px h-2 -translate-x-1/2 ${
                  Math.abs(profile.weight - kg) < 0.3
                    ? "bg-purina-red"
                    : "bg-text-muted/30"
                }`}
                style={{ left: `${pos}%` }}
              />
            );
          })}
        </div>

        {/* Range slider */}
        <div className="relative">
          <input
            type="range"
            min={1}
            max={10}
            step={0.1}
            value={profile.weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            className="weight-slider w-full h-2 appearance-none rounded-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #E91C24 0%, #E91C24 ${fillPercent}%, var(--color-border-dark) ${fillPercent}%, var(--color-border-dark) 100%)`,
            }}
          />
        </div>

        {/* Min/Max labels */}
        <div className="flex justify-between mt-2 px-0.5">
          <span className="text-[10px] text-text-muted">MIN</span>
          <span className="text-[10px] text-text-muted">MAX</span>
        </div>
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
          onClick={handleCalculate}
          className="bg-purina-red text-white font-bold py-4 px-12 text-lg rounded-full hover:bg-purina-red-hover transition-all duration-200 hover:shadow-lg hover:shadow-purina-red/20 active:scale-[0.98]"
        >
          {t.steps.calculate} &rarr;
        </button>
      </div>
    </div>
  );
}
