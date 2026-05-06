'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdvisorStore } from '@/stores/useAdvisorStore';
import { useTranslation } from '@/i18n/config';
import { PRODUCTS_MAP } from '@/lib/products';
import { computeFeedingPlan } from '@/lib/feedingPlan';

export default function ConfirmationPage() {
  const { t, locale, interpolate } = useTranslation();
  const router = useRouter();
  const profile = useAdvisorStore((s) => s.profile);
  const cart = useAdvisorStore((s) => s.cart);
  const reset = useAdvisorStore((s) => s.reset);
  const clearCart = useAdvisorStore((s) => s.clearCart);
  const discountUnlocked = useAdvisorStore((s) => s.discountUnlocked);
  const primaryProductId = useAdvisorStore((s) => s.primaryProductId);

  // Compute the same FeedingPlan the results page produced. Pure function
  // of (profile, primary product, paired wet) — guaranteed identical
  // gram values to NutritionTable + FeedingPlan on the results screen.
  const feedingPlan = useMemo(() => {
    const dry = primaryProductId ? PRODUCTS_MAP[primaryProductId] : null;
    if (!dry) return null;
    const wet = dry.pairing ? PRODUCTS_MAP[dry.pairing] ?? null : null;
    return computeFeedingPlan(profile, dry, wet);
  }, [profile, primaryProductId]);

  const primaryProduct = primaryProductId ? PRODUCTS_MAP[primaryProductId] ?? null : null;
  const wetProduct =
    primaryProduct?.pairing ? PRODUCTS_MAP[primaryProduct.pairing] ?? null : null;

  const unitPriceFor = (productId: string) => {
    const base = PRODUCTS_MAP[productId]?.price ?? 0;
    return discountUnlocked && productId === primaryProductId ? base * 0.8 : base;
  };

  const total = cart.reduce(
    (sum, item) => sum + unitPriceFor(item.productId) * item.quantity,
    0
  );

  const savings = (() => {
    if (!discountUnlocked || !primaryProductId) return 0;
    const item = cart.find((i) => i.productId === primaryProductId);
    if (!item) return 0;
    const base = PRODUCTS_MAP[primaryProductId]?.price ?? 0;
    return base * 0.2 * item.quantity;
  })();

  const getProductName = (productId: string) => {
    const product = PRODUCTS_MAP[productId];
    if (!product) return productId;
    return locale === 'en' ? product.nameEn : product.name;
  };

  return (
    <div className="relative min-h-screen">
      {/* Page-specific accent gradient -- warm celebratory feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(233,28,36,0.06) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle 400px at 20% 70%, rgba(34,197,94,0.03) 0%, transparent 50%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 print:bg-white print:text-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-2">
            <p className="text-purina-red text-sm font-bold tracking-wider">{t.confirmation.subtitle}</p>
            <h1 className="text-2xl sm:text-3xl font-black text-text-title mt-1">
              {interpolate(t.confirmation.title, { name: profile.name || 'Your Dog' })}
            </h1>
            <div className="h-0.5 w-16 bg-purina-red rounded-full mt-3 mx-auto" />
          </div>

          {/* Checkmark */}
          <div className="flex justify-center my-6">
            <motion.div
              className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center shadow-lg shadow-green-600/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <span className="text-3xl text-white font-bold">&#x2713;</span>
            </motion.div>
          </div>

          {/* Profile summary card */}
          <div className="bg-bg-card rounded-xl border border-border-dark border-l-4 border-l-purina-red p-5 mb-5 shadow-md shadow-black/5">
            <h2 className="font-bold text-text-muted uppercase text-xs tracking-wider mb-4">
              {t.confirmation.profileTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex gap-1">
                <span className="text-text-muted">{t.confirmation.dogName}</span>
                <span className="text-text-title font-bold">{profile.name || 'Your Dog'}</span>
              </div>
              <div className="flex gap-1">
                <span className="text-text-muted">{t.confirmation.lifestage}</span>
                <span className="text-text-title font-bold">{profile.lifestage || '-'}</span>
              </div>
              <div className="flex gap-1">
                <span className="text-text-muted">{t.confirmation.activity}</span>
                <span className="text-text-title font-bold">{profile.activity || '-'}</span>
              </div>
              <div className="flex gap-1">
                <span className="text-text-muted">{t.confirmation.healthNeeds}</span>
                <span className="text-text-title font-bold">
                  {profile.health.length > 0 ? profile.health.join(', ') : '-'}
                </span>
              </div>
              <div className="flex gap-1">
                <span className="text-text-muted">{t.confirmation.weight}</span>
                <span className="text-text-title font-bold">{profile.weight} kg</span>
              </div>
            </div>
          </div>

          {/* Daily Feeding Plan — same numbers as the results page */}
          {feedingPlan && primaryProduct && (
            <div className="bg-bg-card rounded-xl border border-border-dark border-l-4 border-l-purina-red p-5 mb-5 shadow-md shadow-black/5 print:break-inside-avoid">
              <h2 className="font-bold text-text-muted uppercase text-xs tracking-wider mb-4">
                {t.feedingPlan.printTitle}
              </h2>
              <p className="text-text-body text-xs mb-4">
                {interpolate(t.feedingPlan.printSubtitle, {
                  name: profile.name || (locale === 'it' ? 'il tuo pet' : 'your pet'),
                })}
              </p>

              {/* Daily totals — bold, tabular, prints crisp */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-bg-card-hover/50 rounded-lg p-3 border border-border-dark/50">
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
                    {t.feedingPlan.totalEnergyLabel}
                  </p>
                  <p className="text-purina-red font-black text-lg tabular-nums mt-0.5">
                    {feedingPlan.merKcal}
                    <span className="text-[10px] font-medium text-text-muted ml-1">kcal/d</span>
                  </p>
                </div>
                <div className="bg-bg-card-hover/50 rounded-lg p-3 border border-border-dark/50">
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
                    {t.feedingPlan.totalDryLabel}
                  </p>
                  <p className="text-purina-red font-black text-lg tabular-nums mt-0.5">
                    {feedingPlan.dryGramsLow}&#x2013;{feedingPlan.dryGramsHigh}
                    <span className="text-[10px] font-medium text-text-muted ml-1">g</span>
                  </p>
                </div>
                <div className="bg-bg-card-hover/50 rounded-lg p-3 border border-border-dark/50">
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
                    {t.results.dosageWet}
                  </p>
                  <p className="text-purina-red font-black text-lg tabular-nums mt-0.5">
                    {feedingPlan.wetPouches === 0 ? (
                      <span className="text-text-muted">&mdash;</span>
                    ) : (
                      <>
                        {feedingPlan.wetPouches}
                        <span className="text-[10px] font-medium text-text-muted ml-1">
                          &times; 85g
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Per-meal split */}
              <div className="border-t border-border-dark/60 pt-3">
                <div className="flex items-center justify-between py-2 border-b border-border-dark/40 last:border-0">
                  <div className="flex items-center gap-2">
                    <span>&#x2600;&#xFE0F;</span>
                    <span className="text-text-body text-sm">
                      {t.feedingPlan.morning} &mdash; {locale === 'it' ? primaryProduct.name : primaryProduct.nameEn}
                    </span>
                  </div>
                  <span className="text-purina-red font-black text-base tabular-nums">
                    {feedingPlan.dryGramsPerMealLow}&#x2013;{feedingPlan.dryGramsPerMealHigh}g
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-dark/40 last:border-0">
                  <div className="flex items-center gap-2">
                    <span>&#x1F319;</span>
                    <span className="text-text-body text-sm">
                      {t.feedingPlan.evening} &mdash; {locale === 'it' ? primaryProduct.name : primaryProduct.nameEn}
                    </span>
                  </div>
                  <span className="text-purina-red font-black text-base tabular-nums">
                    {feedingPlan.dryGramsPerMealLow}&#x2013;{feedingPlan.dryGramsPerMealHigh}g
                  </span>
                </div>
                {wetProduct && feedingPlan.wetPouches > 0 && (
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span>&#x1F375;</span>
                      <span className="text-text-body text-sm">
                        {locale === 'it' ? wetProduct.name : wetProduct.nameEn}
                      </span>
                    </div>
                    <span className="text-purina-red font-black text-base tabular-nums">
                      {feedingPlan.wetPouches} &times; 85g
                    </span>
                  </div>
                )}
              </div>

              {/* Formula footer — reproducible math */}
              <p className="text-[9.5px] text-text-muted leading-snug font-mono tabular-nums mt-3 pt-3 border-t border-border-dark/40">
                {feedingPlan.formula}
              </p>
            </div>
          )}

          {/* Products card */}
          <div className="bg-bg-card rounded-xl border border-border-dark p-5 mb-5 shadow-md shadow-black/5">
            <h2 className="font-bold text-text-muted uppercase text-xs tracking-wider mb-4">
              {t.confirmation.productsTitle}
            </h2>

            {cart.map((item) => {
              const isDiscounted =
                discountUnlocked && item.productId === primaryProductId;
              const subtotal = unitPriceFor(item.productId) * item.quantity;
              return (
                <div
                  key={item.productId}
                  className="flex items-start justify-between gap-3 py-2.5 border-b border-border-dark last:border-0"
                >
                  {/* Left column: product name + discount badge below (never collides with price) */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-body leading-snug">
                      {getProductName(item.productId)} &times; {item.quantity}
                    </p>
                    {isDiscounted && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-green-400 bg-green-500/15 border border-green-500/25 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        &minus;20%
                      </span>
                    )}
                  </div>
                  {/* Right column: price — always one line, never wraps */}
                  <span
                    className={`font-bold tabular-nums whitespace-nowrap flex-shrink-0 ${
                      isDiscounted ? 'text-green-500' : 'text-text-title'
                    }`}
                  >
                    &euro; {subtotal.toFixed(2)}
                  </span>
                </div>
              );
            })}

            {/* Savings line */}
            {savings > 0 && (
              <div className="flex items-start justify-between gap-3 pt-3 text-sm">
                <span className="text-green-500 font-medium flex-1 min-w-0">
                  &#x2713; {locale === 'it' ? 'Sconto applicato' : 'Discount applied'} (&minus;20%)
                </span>
                <span className="text-green-500 font-bold tabular-nums whitespace-nowrap flex-shrink-0">
                  &minus; &euro; {savings.toFixed(2)}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex items-baseline justify-between gap-3 pt-4 mt-2 border-t-2 border-purina-red">
              <span className="text-lg font-bold text-text-title">{t.confirmation.totalLabel}</span>
              <span className="text-2xl font-black text-purina-red tabular-nums whitespace-nowrap flex-shrink-0">
                &euro; {total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Thank you message */}
          <p className="text-center text-text-muted italic my-6 text-sm">{t.confirmation.thankYou}</p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 no-print">
            <button
              onClick={() => window.print()}
              className="border-2 border-purina-red text-purina-red font-bold py-3 px-8 rounded-full hover:bg-purina-red hover:text-white transition-all duration-200"
            >
              {t.confirmation.print}
            </button>
            <button
              onClick={() => {
                reset();
                clearCart();
                router.push('/');
              }}
              className="bg-purina-red text-white font-bold py-3 px-8 rounded-full hover:bg-purina-red-hover transition-all duration-200 hover:shadow-lg hover:shadow-purina-red/20 active:scale-[0.98]"
            >
              {t.confirmation.restart}
            </button>
          </div>

          {/* ─── KIN ADVISOR branded outro — replaces the awkward black/green
                area that was bleeding through under the products card on
                mobile. Sealed black box with Purina red accents + brand
                motto, prevents the page background from showing past the
                main content. ─── */}
          <motion.div
            className="mt-10 mb-4 relative overflow-hidden rounded-2xl no-print"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div
              className="relative px-6 sm:px-8 py-7 sm:py-8 text-center"
              style={{
                background:
                  'linear-gradient(135deg, #0a0a0a 0%, #1a0a0c 50%, #0a0a0a 100%)',
              }}
            >
              {/* Animated red glow */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ opacity: [0.25, 0.5, 0.25] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  background:
                    'radial-gradient(circle 320px at 50% 50%, rgba(233,28,36,0.28) 0%, transparent 70%)',
                }}
              />

              {/* Top red rule */}
              <div className="relative h-px w-12 mx-auto bg-purina-red mb-4" />

              {/* Parent brand label */}
              <p className="relative text-[10px] font-black tracking-[0.42em] text-white/70 mb-2">
                PURINA&nbsp;&nbsp;ONE
              </p>

              {/* KIN ADVISOR wordmark */}
              <h3 className="relative text-purina-red font-black text-3xl sm:text-4xl tracking-tight leading-none drop-shadow-[0_0_30px_rgba(233,28,36,0.55)]">
                KIN&nbsp;ADVISOR
              </h3>

              {/* Motto */}
              <p className="relative text-white/95 font-light italic text-sm sm:text-base mt-4">
                Guided by Nutrition. Led by Purina.
              </p>

              {/* Bottom red rule */}
              <div className="relative h-px w-12 mx-auto bg-purina-red mt-4" />

              {/* Tiny attribution / URL */}
              <p className="relative text-white/40 text-[10px] mt-3 font-mono tracking-wider">
                kin.purina.it
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
