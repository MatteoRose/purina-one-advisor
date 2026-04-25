"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAdvisorStore } from "@/stores/useAdvisorStore";
import { useTranslation } from "@/i18n/config";
import { PRODUCTS_MAP } from "@/lib/products";

export default function AddToCartFeedback() {
  const { locale } = useTranslation();
  const lastAddedAt = useAdvisorStore((s) => s.lastAddedAt);
  const lastAdded = useAdvisorStore((s) => s.lastAdded);
  const lastAddedBatch = useAdvisorStore((s) => s.lastAddedBatch);
  const [show, setShow] = useState(false);
  const [snapshotBatch, setSnapshotBatch] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!lastAdded || lastAddedAt === 0) return;
    setSnapshotBatch(lastAddedBatch.length ? lastAddedBatch : [lastAdded]);
    setShow(true);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShow(false), 3500);
  }, [lastAddedAt, lastAdded, lastAddedBatch]);

  const products = snapshotBatch
    .map((id) => PRODUCTS_MAP[id])
    .filter(Boolean);
  const isFullPlan = products.length > 1;
  const singleProduct = products[0];
  if (!singleProduct) return null;

  const singleName = locale === "en" ? singleProduct.nameEn : singleProduct.name;
  const totalPrice = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed left-1/2 z-[100] w-[92%] max-w-md"
          style={{ bottom: "max(5rem, env(safe-area-inset-bottom, 1.5rem) + 1.5rem)" }}
          initial={{ opacity: 0, y: 60, x: "-50%", scale: 0.85 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: 30, x: "-50%", scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {isFullPlan ? (
            // ========== FULL PLAN UI ==========
            <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 rounded-2xl px-5 py-4 shadow-2xl shadow-green-500/40 overflow-hidden">
              {/* Sparkle shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
              />

              <div className="relative flex items-center gap-4">
                {/* Animated cart emoji with bounce + rotate */}
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0 shadow-lg"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{
                    scale: 1,
                    rotate: [0, -12, 12, -6, 6, 0],
                  }}
                  transition={{
                    scale: { delay: 0.1, type: "spring", stiffness: 400 },
                    rotate: { delay: 0.3, duration: 0.6 },
                  }}
                >
                  <span className="text-3xl">&#x1F6D2;</span>
                </motion.div>

                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <motion.p
                    className="font-black text-white text-base leading-tight drop-shadow-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {locale === "it"
                      ? "Piano Completo Aggiunto!"
                      : "Full Plan Added!"}
                  </motion.p>

                  {/* Stacked product thumbnails + count */}
                  <motion.div
                    className="mt-1.5 flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    <div className="flex -space-x-2">
                      {products.slice(0, 4).map((p, i) => (
                        <motion.div
                          key={p.id}
                          className="w-7 h-7 rounded-full bg-white shadow-md ring-2 ring-white/90 overflow-hidden flex items-center justify-center"
                          initial={{ opacity: 0, scale: 0, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            delay: 0.4 + i * 0.08,
                            type: "spring",
                            stiffness: 300,
                          }}
                          style={{ zIndex: 10 - i }}
                        >
                          <Image
                            src={p.img}
                            alt=""
                            width={28}
                            height={28}
                            className="object-contain"
                          />
                        </motion.div>
                      ))}
                      {products.length > 4 && (
                        <motion.div
                          className="w-7 h-7 rounded-full bg-white/90 text-green-700 text-[10px] font-black ring-2 ring-white shadow-md flex items-center justify-center"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7, type: "spring" }}
                        >
                          +{products.length - 4}
                        </motion.div>
                      )}
                    </div>
                    <span className="text-white/95 text-xs font-bold">
                      {products.length}{" "}
                      {locale === "it"
                        ? products.length === 1
                          ? "prodotto"
                          : "prodotti"
                        : products.length === 1
                        ? "item"
                        : "items"}{" "}
                      &middot; &euro;{totalPrice.toFixed(2)}
                    </span>
                  </motion.div>
                </div>

                {/* Check badge with pulse */}
                <motion.div
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-xl"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    boxShadow: [
                      "0 0 0 0 rgba(255,255,255,0.6)",
                      "0 0 0 12px rgba(255,255,255,0)",
                    ],
                  }}
                  transition={{
                    scale: { delay: 0.15, type: "spring", stiffness: 400 },
                    boxShadow: { delay: 0.5, duration: 1.2, repeat: 1 },
                  }}
                >
                  <span className="text-green-600 text-xl font-black">
                    &#x2713;
                  </span>
                </motion.div>
              </div>
            </div>
          ) : (
            // ========== SINGLE ITEM UI (unchanged feel) ==========
            <div className="bg-bg-card border-2 border-green-500 rounded-2xl px-5 py-4 shadow-2xl shadow-green-500/20 flex items-center gap-4">
              <motion.div
                className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 400 }}
              >
                <span className="text-white text-xl font-bold">&#x2713;</span>
              </motion.div>

              <Image
                src={singleProduct.img}
                alt={singleName}
                width={40}
                height={40}
                className="rounded-lg flex-shrink-0 object-contain"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-text-title text-sm truncate">
                  {singleName}
                </p>
                <p className="text-green-400 text-xs font-semibold">
                  {locale === "it" ? "Aggiunto" : "Added"} &mdash; &euro;
                  {singleProduct.price.toFixed(2)}
                </p>
              </div>

              <motion.span
                className="text-2xl"
                initial={{ rotate: -20 }}
                animate={{ rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                &#x1F6D2;
              </motion.span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
