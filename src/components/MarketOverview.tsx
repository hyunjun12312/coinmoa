'use client';

import { useEffect, useState, useCallback } from 'react';
import { formatMarketCap, formatPercent } from '@/lib/api';
import { useDictionary } from '@/i18n/DictionaryProvider';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface OverviewData {
  fearGreed: {
    current: { value: string; value_classification: string };
    history: { value: string; timestamp: string }[];
  } | null;
  trending: {
    id: string; name: string; symbol: string; thumb: string;
    score: number; marketCapRank: number; priceChangePercentage24h: number;
  }[] | null;
  global: {
    totalMarketCap: number;
    totalVolume: number;
    btcDominance: number;
    ethDominance: number;
    marketCapChangePercentage24h: number;
    activeCryptos: number;
  } | null;
}

export default function MarketOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const { dictionary: t } = useDictionary();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/overview');
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error('Failed to fetch overview', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[110px] rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] animate-pulse" />
        ))}
      </div>
    );
  }

  const fg = data?.fearGreed?.current;
  const fgValue = fg ? parseInt(fg.value) : 50;
  const fgColor = fgValue <= 25 ? 'var(--accent-red)' : fgValue <= 45 ? 'var(--accent-yellow)' : fgValue <= 55 ? 'var(--text-secondary)' : 'var(--accent-green)';
  const fgLabel = fgValue <= 25 ? t.dashboard.extremeFear : fgValue <= 45 ? t.dashboard.fear : fgValue <= 55 ? t.dashboard.neutral : fgValue <= 75 ? t.dashboard.greed : t.dashboard.extremeGreed;

  const global = data?.global;
  const marketCapChange = global?.marketCapChangePercentage24h || 0;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Fear & Greed */}
        <div className="relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, var(--accent-red), var(--accent-yellow), var(--accent-green))` }} />
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-3">{t.dashboard.fearGreedIndex}</p>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold tabular-nums tracking-tight" style={{ color: fgColor }}>{fgValue}</span>
              <span className="text-xs font-semibold ml-2" style={{ color: fgColor }}>{fgLabel}</span>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${fgValue}%`, background: fgColor }} />
          </div>
        </div>

        {/* Total Market Cap */}
        <div className="relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-3">{t.dashboard.totalMarketCap}</p>
          <div className="text-xl font-bold tracking-tight">{global ? formatMarketCap(global.totalMarketCap) : '-'}</div>
          <div className="flex items-center gap-1 mt-1.5">
            {marketCapChange >= 0 ? (
              <ArrowUpRight className="h-3.5 w-3.5 text-[var(--accent-green)]" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5 text-[var(--accent-red)]" />
            )}
            <span className={`text-xs font-semibold tabular-nums ${marketCapChange >= 0 ? 'price-up' : 'price-down'}`}>
              {formatPercent(marketCapChange)}
            </span>
            <span className="text-xs text-[var(--text-muted)]">24h</span>
          </div>
        </div>

        {/* BTC Dominance */}
        <div className="relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-3">{t.dashboard.btcDominance}</p>
          <div className="text-xl font-bold tracking-tight">{global ? `${global.btcDominance.toFixed(1)}%` : '-'}</div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
            <div className="h-full rounded-full bg-[var(--accent-yellow)]" style={{ width: `${global?.btcDominance || 0}%`, opacity: 0.7 }} />
          </div>
        </div>

        {/* 24h Volume */}
        <div className="relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-3">{t.dashboard.volume24h}</p>
          <div className="text-xl font-bold tracking-tight">{global ? formatMarketCap(global.totalVolume) : '-'}</div>
          <div className="mt-1.5 text-xs text-[var(--text-tertiary)]">
            {global ? `${global.activeCryptos?.toLocaleString()} ${t.dashboard.activeCoins}` : '-'}
          </div>
        </div>
      </div>

      {/* Trending Coins */}
      {data?.trending && data.trending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-[var(--accent-yellow)]" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">Trending</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {data.trending.map((coin, i) => (
              <div
                key={coin.id}
                className="shrink-0 flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3 hover:border-[var(--border-color-hover)] transition-all"
              >
                <span className="text-xs font-bold text-[var(--text-muted)] w-4">{i + 1}</span>
                <img src={coin.thumb} alt={coin.name} className="h-7 w-7 rounded-full" />
                <div>
                  <span className="text-sm font-semibold">{coin.symbol.toUpperCase()}</span>
                  <div className={`text-xs font-medium tabular-nums ${coin.priceChangePercentage24h >= 0 ? 'price-up' : 'price-down'}`}>
                    {formatPercent(coin.priceChangePercentage24h)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
