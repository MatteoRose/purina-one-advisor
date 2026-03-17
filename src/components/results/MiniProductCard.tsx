"use client";

import Image from "next/image";
import { useTranslation } from "@/i18n/config";
import { Product } from "@/types";

interface MiniProductCardProps {
  product: Product;
  tag: string;
  onAddToCart: () => void;
}

export default function MiniProductCard({ product, tag, onAddToCart }: MiniProductCardProps) {
  const { t, locale } = useTranslation();

  const name = locale === "it" ? product.name : product.nameEn;
  const desc = locale === "it" ? product.desc : product.descEn;

  return (
    <div className="group bg-bg-card rounded-xl border border-border-dark p-4 w-48 flex flex-col transition-all duration-200 hover:border-purina-red/60 hover:shadow-lg hover:shadow-black/10">
      <span className="bg-purina-red text-white text-[10px] font-bold px-2.5 py-1 rounded-md self-start mb-3 uppercase tracking-wide">
        {tag}
      </span>

      <div className="w-[80px] h-[80px] mx-auto mb-3 flex items-center justify-center">
        <Image
          src={product.img}
          alt={name}
          width={80}
          height={80}
          className="object-contain drop-shadow-sm"
        />
      </div>

      <p className="text-xs font-bold text-text-title text-center mb-1 line-clamp-2">{name}</p>
      <p className="text-sm font-bold text-purina-red text-center mb-2">
        &euro;{product.price.toFixed(2)}
      </p>
      <p className="text-[11px] text-text-muted text-center mb-3 line-clamp-3 leading-relaxed">
        {desc}
      </p>

      <button
        onClick={onAddToCart}
        className="w-full bg-purina-red hover:bg-purina-red-hover text-white text-xs font-bold py-2.5 rounded-full transition-all duration-200 hover:shadow-md hover:shadow-purina-red/20 active:scale-[0.97] mt-auto"
      >
        {t.results.addToCart}
      </button>
    </div>
  );
}
