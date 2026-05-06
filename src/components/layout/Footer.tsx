"use client";

/**
 * Site-wide footer — branded KIN ADVISOR signature plus disclaimer.
 *
 * Lives at the bottom of every page (except in print view). Sealed by
 * a thin Purina-red top border so the page background can't bleed past
 * the content area on long-scroll pages or short-content mobile views.
 */

import { useTranslation } from "@/i18n/config";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="no-print mt-16 border-t border-purina-red/40 bg-bg-card/40 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-6 py-8 text-center">
        {/* Tiny PURINA ONE parent label */}
        <p className="text-[9px] font-black tracking-[0.42em] text-text-muted mb-1">
          PURINA&nbsp;&nbsp;ONE
        </p>

        {/* KIN ADVISOR wordmark — same lockup as the header */}
        <p className="text-purina-red font-black text-base sm:text-lg tracking-wider leading-none">
          KIN&nbsp;ADVISOR
        </p>

        {/* Brand motto */}
        <p className="text-text-body italic text-xs sm:text-sm mt-3 max-w-md mx-auto leading-relaxed">
          Guided by Nutrition. Led by Purina.
        </p>

        {/* Thin red accent rule */}
        <div className="h-px w-10 bg-purina-red/50 mx-auto my-4" />

        {/* Legal disclaimer */}
        <p className="text-text-muted text-[10px] max-w-md mx-auto leading-relaxed">
          {t.footer.disclaimer}
        </p>
      </div>
    </footer>
  );
}
