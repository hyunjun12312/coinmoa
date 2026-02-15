'use client';

import SocialFeed from '@/components/SocialFeed';
import AdBanner from '@/components/AdBanner';
import { CRYPTO_INFLUENCERS } from '@/lib/constants';
import { CheckCircle2 } from 'lucide-react';
import { useDictionary } from '@/i18n/DictionaryProvider';

export default function SocialPageClient() {
  const { dictionary: t } = useDictionary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold mb-1">{t.social.title}</h1>
        <p className="text-sm text-[var(--text-secondary)]">{t.social.subtitle}</p>
      </div>

      {/* Influencer list */}
      <div className="card">
        <h2 className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-4">{t.social.monitoring}</h2>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {CRYPTO_INFLUENCERS.slice(0, 6).map((inf) => (
            <div key={inf.handle} className="flex items-center gap-3 rounded-lg bg-[var(--bg-secondary)] px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] text-sm font-semibold shrink-0">
                {inf.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-medium truncate">{inf.name}</span>
                  {inf.verified && <CheckCircle2 className="h-3 w-3 text-[var(--accent-blue)] shrink-0" />}
                </div>
                <span className="text-[10px] text-[var(--text-tertiary)]">@{inf.handle} · {inf.followers}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdBanner slot="social-top" className="min-h-[90px]" />
      <SocialFeed limit={60} />
      <AdBanner slot="social-bottom" className="min-h-[90px]" />
    </div>
  );
}
