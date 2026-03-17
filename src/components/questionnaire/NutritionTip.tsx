"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/config";

interface NutritionTipProps {
  tip: string;
}

export default function NutritionTip({ tip }: NutritionTipProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tip}
        className="bg-bg-card/70 backdrop-blur-sm border border-border-dark border-l-4 border-l-purina-red rounded-xl p-4 my-6 shadow-md shadow-black/8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-purina-red/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-sm">&#x1F4A1;</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-purina-red uppercase tracking-wider mb-1">
              {t.tips_label ?? "Did you know?"}
            </p>
            <p className="text-sm text-text-muted italic leading-relaxed">{tip}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
