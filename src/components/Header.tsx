'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { 
  TrendingUp, Newspaper, Users, BarChart3, Calculator, 
  Menu, X, Search, Globe, ChevronDown, Activity
} from 'lucide-react';
import { useDictionary } from '@/i18n/DictionaryProvider';
import { i18n, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { dictionary: t, lang } = useDictionary();
  const pathname = usePathname();
  const router = useRouter();

  const prefix = `/${lang}`;

  const navItems = [
    { href: prefix, label: t.nav.dashboard, icon: BarChart3 },
    { href: `${prefix}/news`, label: t.nav.news, icon: Newspaper },
    { href: `${prefix}/social`, label: t.nav.social, icon: Users },
    { href: `${prefix}/kimchi`, label: t.nav.kimchi, icon: TrendingUp },
    { href: `${prefix}/tools`, label: t.nav.tools, icon: Calculator },
  ];

  const isActive = (href: string) => {
    if (href === prefix) return pathname === prefix || pathname === `${prefix}/`;
    return pathname.startsWith(href);
  };

  const switchLang = (newLang: Locale) => {
    const pathWithoutLang = pathname.replace(`/${lang}`, '') || '/';
    router.push(`/${newLang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`);
    setLangOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur-2xl">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="flex h-[60px] items-center justify-between gap-4">
          {/* Logo */}
          <Link href={prefix} className="flex items-center gap-3 shrink-0 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-blue)] to-[#0066cc] shadow-[0_2px_10px_rgba(30,144,255,0.3)]">
              <Activity className="h-[18px] w-[18px] text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold tracking-tight text-[var(--text-primary)]">CryptoPulse</span>
              <span className="inline-block h-[6px] w-[6px] rounded-full bg-[var(--accent-green)] live-dot" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-4 py-[18px] text-[13px] font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <item.icon className="h-[15px] w-[15px]" />
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-[var(--accent-blue)]" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Search */}
            <Link
              href={`${prefix}/search`}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
            >
              <Search className="h-[16px] w-[16px]" />
            </Link>

            {/* Language */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
              >
                <Globe className="h-[15px] w-[15px]" />
                <span className="hidden sm:inline text-sm">{localeFlags[lang]}</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-[var(--shadow-lg)] overflow-hidden z-50 animate-slide-up max-h-80 overflow-y-auto">
                  <div className="p-1">
                    {i18n.locales.map((locale) => (
                      <button
                        key={locale}
                        onClick={() => switchLang(locale)}
                        className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                          locale === lang
                            ? 'bg-[var(--accent-blue-bg)] text-[var(--accent-blue)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <span className="text-base">{localeFlags[locale]}</span>
                        <span>{localeNames[locale]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] lg:hidden transition-all"
            >
              {mobileOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="border-t border-[var(--border-color)] py-2 pb-4 lg:hidden animate-slide-up">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-[var(--text-primary)] bg-[var(--bg-elevated)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <item.icon className="h-[16px] w-[16px]" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
