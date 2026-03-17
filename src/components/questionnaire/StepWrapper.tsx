"use client";
import { motion, AnimatePresence } from "framer-motion";

interface StepWrapperProps {
  stepKey: number;
  children: React.ReactNode;
}

export default function StepWrapper({ stepKey, children }: StepWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -60 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
