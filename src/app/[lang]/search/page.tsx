'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice, formatPercent, formatMarketCap } from '@/lib/api';
import { useDictionary } from '@/i18n/DictionaryProvider';
import type { CoinData } from '@/types';

export default function SearchPage() {
  const { dictionary: t, lang } = useDictionary();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
      );
      if (res.ok) {
        const data = await res.json();
        const ids = (data.coins || []).slice(0, 20).map((c: any) => c.id).join(',');
        if (ids) {
          const priceRes = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=20&page=1&sparkline=false`
          );
          if (priceRes.ok) {
            setResults(await priceRes.json());
          }
        } else {
          setResults([]);
        }
      }
    } catch (e) {
      console.error('Search failed', e);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t.nav.search}</h1>

      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            placeholder="Bitcoin, ETH, Solana..."
            className="w-full rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition"
          />
        </div>
        <button
          onClick={search}
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? '...' : t.nav.search}
        </button>
      </div>

      {/* Results */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse h-16" />
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="card text-center py-10">
          <p className="text-[var(--text-secondary)]">{t.common.noData}</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-2">
          {results.map((coin) => (
            <Link
              key={coin.id}
              href={`/${lang}/coin/${coin.id}`}
              className="card flex items-center gap-4 group"
            >
              <img src={coin.image} alt={coin.name} className="h-10 w-10 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold group-hover:text-[var(--accent-blue)] transition">
                    {coin.name}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] uppercase">{coin.symbol}</span>
                  {coin.market_cap_rank && (
                    <span className="text-[10px] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded text-[var(--text-secondary)]">
                      #{coin.market_cap_rank}
                    </span>
                  )}
                </div>
                <span className="text-xs text-[var(--text-secondary)]">
                  {t.common.marketCap}: {formatMarketCap(coin.market_cap)}
                </span>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono text-sm">{formatPrice(coin.current_price)}</div>
                <span className={`flex items-center gap-1 text-xs justify-end ${
                  (coin.price_change_percentage_24h || 0) >= 0 ? 'price-up' : 'price-down'
                }`}>
                  {(coin.price_change_percentage_24h || 0) >= 0 ?
                    <TrendingUp className="h-3 w-3" /> :
                    <TrendingDown className="h-3 w-3" />
                  }
                  {formatPercent(coin.price_change_percentage_24h || 0)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
