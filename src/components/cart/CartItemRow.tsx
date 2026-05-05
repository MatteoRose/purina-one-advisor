'use client';

/**
 * CartItemRow — single line item in the cart.
 *
 * Mobile-first layout (rewritten — old version had 4 columns crammed on
 * one row, the −20% badge collided with the −/+ controls on phones).
 *
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ [img]  Full Product Name (no truncate)            € 6.00     │  ← row 1: name + subtotal
 *   │        € 6.00  ̶€̶ ̶7̶.̶5̶0̶  −20%  each                            │  ← row 2: unit price block
 *   │        [ − ]  1  [ + ]                                       │  ← row 3: qty controls
 *   └──────────────────────────────────────────────────────────────┘
 *
 * No truncation, badges wrap to a new line on narrow phones, and the
 * quantity controls have their own dedicated row so they can never
 * overlap with the discount badge.
 */

import Image from 'next/image';
import { PRODUCTS_MAP } from '@/lib/products';
import { useAdvisorStore } from '@/stores/useAdvisorStore';
import { useTranslation } from '@/i18n/config';

interface CartItemRowProps {
  productId: string;
  quantity: number;
}

export default function CartItemRow({ productId, quantity }: CartItemRowProps) {
  const { t, locale } = useTranslation();
  const updateQuantity = useAdvisorStore((s) => s.updateQuantity);
  const discountUnlocked = useAdvisorStore((s) => s.discountUnlocked);
  const primaryProductId = useAdvisorStore((s) => s.primaryProductId);

  const product = PRODUCTS_MAP[productId];
  if (!product) return null;

  const displayName = locale === 'en' ? product.nameEn : product.name;

  // Apply 20% off only on the unlocked primary product line.
  const isDiscounted = discountUnlocked && productId === primaryProductId;
  const unitPrice = isDiscounted ? product.price * 0.8 : product.price;
  const subtotal = (unitPrice * quantity).toFixed(2);

  return (
    <div className="flex items-start gap-3 sm:gap-4 py-4">
      {/* Product thumbnail */}
      <div className="w-[56px] h-[56px] flex-shrink-0 bg-bg-card-hover/40 rounded-lg flex items-center justify-center">
        <Image
          src={product.img}
          alt={displayName}
          width={50}
          height={50}
          className="rounded-lg object-contain"
        />
      </div>

      {/* Right side: stacked rows */}
      <div className="flex-1 min-w-0">
        {/* ─── Row 1: full product name (no truncate) + subtotal right-aligned ─── */}
        <div className="flex items-start justify-between gap-3">
          <p className="font-bold text-text-title text-sm leading-snug flex-1">
            {displayName}
          </p>
          <p
            className={`font-bold text-base sm:text-lg tabular-nums whitespace-nowrap flex-shrink-0 ${
              isDiscounted ? 'text-green-400' : 'text-purina-red'
            }`}
          >
            &euro; {subtotal}
          </p>
        </div>

        {/* ─── Row 2: unit price + discount badges (wraps freely on narrow widths) ─── */}
        <div className="text-text-muted text-xs mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          {isDiscounted ? (
            <>
              <span className="text-green-400 font-bold tabular-nums">
                &euro; {unitPrice.toFixed(2)}
              </span>
              <span className="line-through tabular-nums text-text-muted/70">
                &euro; {product.price.toFixed(2)}
              </span>
              <span className="text-[10px] font-bold text-green-400 bg-green-500/15 border border-green-500/25 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                &minus;20%
              </span>
              <span className="text-text-muted">{t.cart.each}</span>
            </>
          ) : (
            <span>
              &euro; {product.price.toFixed(2)} {t.cart.each}
            </span>
          )}
        </div>

        {/* ─── Row 3: quantity controls (own dedicated row — never collides) ─── */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => updateQuantity(productId, -1)}
            aria-label="Decrease quantity"
            className="w-9 h-9 bg-bg-card-hover border border-border-dark hover:bg-purina-red hover:text-white hover:border-purina-red rounded-lg text-text-title font-bold flex items-center justify-center transition-all duration-200 active:scale-[0.94]"
          >
            &minus;
          </button>
          <span className="text-text-title font-bold w-8 text-center tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(productId, +1)}
            aria-label="Increase quantity"
            className="w-9 h-9 bg-bg-card-hover border border-border-dark hover:bg-purina-red hover:text-white hover:border-purina-red rounded-lg text-text-title font-bold flex items-center justify-center transition-all duration-200 active:scale-[0.94]"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
