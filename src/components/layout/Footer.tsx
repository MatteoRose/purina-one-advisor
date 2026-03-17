"use client";

import { useTranslation } from "@/i18n/config";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="no-print border-t border-border-dark mt-16 py-6 px-6 text-center">
      <p className="text-text-muted text-xs">
        Powered by <span className="text-purina-red font-bold">Purina ONE</span>
      </p>
      <p className="text-text-muted text-[10px] mt-1 max-w-md mx-auto leading-relaxed">
        {t.footer.disclaimer}
      </p>
    </footer>
  );
}
