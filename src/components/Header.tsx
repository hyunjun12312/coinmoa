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

  const switchLang = (newLang: Locale) => {
    const pathWithoutLang = pathname.replace(`/${lang}`, '') || '/';
    router.push(`/${newLang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`);
    setLangOpen(false);
  };

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

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={prefix} className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)]">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold gradient-text">CryptoPulse</span>
              <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-green)] live-dot" />
                {t.common.live}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Language Switcher + Search + Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">{localeFlags[lang]}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-lg overflow-hidden z-50 animate-slide-up max-h-80 overflow-y-auto">
                  {i18n.locales.map((locale) => (
                    <button
                      key={locale}
                      onClick={() => switchLang(locale)}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-[var(--bg-secondary)] ${
                        locale === lang ? 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] font-medium' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      <span>{localeFlags[locale]}</span>
                      <span>{localeNames[locale]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={`${prefix}/search`}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
            >
              <Search className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--bg-card)] md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="border-t border-[var(--border-color)] py-3 md:hidden animate-slide-up">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
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
