'use client';

import { useEffect, useState, useCallback } from 'react';
import { Heart, Repeat2, MessageCircle, ExternalLink, RefreshCw, CheckCircle2, Users } from 'lucide-react';
import type { SocialPost } from '@/types';
import { timeAgo } from '@/lib/api';
import { useDictionary } from '@/i18n/DictionaryProvider';

const platformColors: Record<string, string> = {
  twitter: '#1DA1F2',
  reddit: '#FF4500',
  youtube: '#FF0000',
};

const platformGradients: Record<string, string> = {
  twitter: 'from-[#1DA1F2] to-[#0d8bdb]',
  reddit: 'from-[#FF4500] to-[#cc3700]',
  youtube: 'from-[#FF0000] to-[#cc0000]',
};

export default function SocialFeed({ limit = 30 }: { limit?: number }) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [coinFilter, setCoinFilter] = useState<string>('all');
  const { dictionary: t } = useDictionary();

  const [error, setError] = useState(false);

  const fetchSocial = useCallback(async () => {
    setError(false);
    try {
      const res = await fetch('/api/social');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data);
          if (data.length === 0) setError(true);
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }
    } catch (e) {
      console.error('Failed to fetch social feed', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSocial();
    const interval = setInterval(fetchSocial, 60000);
    return () => clearInterval(interval);
  }, [fetchSocial]);

  const allCoins = [...new Set(posts.flatMap(p => p.relatedCoins || []))].sort();

  const filtered = posts
    .filter(p => platformFilter === 'all' || p.platform === platformFilter)
    .filter(p => coinFilter === 'all' || p.relatedCoins?.includes(coinFilter));

  const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-color)]">
          <div className="h-5 w-32 bg-[var(--bg-elevated)] rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[var(--bg-secondary)] rounded-lg animate-pulse" />
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
          <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-[var(--accent-purple)]/10">
            <Users className="h-3.5 w-3.5 text-[var(--accent-purple)]" />
          </div>
          <h2 className="text-[15px] font-bold">{t.social.feedTitle}</h2>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-green)] live-dot" />
        </div>
        <button
          onClick={fetchSocial}
          className="flex items-center justify-center h-8 w-8 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5 px-5 py-3 border-b border-[var(--border-subtle)]">
        {['all', 'twitter', 'reddit'].map(p => (
          <button
            key={p}
            onClick={() => setPlatformFilter(p)}
            className={`pill ${platformFilter === p ? 'pill-active' : 'pill-inactive'}`}
          >
            {p === 'all' ? t.social.allPlatforms : p === 'twitter' ? '𝕏 Twitter' : 'Reddit'}
          </button>
        ))}
        {allCoins.length > 0 && (
          <>
            <span className="w-px h-5 bg-[var(--border-color)] self-center mx-1" />
            <button
              onClick={() => setCoinFilter('all')}
              className={`pill ${coinFilter === 'all' ? 'pill-active' : 'pill-inactive'}`}
            >
              {t.social.allCoins}
            </button>
            {allCoins.slice(0, 6).map(coin => (
              <button
                key={coin}
                onClick={() => setCoinFilter(coin)}
                className={`pill ${coinFilter === coin ? 'pill-active' : 'pill-inactive'}`}
              >
                ${coin}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Posts */}
      <div className="divide-y divide-[var(--border-subtle)]">
        {filtered.slice(0, limit).map((post) => {
          const gradient = platformGradients[post.platform] || 'from-gray-500 to-gray-600';
          return (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-5 py-4 transition-colors hover:bg-[var(--bg-card-hover)] group"
            >
              <div className="flex gap-3.5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white text-sm font-bold shrink-0 shadow-sm`}
                >
                  {post.author?.charAt(0).toUpperCase() || '?'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-semibold">{post.author}</span>
                    {post.verified && <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-blue)]" />}
                    <span className="text-xs text-[var(--text-muted)]">{post.authorHandle}</span>
                    <span className="text-xs text-[var(--text-muted)] ml-auto shrink-0">{timeAgo(post.publishedAt)}</span>
                  </div>

                  <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6] line-clamp-2 mb-2.5">
                    {post.content}
                  </p>

                  {post.relatedCoins && post.relatedCoins.length > 0 && (
                    <div className="flex gap-1.5 mb-2.5">
                      {post.relatedCoins.map(coin => (
                        <span key={coin} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[var(--accent-blue)]/8 text-[var(--accent-blue)]">
                          ${coin}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5 hover:text-[var(--accent-red)] transition-colors">
                      <Heart className="h-3.5 w-3.5" />
                      {formatCount(post.likes)}
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-[var(--accent-green)] transition-colors">
                      <Repeat2 className="h-3.5 w-3.5" />
                      {formatCount(post.reposts)}
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-[var(--accent-blue)] transition-colors">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {post.comments}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 px-5">
          {error ? (
            <div>
              <p className="text-sm text-[var(--text-tertiary)] mb-3">Failed to load social data</p>
              <button
                onClick={fetchSocial}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent-blue)] text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-tertiary)]">{t.common.noData || 'No posts found'}</p>
          )}
        </div>
      )}
    </div>
  );
}
