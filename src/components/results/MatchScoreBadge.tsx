"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/config";
import type { MatchExplanation } from "@/types";

interface MatchScoreBadgeProps {
  score: number;
  explanations?: MatchExplanation[];
}

export default function MatchScoreBadge({ score, explanations }: MatchScoreBadgeProps) {
  const { locale } = useTranslation();

  const strokeColor = score >= 90 ? "#22c55e" : score >= 75 ? "#22c55e" : "#eab308";
  const textColor = score >= 90 ? "text-green-400" : score >= 75 ? "text-green-400" : "text-yellow-400";

  // SVG ring math
  const size = 56;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      {/* Animated SVG score ring */}
      <div className="relative w-14 h-14 flex-shrink-0">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Animated filled arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - filled }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          />
        </svg>
        {/* Score text centered */}
        <motion.span
          className={`absolute inset-0 flex items-center justify-center text-sm font-black ${textColor}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {score}%
        </motion.span>
      </div>

      {/* Explanation checklist */}
      {explanations && explanations.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {explanations.map((exp, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.15 }}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                exp.matched
                  ? "bg-green-500/20 text-green-400"
                  : "bg-border-dark/50 text-text-muted"
              }`}>
                {exp.matched ? "\u2713" : "\u25CB"}
              </span>
              <span className={`text-xs ${exp.matched ? "text-text-title font-medium" : "text-text-muted"}`}>
                {locale === "it" ? exp.labelIt : exp.label}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
