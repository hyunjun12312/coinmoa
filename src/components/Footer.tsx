'use client';

import Link from 'next/link';
import { Activity } from 'lucide-react';
import { useDictionary } from '@/i18n/DictionaryProvider';

export default function Footer() {
  const { dictionary: t, lang } = useDictionary();
  const prefix = `/${lang}`;

  return (
    <footer className="border-t border-[var(--border-color)] mt-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[#0066cc] shadow-[0_0_12px_rgba(30,144,255,0.3)]">
                <Activity className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-[var(--text-primary)]">CryptoPulse</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{t.footer.price}</h3>
            <ul className="space-y-2">
              {[
                { href: prefix, label: t.nav.dashboard },
                { href: `${prefix}/coin/bitcoin`, label: 'Bitcoin' },
                { href: `${prefix}/coin/ethereum`, label: 'Ethereum' },
                { href: `${prefix}/kimchi`, label: t.nav.kimchi },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{t.footer.info}</h3>
            <ul className="space-y-2">
              {[
                { href: `${prefix}/news`, label: t.nav.news },
                { href: `${prefix}/social`, label: t.nav.social },
                { href: `${prefix}/tools`, label: t.nav.tools },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{t.footer.notice}</h3>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              {t.footer.disclaimerFull}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[11px] text-[var(--text-tertiary)]">{t.footer.copyright}</p>
          <p className="text-[11px] text-[var(--text-tertiary)]">{t.footer.dataBy}</p>
        </div>
      </div>
    </footer>
  );
}
