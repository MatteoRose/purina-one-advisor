'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdvisorStore } from '@/stores/useAdvisorStore';
import { useTranslation } from '@/i18n/config';
import { PRODUCTS_MAP } from '@/lib/products';
import CartItemRow from '@/components/cart/CartItemRow';

export default function CartPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const cart = useAdvisorStore((s) => s.cart);

  const total = cart.reduce(
    (sum, item) => sum + (PRODUCTS_MAP[item.productId]?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="relative min-h-screen">
      {/* Page-specific accent gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 60% 20%, rgba(233,28,36,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-purina-red text-sm font-bold tracking-wider">{t.cart.label}</p>
          <h1 className="text-2xl sm:text-3xl font-black text-text-title mt-1">{t.cart.title}</h1>
          <div className="h-0.5 w-16 bg-purina-red rounded-full mt-3" />
        </motion.div>

        {cart.length === 0 ? (
          <motion.p
            className="text-text-muted text-lg text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t.cart.empty}
          </motion.p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Cart table */}
            <div className="bg-bg-card rounded-xl border border-border-dark overflow-hidden mt-8 shadow-lg shadow-black/8">
              {/* Table header */}
              <div className="bg-bg-card-hover/60 px-4 sm:px-5 py-3 grid grid-cols-[1fr_auto_auto] gap-3 sm:gap-4 border-b border-border-dark">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  {t.cart.product}
                </span>
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  {t.cart.qty}
                </span>
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  {t.cart.subtotal}
                </span>
              </div>

              {/* Cart items */}
              <div className="divide-y divide-border-dark px-5">
                {cart.map((item) => (
                  <CartItemRow
                    key={item.productId}
                    productId={item.productId}
                    quantity={item.quantity}
                  />
                ))}
              </div>

              {/* Total row */}
              <div className="px-5 py-5 flex justify-end items-center gap-6 border-t border-purina-red/30 bg-hover-red-bg/20">
                <span className="text-lg font-bold text-text-title">{t.cart.total}</span>
                <span className="text-2xl font-black text-purina-red">
                  &euro; {total.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-10 pt-6 border-t border-border-dark">
          <button
            onClick={() => router.push('/results')}
            className="text-text-muted hover:text-text-title font-medium transition-colors duration-200"
          >
            &larr; {t.cart.back}
          </button>

          {cart.length > 0 && (
            <button
              onClick={() => router.push('/confirmation')}
              className="w-full sm:w-auto bg-purina-red hover:bg-purina-red-hover text-white font-bold text-lg py-4 px-12 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-purina-red/20 active:scale-[0.97]"
            >
              {t.cart.checkout} &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
