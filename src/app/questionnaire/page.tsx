"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAdvisorStore } from "@/stores/useAdvisorStore";
import { useTranslation } from "@/i18n/config";
import { getPersonalizedTip } from "@/lib/tips";
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
  const { locale } = useTranslation();

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

  // Get personalized tip based on current step and profile selections
  const tip = useMemo(
    () => getPersonalizedTip(currentStep, profile, locale),
    [currentStep, profile, locale]
  );

  // Show a relevant tip after the user has made a selection on the current step
  const showTip =
    (currentStep === 1 && profile.lifestage !== null) ||
    (currentStep === 2 && profile.activity !== null) ||
    (currentStep === 3 && profile.health.length > 0) ||
    currentStep === 4;

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
      {/* Page-specific warm accent gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 20%, rgba(233,28,36,0.06) 0%, transparent 70%)",
        }}
      />

      <ProgressBar currentStep={currentStep} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <StepWrapper stepKey={currentStep}>
          {renderStep()}
        </StepWrapper>

        {showTip && <NutritionTip tip={tip} />}
      </div>
    </div>
  );
}
