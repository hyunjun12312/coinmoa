'use client';

import { useEffect, useState, useCallback } from 'react';
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
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
    const interval = setInterval(fetchNews, 120000); // 2분마다 갱신
    return () => clearInterval(interval);
  }, [fetchNews]);

  const filtered = filter === 'all'
    ? news
    : news.filter(n => n.categories?.some(c => c.toLowerCase().includes(filter)));

  const sentimentIcon = (s?: string) => {
    if (s === 'positive') return <TrendingUp className="h-3.5 w-3.5 text-[var(--accent-green)]" />;
    if (s === 'negative') return <TrendingDown className="h-3.5 w-3.5 text-[var(--accent-red)]" />;
    return <Minus className="h-3.5 w-3.5 text-[var(--text-secondary)]" />;
  };

  const sentimentBg = (s?: string) => {
    if (s === 'positive') return 'border-l-[var(--accent-green)]';
    if (s === 'negative') return 'border-l-[var(--accent-red)]';
    return 'border-l-[var(--border-color)]';
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
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-5 w-3/4 bg-[var(--bg-secondary)] rounded mb-2" />
            <div className="h-3 w-1/2 bg-[var(--bg-secondary)] rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-[var(--accent-blue)]" />
          <h2 className="text-lg font-bold">{t.news.realTimeNews}</h2>
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent-green)] live-dot" />
        </div>
        <button onClick={fetchNews} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs transition ${
              filter === f.id
                ? 'bg-[var(--accent-blue)] text-white'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-3">
        {filtered.slice(0, limit).map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`card block border-l-4 ${sentimentBg(item.sentiment)} hover:border-l-[var(--accent-blue)] group`}
          >
            <div className="flex items-start gap-3">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-16 w-24 rounded-lg object-cover shrink-0 hidden sm:block"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {sentimentIcon(item.sentiment)}
                  <span className="text-[10px] text-[var(--accent-blue)] font-medium uppercase">{item.source}</span>
                  <span className="text-[10px] text-[var(--text-secondary)]">{timeAgo(item.publishedAt)}</span>
                </div>
                <h3 className="text-sm font-medium leading-snug group-hover:text-[var(--accent-blue)] transition line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-1">
                  {item.description}
                </p>
                {item.categories && item.categories.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {item.categories.slice(0, 3).map(cat => (
                      <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <ExternalLink className="h-4 w-4 text-[var(--text-secondary)] shrink-0 opacity-0 group-hover:opacity-100 transition" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
