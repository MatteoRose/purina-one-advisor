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

  const product = PRODUCTS_MAP[productId];
  if (!product) return null;

  const displayName = locale === 'en' ? product.nameEn : product.name;
  const subtotal = (product.price * quantity).toFixed(2);

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
        <p className="text-text-muted text-xs">
          &euro; {product.price.toFixed(2)} {t.cart.each}
        </p>
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

      <p className="text-purina-red font-bold text-base w-20 text-right tabular-nums">&euro; {subtotal}</p>
    </div>
  );
}
