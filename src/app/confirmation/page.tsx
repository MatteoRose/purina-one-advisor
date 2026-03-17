'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdvisorStore } from '@/stores/useAdvisorStore';
import { useTranslation } from '@/i18n/config';
import { PRODUCTS_MAP } from '@/lib/products';

export default function ConfirmationPage() {
  const { t, locale, interpolate } = useTranslation();
  const router = useRouter();
  const profile = useAdvisorStore((s) => s.profile);
  const cart = useAdvisorStore((s) => s.cart);
  const reset = useAdvisorStore((s) => s.reset);
  const clearCart = useAdvisorStore((s) => s.clearCart);

  const total = cart.reduce(
    (sum, item) => sum + (PRODUCTS_MAP[item.productId]?.price || 0) * item.quantity,
    0
  );

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

          {/* Products card */}
          <div className="bg-bg-card rounded-xl border border-border-dark p-5 mb-5 shadow-md shadow-black/5">
            <h2 className="font-bold text-text-muted uppercase text-xs tracking-wider mb-4">
              {t.confirmation.productsTitle}
            </h2>

            {cart.map((item) => {
              const subtotal = (PRODUCTS_MAP[item.productId]?.price || 0) * item.quantity;
              return (
                <div
                  key={item.productId}
                  className="flex justify-between py-2.5 border-b border-border-dark last:border-0"
                >
                  <span className="text-sm text-text-body">
                    {getProductName(item.productId)} &times; {item.quantity}
                  </span>
                  <span className="font-bold text-text-title tabular-nums">
                    &euro; {subtotal.toFixed(2)}
                  </span>
                </div>
              );
            })}

            {/* Total */}
            <div className="flex justify-between pt-4 mt-2 border-t-2 border-purina-red">
              <span className="text-lg font-bold text-text-title">{t.confirmation.totalLabel}</span>
              <span className="text-2xl font-black text-purina-red tabular-nums">
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
        </motion.div>
      </div>
    </div>
  );
}
