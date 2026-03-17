"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAdvisorStore } from "@/stores/useAdvisorStore";
import { useTranslation } from "@/i18n/config";
import ProgressBar from "@/components/layout/ProgressBar";
import StepWrapper from "@/components/questionnaire/StepWrapper";
import NutritionTip from "@/components/questionnaire/NutritionTip";
import LifestageStep from "@/components/questionnaire/LifestageStep";
import ActivityStep from "@/components/questionnaire/ActivityStep";
import HealthStep from "@/components/questionnaire/HealthStep";
import WeightStep from "@/components/questionnaire/WeightStep";

export default function QuestionnairePage() {
  const router = useRouter();
  const currentStep = useAdvisorStore((s) => s.currentStep);
  const profile = useAdvisorStore((s) => s.profile);
  const goToStep = useAdvisorStore((s) => s.goToStep);
  const { t } = useTranslation();

  // If user navigates here without a name, redirect to hero
  useEffect(() => {
    if (!profile.name) {
      router.push("/");
      return;
    }
    if (currentStep === 0) {
      goToStep(1);
    }
  }, [currentStep, goToStep, profile.name, router]);

  // Pick a tip based on step
  const tip = useMemo(() => {
    const index = (currentStep - 1) % t.tips.length;
    return t.tips[Math.abs(index)] ?? t.tips[0];
  }, [currentStep, t.tips]);

  // Show nutrition tip after step 1 and step 2
  const showTip = currentStep === 1 || currentStep === 2;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <LifestageStep />;
      case 2:
        return <ActivityStep />;
      case 3:
        return <HealthStep />;
      case 4:
        return <WeightStep />;
      default:
        return <LifestageStep />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <ProgressBar currentStep={currentStep} />

      <div className="relative max-w-4xl mx-auto px-6 py-8">
        <StepWrapper stepKey={currentStep}>
          {renderStep()}
        </StepWrapper>

        {showTip && <NutritionTip tip={tip} />}
      </div>
    </div>
  );
}
