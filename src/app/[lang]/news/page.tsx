'use client';

import NewsFeed from '@/components/NewsFeed';
import AdBanner from '@/components/AdBanner';
import { useDictionary } from '@/i18n/DictionaryProvider';

export default function NewsPage() {
  const { dictionary: t } = useDictionary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold mb-1">{t.news.title}</h1>
        <p className="text-sm text-[var(--text-secondary)]">{t.news.subtitle}</p>
      </div>

      <AdBanner slot="news-top" className="min-h-[90px]" />

      <NewsFeed limit={50} />

      <AdBanner slot="news-bottom" className="min-h-[90px]" />
    </div>
  );
}
