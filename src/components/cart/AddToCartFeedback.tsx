'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useAdvisorStore } from '@/stores/useAdvisorStore';
import { useTranslation } from '@/i18n/config';
import { PRODUCTS_MAP } from '@/lib/products';

export default function AddToCartFeedback() {
  const { t, locale } = useTranslation();
  const lastAddedAt = useAdvisorStore((s) => s.lastAddedAt);
  const lastAdded = useAdvisorStore((s) => s.lastAdded);
  const [show, setShow] = useState(false);
  const [productId, setProductId] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!lastAdded || lastAddedAt === 0) return;

    clearTimeout(timerRef.current);
    setProductId(lastAdded);
    setShow(true);

    timerRef.current = setTimeout(() => setShow(false), 3000);
  }, [lastAddedAt, lastAdded]);

  const product = productId ? PRODUCTS_MAP[productId] : null;
  const name = product
    ? locale === 'en' ? product.nameEn : product.name
    : '';

  if (!product) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[100] w-[90%] max-w-md transition-all duration-300 ${
        show
          ? 'opacity-100 translate-y-0 -translate-x-1/2'
          : 'opacity-0 translate-y-4 -translate-x-1/2 pointer-events-none'
      }`}
    >
      <div className="bg-bg-card border-2 border-green-500 rounded-2xl px-5 py-4 shadow-2xl shadow-green-500/20 flex items-center gap-4">
        {/* Green checkmark circle */}
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xl font-bold">✓</span>
        </div>

        {/* Product image */}
        <Image
          src={product.img}
          alt={name}
          width={40}
          height={40}
          className="rounded-lg flex-shrink-0 object-contain"
        />

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-text-title text-sm truncate">{name}</p>
          <p className="text-green-400 text-xs font-semibold">
            {t.results.added} — €{product.price.toFixed(2)}
          </p>
        </div>

        {/* Cart icon */}
        <span className="text-2xl">🛒</span>
      </div>
    </div>
  );
}
