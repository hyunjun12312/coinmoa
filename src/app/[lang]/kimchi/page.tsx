'use client';

import KimchiPremiumTable from '@/components/KimchiPremiumTable';
import AdBanner from '@/components/AdBanner';
import { useDictionary } from '@/i18n/DictionaryProvider';

export default function KimchiPage() {
  const { dictionary: t } = useDictionary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold mb-1">{t.kimchi.title}</h1>
        <p className="text-sm text-[var(--text-secondary)]">{t.kimchi.subtitle}</p>
      </div>

      <AdBanner slot="kimchi-top" className="min-h-[90px]" />

      <KimchiPremiumTable />

      <div className="card">
        <h3 className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2">{t.kimchi.whatIs}</h3>
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
          {t.kimchi.whatIsDesc}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="rounded-lg bg-[var(--accent-green)]/8 px-2 py-2">
            <div className="font-medium text-[var(--accent-green)]">{t.kimchi.positive}</div>
            <div className="text-[var(--text-secondary)] mt-0.5">{t.kimchi.positiveDesc}</div>
          </div>
          <div className="rounded-lg bg-[var(--accent-yellow)]/8 px-2 py-2">
            <div className="font-medium text-[var(--accent-yellow)]">{t.kimchi.zero}</div>
            <div className="text-[var(--text-secondary)] mt-0.5">{t.kimchi.zeroDesc}</div>
          </div>
          <div className="rounded-lg bg-[var(--accent-red)]/8 px-2 py-2">
            <div className="font-medium text-[var(--accent-red)]">{t.kimchi.negative}</div>
            <div className="text-[var(--text-secondary)] mt-0.5">{t.kimchi.negativeDesc}</div>
          </div>
        </div>
      </div>

      <AdBanner slot="kimchi-bottom" className="min-h-[90px]" />
    </div>
  );
}
