'use client';

import { useEffect, useState, useCallback } from 'react';
import { ExternalLink, RefreshCw, Newspaper } from 'lucide-react';
import type { NewsItem } from '@/types';
import { timeAgo } from '@/lib/api';
import { useDictionary } from '@/i18n/DictionaryProvider';

export default function NewsFeed({ limit = 20 }: { limit?: number }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const { dictionary: t } = useDictionary();

  const fetchNews = useCallback(async () => {
    setError(false);
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setNews(data);
          if (data.length === 0) setError(true);
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }
    } catch (e) {
      console.error('Failed to fetch news', e);
      setError(true);
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

  const sentimentColor = (s?: string) => {
    if (s === 'positive') return 'bg-[var(--accent-green)]';
    if (s === 'negative') return 'bg-[var(--accent-red)]';
    return 'bg-[var(--text-muted)]';
  };

  const sentimentBg = (s?: string) => {
    if (s === 'positive') return 'border-l-[var(--accent-green)]';
    if (s === 'negative') return 'border-l-[var(--accent-red)]';
    return 'border-l-transparent';
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
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-color)]">
          <div className="h-5 w-32 bg-[var(--bg-elevated)] rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--bg-secondary)] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden relative">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-[var(--accent-blue)]/10">
            <Newspaper className="h-3.5 w-3.5 text-[var(--accent-blue)]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold">{t.news.realTimeNews}</h2>
          </div>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-green)] live-dot" />
        </div>
        <button
          onClick={fetchNews}
          className="flex items-center justify-center h-8 w-8 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 px-5 py-3 overflow-x-auto border-b border-[var(--border-subtle)]">
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
      <div className="divide-y divide-[var(--border-subtle)]">
        {filtered.slice(0, limit).map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block px-5 py-3.5 transition-colors hover:bg-[var(--bg-card-hover)] group border-l-2 ${sentimentBg(item.sentiment)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-medium leading-[1.5] group-hover:text-[var(--accent-blue)] transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--accent-blue)]">
                    {item.source}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">{timeAgo(item.publishedAt)}</span>
                  <div className={`h-1.5 w-1.5 rounded-full ${sentimentColor(item.sentiment)}`} />
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 px-5">
          {error ? (
            <div>
              <p className="text-sm text-[var(--text-tertiary)] mb-3">Failed to load news</p>
              <button
                onClick={fetchNews}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent-blue)] text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-tertiary)]">{t.common.noData || 'No news found'}</p>
          )}
        </div>
      )}
    </div>
  );
}
