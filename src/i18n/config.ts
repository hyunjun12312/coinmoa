// i18n 설정: 지원 언어 목록 및 기본 언어
export const i18n = {
  defaultLocale: 'en' as const,
  locales: [
    'en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt', 'ru',
    'ar', 'vi', 'th', 'tr', 'hi', 'id',
  ] as const,
};

export type Locale = (typeof i18n)['locales'][number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  zh: '中文',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  ru: 'Русский',
  ar: 'العربية',
  vi: 'Tiếng Việt',
  th: 'ไทย',
  tr: 'Türkçe',
  hi: 'हिन्दी',
  id: 'Bahasa Indonesia',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  ko: '🇰🇷',
  ja: '🇯🇵',
  zh: '🇨🇳',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  pt: '🇧🇷',
  ru: '🇷🇺',
  ar: '🇸🇦',
  vi: '🇻🇳',
  th: '🇹🇭',
  tr: '🇹🇷',
  hi: '🇮🇳',
  id: '🇮🇩',
};

// RTL 언어
export const rtlLocales: Locale[] = ['ar'];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
