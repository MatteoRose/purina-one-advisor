import { useAdvisorStore } from '@/stores/useAdvisorStore';
import { en } from './en';
import { it } from './it';

const translations = { en, it } as const;

export function useTranslation() {
  const locale = useAdvisorStore((s) => s.locale);
  const t = translations[locale];

  const interpolate = (text: string, vars: Record<string, string>) => {
    return Object.entries(vars).reduce(
      (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, 'g'), value),
      text
    );
  };

  return { t, locale, interpolate };
}
