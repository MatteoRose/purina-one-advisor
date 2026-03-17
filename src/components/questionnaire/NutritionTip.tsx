"use client";

interface NutritionTipProps {
  tip: string;
}

export default function NutritionTip({ tip }: NutritionTipProps) {
  return (
    <div className="bg-bg-card/60 backdrop-blur-sm border border-border-dark border-l-4 border-l-purina-red rounded-xl p-4 my-6 shadow-sm shadow-black/5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-purina-red/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-sm">&#x1F4A1;</span>
        </div>
        <p className="text-sm text-text-muted italic leading-relaxed">{tip}</p>
      </div>
    </div>
  );
}
