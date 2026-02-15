'use client';

import SocialFeed from '@/components/SocialFeed';
import AdBanner from '@/components/AdBanner';
import { CRYPTO_INFLUENCERS } from '@/lib/constants';
import { CheckCircle2 } from 'lucide-react';
import { useDictionary } from '@/i18n/DictionaryProvider';

export default function SocialPage() {
  const { dictionary: t } = useDictionary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">{t.social.title}</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {t.social.subtitle}
        </p>
      </div>

      {/* Influencer list */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3">🔍 {t.social.monitoring}</h2>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {CRYPTO_INFLUENCERS.slice(0, 6).map((inf) => (
            <div key={inf.handle} className="flex items-center gap-3 rounded-lg bg-[var(--bg-secondary)] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] text-sm font-bold shrink-0">
                {inf.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold truncate">{inf.name}</span>
                  {inf.verified && <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-blue)] shrink-0" />}
                </div>
                <span className="text-[10px] text-[var(--text-secondary)]">@{inf.handle} · {inf.followers}</span>
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 line-clamp-1">{inf.description}</p>
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
