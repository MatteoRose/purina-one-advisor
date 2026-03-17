'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdvisorStore } from '@/stores/useAdvisorStore';
import { useTranslation } from '@/i18n/config';
import FlagIcon from '@/components/ui/FlagIcon';

export default function Header() {
  const cart = useAdvisorStore((s) => s.cart);
  const locale = useAdvisorStore((s) => s.locale);
  const setLocale = useAdvisorStore((s) => s.setLocale);
  const theme = useAdvisorStore((s) => s.theme);
  const toggleTheme = useAdvisorStore((s) => s.toggleTheme);
  const { t } = useTranslation();

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-card/95 backdrop-blur-sm no-print">
      {/* Purina Red accent bar */}
      <div className="h-1 bg-purina-red" />

      {/* Content area */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-3">
        {/* Left side: brand + subtitle */}
        <div className="flex items-center">
          <span className="text-purina-red font-black text-lg sm:text-2xl tracking-wider">
            PURINA ONE
          </span>
          <div className="w-px h-6 bg-border-dark mx-3 sm:mx-4 hidden sm:block" />
          <span className="text-text-muted text-sm font-bold tracking-widest hidden sm:block">
            MINI ADVISOR
          </span>
        </div>

        {/* Right side: cart + theme + language */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart badge */}
          <motion.div
            key={totalItems}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="flex items-center gap-1.5 bg-bg-card-hover/60 px-3 py-1.5 rounded-full border border-border-dark"
          >
            <span className="text-base">&#x1F6D2;</span>
            <span className="text-purina-red font-bold text-sm tabular-nums">
              {totalItems}
            </span>
            <span className="text-text-muted text-xs hidden sm:inline">
              {totalItems === 1 ? t.header.cartItem ?? t.header.cartItems : t.header.cartItems}
            </span>
          </motion.div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-border-dark hover:border-purina-red/60 hover:bg-bg-card-hover transition-all duration-200 text-lg"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '\u2600\uFE0F' : '\u{1F319}'}
          </button>

          {/* Language dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-dark hover:border-purina-red/60 transition-all duration-200"
            >
              <FlagIcon country={locale === 'en' ? 'gb' : 'it'} size={22} />
              <span className="text-xs font-bold text-text-body">{locale.toUpperCase()}</span>
              <svg width="8" height="5" viewBox="0 0 8 5" className={`text-text-muted fill-current transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}>
                <path d="M0 0L4 5L8 0z" />
              </svg>
            </button>

            {/* Dropdown popup */}
            {langOpen && (
              <div className="absolute right-0 mt-2 bg-bg-card border border-border-dark rounded-xl shadow-2xl overflow-hidden min-w-[170px] z-[60]">
                <button
                  onClick={() => { setLocale('en'); setLangOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-card-hover transition ${
                    locale === 'en' ? 'bg-hover-red-bg' : ''
                  }`}
                >
                  <FlagIcon country="gb" size={24} />
                  <div className="text-left">
                    <p className="text-sm font-bold text-text-title">English</p>
                    <p className="text-[10px] text-text-muted">EN</p>
                  </div>
                  {locale === 'en' && <span className="ml-auto text-purina-red text-sm font-bold">&#x2713;</span>}
                </button>
                <div className="h-px bg-border-dark" />
                <button
                  onClick={() => { setLocale('it'); setLangOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-card-hover transition ${
                    locale === 'it' ? 'bg-hover-red-bg' : ''
                  }`}
                >
                  <FlagIcon country="it" size={24} />
                  <div className="text-left">
                    <p className="text-sm font-bold text-text-title">Italiano</p>
                    <p className="text-[10px] text-text-muted">IT</p>
                  </div>
                  {locale === 'it' && <span className="ml-auto text-purina-red text-sm font-bold">&#x2713;</span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
