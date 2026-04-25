'use client';

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
    <div className="flex items-center gap-4 py-4">
      <div className="w-[50px] h-[50px] flex-shrink-0 bg-bg-card-hover/40 rounded-lg flex items-center justify-center">
        <Image
          src={product.img}
          alt={displayName}
          width={45}
          height={45}
          className="rounded-lg object-contain"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-text-title text-sm truncate">{displayName}</p>
        {isDiscounted ? (
          <p className="text-text-muted text-xs flex items-center gap-2">
            <span className="text-green-400 font-bold tabular-nums">
              &euro; {unitPrice.toFixed(2)}
            </span>
            <span className="line-through tabular-nums">
              &euro; {product.price.toFixed(2)}
            </span>
            <span className="text-[10px] font-bold text-green-400 bg-green-500/15 border border-green-500/25 px-1.5 py-0.5 rounded-full">
              &minus;20%
            </span>
            <span>{t.cart.each}</span>
          </p>
        ) : (
          <p className="text-text-muted text-xs">
            &euro; {product.price.toFixed(2)} {t.cart.each}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => updateQuantity(productId, -1)}
          className="w-8 h-8 bg-bg-card-hover border border-border-dark hover:bg-purina-red hover:text-white hover:border-purina-red rounded-lg text-text-title font-bold flex items-center justify-center transition-all duration-200"
        >
          &minus;
        </button>
        <span className="text-text-title font-bold w-8 text-center tabular-nums">{quantity}</span>
        <button
          onClick={() => updateQuantity(productId, +1)}
          className="w-8 h-8 bg-bg-card-hover border border-border-dark hover:bg-purina-red hover:text-white hover:border-purina-red rounded-lg text-text-title font-bold flex items-center justify-center transition-all duration-200"
        >
          +
        </button>
      </div>

      <p className={`font-bold text-base w-20 text-right tabular-nums ${isDiscounted ? 'text-green-400' : 'text-purina-red'}`}>&euro; {subtotal}</p>
    </div>
  );
}
