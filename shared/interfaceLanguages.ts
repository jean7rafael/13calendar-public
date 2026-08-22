/* ===========================================================
   IDIOMAS COMPARTILHADOS ENTRE AS DUAS INTERFACES

   O conversor Vue e a página incorporada Solid usam esta mesma
   fonte para preservar ordem, bandeiras, nomes e regiões.
=========================================================== */

export const interfaceLanguages = [
  { locale: 'en-US', flag: '🇺🇸', name: 'English', region: 'United States' },
  { locale: 'pt-BR', flag: '🇧🇷', name: 'Português', region: 'Brasil' },
  { locale: 'de-DE', flag: '🇩🇪', name: 'Deutsch', region: 'Deutschland' },
  { locale: 'fr-FR', flag: '🇫🇷', name: 'Français', region: 'France' },
  { locale: 'it-IT', flag: '🇮🇹', name: 'Italiano', region: 'Italia' },
  { locale: 'es-ES', flag: '🇪🇸', name: 'Español', region: 'España' },
  { locale: 'ru-RU', flag: '🇷🇺', name: 'Русский', region: 'Россия' },
  {
    locale: 'ar-SA',
    flag: '🇸🇦',
    name: 'العربية',
    region: 'المملكة العربية السعودية',
  },
  { locale: 'hi-IN', flag: '🇮🇳', name: 'हिन्दी', region: 'भारत' },
  { locale: 'zh-CN', flag: '🇨🇳', name: '简体中文', region: '中国' },
  { locale: 'ja-JP', flag: '🇯🇵', name: '日本語', region: '日本' },
  { locale: 'ko-KR', flag: '🇰🇷', name: '한국어', region: '대한민국' },
] as const;

export type InterfaceLanguage = (typeof interfaceLanguages)[number];
export type InterfaceLocale = InterfaceLanguage['locale'];
