'use client';

import { useEffect, useState, useCallback } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import type { NewsItem } from '@/types';
import { timeAgo } from '@/lib/api';
import { useDictionary } from '@/i18n/DictionaryProvider';

export default function NewsFeed({ limit = 20 }: { limit?: number }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { dictionary: t } = useDictionary();

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setNews(data);
      }
    } catch (e) {
      console.error('Failed to fetch news', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 120000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const filtered = filter === 'all'
    ? news
    : news.filter(n => n.categories?.some(c => c.toLowerCase().includes(filter)));

  const sentimentDot = (s?: string) => {
    if (s === 'positive') return 'bg-[var(--accent-green)]';
    if (s === 'negative') return 'bg-[var(--accent-red)]';
    return 'bg-[var(--text-tertiary)]';
  };

  const filters = [
    { id: 'all', label: t.news.categories.all },
    { id: 'btc', label: t.news.categories.btc },
    { id: 'eth', label: t.news.categories.eth },
    { id: 'defi', label: t.news.categories.defi },
    { id: 'regulation', label: t.news.categories.regulation },
    { id: 'exchange', label: t.news.categories.exchange },
  ];

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-[var(--bg-card)] rounded-[var(--radius)] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">{t.news.realTimeNews}</h2>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-green)] live-dot" />
        </div>
        <button onClick={fetchNews} className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`pill ${filter === f.id ? 'pill-active' : 'pill-inactive'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-1">
        {filtered.slice(0, limit).map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg px-4 py-3.5 transition-colors hover:bg-[var(--bg-card)] group"
          >
            <div className="flex items-start gap-2.5">
              <div className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${sentimentDot(item.sentiment)}`} />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium leading-snug group-hover:text-[var(--accent-blue)] transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2.5 mt-1.5">
                  <span className="text-[11px] text-[var(--accent-blue)]/70">{item.source}</span>
                  <span className="text-[11px] text-[var(--text-tertiary)]">{timeAgo(item.publishedAt)}</span>
                </div>
              </div>
              <ExternalLink className="h-3 w-3 text-[var(--text-tertiary)] shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
