"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAdvisorStore } from "@/stores/useAdvisorStore";
import { useTranslation } from "@/i18n/config";
import { PRODUCTS_MAP } from "@/lib/products";

export default function AddToCartFeedback() {
  const { t, locale } = useTranslation();
  const lastAddedAt = useAdvisorStore((s) => s.lastAddedAt);
  const lastAdded = useAdvisorStore((s) => s.lastAdded);
  const [show, setShow] = useState(false);
  const [productId, setProductId] = useState("");
  const [isFullPlan, setIsFullPlan] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const addCountRef = useRef(0);
  const batchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!lastAdded || lastAddedAt === 0) return;

    // Track rapid adds (full plan detection)
    addCountRef.current += 1;
    clearTimeout(batchTimerRef.current);

    batchTimerRef.current = setTimeout(() => {
      // If 2+ products added within 300ms, it's a full plan
      const isBatch = addCountRef.current >= 2;
      setIsFullPlan(isBatch);
      setProductId(lastAdded);
      setShow(true);

      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShow(false), 3000);

      addCountRef.current = 0;
    }, 300);
  }, [lastAddedAt, lastAdded]);

  const product = productId ? PRODUCTS_MAP[productId] : null;
  const name = product
    ? locale === "en"
      ? product.nameEn
      : product.name
    : "";

  if (!product) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed left-1/2 z-[100] w-[90%] max-w-md"
          style={{ bottom: "max(5rem, env(safe-area-inset-bottom, 1.5rem) + 1.5rem)" }}
          initial={{ opacity: 0, y: 60, x: "-50%", scale: 0.85 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: 30, x: "-50%", scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="bg-bg-card border-2 border-green-500 rounded-2xl px-5 py-4 shadow-2xl shadow-green-500/20 flex items-center gap-4">
            <motion.div
              className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 400 }}
            >
              <span className="text-white text-xl font-bold">&#x2713;</span>
            </motion.div>

            {isFullPlan ? (
              <div className="flex-1 min-w-0">
                <p className="font-bold text-text-title text-sm">
                  {locale === "it" ? "Piano Completo Aggiunto!" : "Full Plan Added!"}
                </p>
                <p className="text-green-400 text-xs font-semibold">
                  {locale === "it" ? "Tutti i prodotti aggiunti al carrello" : "All products added to cart"}
                </p>
              </div>
            ) : (
              <>
                <Image
                  src={product.img}
                  alt={name}
                  width={40}
                  height={40}
                  className="rounded-lg flex-shrink-0 object-contain"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-text-title text-sm truncate">{name}</p>
                  <p className="text-green-400 text-xs font-semibold">
                    {t.results.added} &mdash; &euro;{product.price.toFixed(2)}
                  </p>
                </div>
              </>
            )}

            <motion.span
              className="text-2xl"
              initial={{ rotate: -20 }}
              animate={{ rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              &#x1F6D2;
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
