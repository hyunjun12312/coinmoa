'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { 
  TrendingUp, Newspaper, Users, BarChart3, Calculator, 
  Menu, X, Zap, Search, Globe, ChevronDown
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
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href={prefix} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-blue)]/10">
              <Zap className="h-4 w-4 text-[var(--accent-blue)]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-[var(--text-primary)]">CryptoPulse</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-green)] live-dot" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                  isActive(item.href)
                    ? 'text-[var(--text-primary)] bg-[var(--bg-secondary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Language */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{localeFlags[lang]}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-[var(--shadow-lg)] overflow-hidden z-50 animate-slide-up max-h-72 overflow-y-auto">
                  {i18n.locales.map((locale) => (
                    <button
                      key={locale}
                      onClick={() => switchLang(locale)}
                      className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors ${
                        locale === lang
                          ? 'bg-[var(--accent-blue)]/8 text-[var(--accent-blue)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span className="text-sm">{localeFlags[locale]}</span>
                      <span>{localeNames[locale]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <Link
              href={`${prefix}/search`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <Search className="h-3.5 w-3.5" />
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] md:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="border-t border-[var(--border-color)] py-2 pb-3 md:hidden animate-slide-up">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] transition-colors ${
                  isActive(item.href)
                    ? 'text-[var(--text-primary)] bg-[var(--bg-secondary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
