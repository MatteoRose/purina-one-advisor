"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/config";

interface WhyWeRecommendProps {
  reasons: string[];
}

export default function WhyWeRecommend({ reasons }: WhyWeRecommendProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-bg-card rounded-xl border border-border-dark p-6 my-4">
      <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">
        {t.results.whyTitle}
      </h3>
      <ul>
        {reasons.map((reason, index) => (
          <motion.li
            key={index}
            className="flex items-start gap-2 mb-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <span className="text-green-400 font-bold">✓</span>
            <span className="text-text-body text-sm">{reason}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
