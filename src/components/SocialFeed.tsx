'use client';

import { useEffect, useState, useCallback } from 'react';
import { Heart, Repeat2, MessageCircle, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { SocialPost } from '@/types';
import { timeAgo } from '@/lib/api';
import { useDictionary } from '@/i18n/DictionaryProvider';

const platformColors: Record<string, string> = {
  twitter: '#1DA1F2',
  reddit: '#FF4500',
  youtube: '#FF0000',
};

export default function SocialFeed({ limit = 30 }: { limit?: number }) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [coinFilter, setCoinFilter] = useState<string>('all');
  const { dictionary: t } = useDictionary();

  const fetchSocial = useCallback(async () => {
    try {
      const res = await fetch('/api/social');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setPosts(data);
      }
    } catch (e) {
      console.error('Failed to fetch social feed', e);
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

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-[var(--bg-card)] rounded-[var(--radius)] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">{t.social.feedTitle}</h2>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-green)] live-dot" />
        </div>
        <button onClick={fetchSocial} className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {['all', 'twitter', 'reddit'].map(p => (
          <button
            key={p}
            onClick={() => setPlatformFilter(p)}
            className={`pill ${platformFilter === p ? 'pill-active' : 'pill-inactive'}`}
          >
            {p === 'all' ? t.social.allPlatforms : p === 'twitter' ? '𝕏' : 'Reddit'}
          </button>
        ))}
        {allCoins.length > 0 && (
          <>
            <span className="w-px h-5 bg-[var(--border-color)] self-center mx-0.5" />
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
                {coin}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Posts */}
      <div className="space-y-1.5">
        {filtered.slice(0, limit).map((post) => {
          const pColor = platformColors[post.platform] || '#888';
          return (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg px-3 py-3 transition-colors hover:bg-[var(--bg-card)] group"
            >
              <div className="flex gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-semibold shrink-0"
                  style={{ background: pColor }}
                >
                  {post.author?.charAt(0).toUpperCase() || '?'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[13px] font-medium">{post.author}</span>
                    {post.verified && <CheckCircle2 className="h-3 w-3 text-[var(--accent-blue)]" />}
                    <span className="text-[11px] text-[var(--text-tertiary)]">{post.authorHandle}</span>
                    <span className="text-[10px] text-[var(--text-tertiary)]">· {timeAgo(post.publishedAt)}</span>
                  </div>

                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed line-clamp-2 mb-1.5">
                    {post.content}
                  </p>

                  {post.relatedCoins && post.relatedCoins.length > 0 && (
                    <div className="flex gap-1 mb-1.5">
                      {post.relatedCoins.map(coin => (
                        <span key={coin} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-blue)]/8 text-[var(--accent-blue)]/80">
                          ${coin}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-[var(--text-tertiary)]">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}K` : post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Repeat2 className="h-3 w-3" />
                      {post.reposts >= 1000 ? `${(post.reposts / 1000).toFixed(1)}K` : post.reposts}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {post.comments}
                    </span>
                    <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg bg-[var(--bg-card)] text-center py-8">
          <p className="text-[13px] text-[var(--text-secondary)]">{t.common.noData || 'No posts found'}</p>
        </div>
      )}
    </div>
  );
}
