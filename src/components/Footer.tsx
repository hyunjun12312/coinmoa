'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { useDictionary } from '@/i18n/DictionaryProvider';

export default function Footer() {
  const { dictionary: t, lang } = useDictionary();
  const prefix = `/${lang}`;

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] mt-12">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)]">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">CryptoPulse</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line">
              {t.footer.description}
            </p>
          </div>

          {/* Navigation - Prices */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">{t.footer.price}</h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><Link href={prefix} className="hover:text-[var(--accent-blue)] transition">{t.nav.dashboard}</Link></li>
              <li><Link href={`${prefix}/coin/bitcoin`} className="hover:text-[var(--accent-blue)] transition">Bitcoin</Link></li>
              <li><Link href={`${prefix}/coin/ethereum`} className="hover:text-[var(--accent-blue)] transition">Ethereum</Link></li>
              <li><Link href={`${prefix}/kimchi`} className="hover:text-[var(--accent-blue)] transition">{t.nav.kimchi}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">{t.footer.info}</h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><Link href={`${prefix}/news`} className="hover:text-[var(--accent-blue)] transition">{t.nav.news}</Link></li>
              <li><Link href={`${prefix}/social`} className="hover:text-[var(--accent-blue)] transition">{t.nav.social}</Link></li>
              <li><Link href={`${prefix}/tools`} className="hover:text-[var(--accent-blue)] transition">{t.nav.tools}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">{t.footer.notice}</h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="text-xs leading-relaxed">
                {t.footer.disclaimerFull}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border-color)] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[var(--text-secondary)]">
            {t.footer.copyright}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {t.footer.dataBy}
          </p>
        </div>
      </div>
    </footer>
  );
}
