'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n/config';

interface ProgressBarProps {
  currentStep: number; // 1-4
}

const stepKeys = ['step1', 'step2', 'step3', 'step4'] as const;

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const { t } = useTranslation();

  // Progress fill percentage: 0% at step 1, 33% at step 2, 67% at step 3, 100% at step 4
  const fillPercent = ((currentStep - 1) / 3) * 100;

  return (
    <div className="w-full bg-bg-card border-b border-border-dark py-4 px-8">
      <div className="relative flex items-center justify-between max-w-2xl mx-auto">
        {/* Background connecting line */}
        <div className="absolute top-2 left-0 right-0 h-[2px] bg-border-dark" />

        {/* Filled progress line */}
        <motion.div
          className="absolute top-2 left-0 h-[2px] bg-purina-red"
          initial={false}
          animate={{ width: `${fillPercent}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />

        {/* Step nodes */}
        {stepKeys.map((key, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={key} className="relative flex flex-col items-center z-10">
              {/* Circle */}
              <div
                className={`rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'w-5 h-5 bg-purina-red flex items-center justify-center'
                    : isCurrent
                    ? 'w-4 h-4 bg-purina-red ring-2 ring-purina-red ring-offset-2 ring-offset-bg-card shadow-[0_0_10px_3px_rgba(233,28,36,0.35)]'
                    : 'w-3 h-3 bg-border-dark'
                }`}
              >
                {isCompleted && (
                  <span className="text-white text-[9px] font-bold">&#x2713;</span>
                )}
              </div>

              {/* Label */}
              <span
                className={`mt-2.5 text-[11px] whitespace-nowrap font-medium ${
                  isCompleted
                    ? 'text-text-title'
                    : isCurrent
                    ? 'text-purina-red font-bold'
                    : 'text-text-muted'
                }`}
              >
                {t.progress[key]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
