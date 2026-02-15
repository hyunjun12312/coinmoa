'use client';

import { useEffect, useState, useCallback } from 'react';
import { MessageCircle, Heart, Repeat2, ExternalLink, RefreshCw, Users, CheckCircle2 } from 'lucide-react';
import type { SocialPost } from '@/types';
import { timeAgo } from '@/lib/api';
import { useDictionary } from '@/i18n/DictionaryProvider';

const platformIcons: Record<string, { color: string; label: string }> = {
  twitter: { color: '#1DA1F2', label: '𝕏' },
  reddit: { color: '#FF4500', label: 'Reddit' },
  youtube: { color: '#FF0000', label: 'YouTube' },
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
    const interval = setInterval(fetchSocial, 60000); // 1분마다 갱신
    return () => clearInterval(interval);
  }, [fetchSocial]);

  // 관련 코인 추출
  const allCoins = [...new Set(posts.flatMap(p => p.relatedCoins || []))].sort();

  const filtered = posts
    .filter(p => platformFilter === 'all' || p.platform === platformFilter)
    .filter(p => coinFilter === 'all' || p.relatedCoins?.includes(coinFilter));

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-[var(--bg-secondary)]" />
              <div className="flex-1">
                <div className="h-4 w-1/3 bg-[var(--bg-secondary)] rounded mb-2" />
                <div className="h-3 w-full bg-[var(--bg-secondary)] rounded mb-1" />
                <div className="h-3 w-2/3 bg-[var(--bg-secondary)] rounded" />
              </div>
            </div>
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
          <Users className="h-5 w-5 text-[var(--accent-purple)]" />
          <h2 className="text-lg font-bold">{t.social.feedTitle}</h2>
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent-green)] live-dot" />
        </div>
        <button onClick={fetchSocial} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex gap-1">
          {['all', 'twitter', 'reddit'].map(p => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`rounded-full px-3 py-1 text-xs transition ${
                platformFilter === p
                  ? 'bg-[var(--accent-purple)] text-white'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {p === 'all' ? t.social.allPlatforms : platformIcons[p]?.label || p}
            </button>
          ))}
        </div>
        {allCoins.length > 0 && (
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setCoinFilter('all')}
              className={`shrink-0 rounded-full px-2 py-1 text-[10px] transition ${
                coinFilter === 'all'
                  ? 'bg-[var(--accent-blue)] text-white'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)]'
              }`}
            >
              {t.social.allCoins}
            </button>
            {allCoins.slice(0, 8).map(coin => (
              <button
                key={coin}
                onClick={() => setCoinFilter(coin)}
                className={`shrink-0 rounded-full px-2 py-1 text-[10px] transition ${
                  coinFilter === coin
                    ? 'bg-[var(--accent-blue)] text-white'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)]'
                }`}
              >
                {coin}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {filtered.slice(0, limit).map((post) => {
          const platform = platformIcons[post.platform] || { color: '#888', label: post.platform };
          return (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card block group"
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold shrink-0"
                  style={{ background: platform.color }}
                >
                  {post.author?.charAt(0).toUpperCase() || '?'}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Author row */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">{post.author}</span>
                    {post.verified && <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-blue)]" />}
                    <span className="text-xs text-[var(--text-secondary)]">{post.authorHandle}</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">· {timeAgo(post.publishedAt)}</span>
                  </div>
                  
                  {/* Content */}
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed line-clamp-3 mb-2">
                    {post.content}
                  </p>
                  
                  {/* Coin tags */}
                  {post.relatedCoins && post.relatedCoins.length > 0 && (
                    <div className="flex gap-1 mb-2">
                      {post.relatedCoins.map(coin => (
                        <span
                          key={coin}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]"
                        >
                          ${coin}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Metrics */}
                  <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
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
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ color: platform.color, background: `${platform.color}15` }}
                    >
                      {platform.label}
                    </span>
                    <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card text-center py-8">
          <p className="text-[var(--text-secondary)]">해당 필터에 맞는 게시물이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
