'use client';

import { useEffect, useState, useCallback } from 'react';
import { formatMarketCap, formatPercent } from '@/lib/api';
import { useDictionary } from '@/i18n/DictionaryProvider';

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
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse h-[100px]" />
        ))}
      </div>
    );
  }

  const fg = data?.fearGreed?.current;
  const fgValue = fg ? parseInt(fg.value) : 50;
  const fgColor = fgValue <= 25 ? 'var(--accent-red)' : fgValue <= 45 ? 'var(--accent-yellow)' : fgValue <= 55 ? 'var(--text-secondary)' : fgValue <= 75 ? 'var(--accent-green)' : 'var(--accent-green)';
  const fgLabel = fgValue <= 25 ? t.dashboard.extremeFear : fgValue <= 45 ? t.dashboard.fear : fgValue <= 55 ? t.dashboard.neutral : fgValue <= 75 ? t.dashboard.greed : t.dashboard.extremeGreed;

  const global = data?.global;
  const marketCapChange = global?.marketCapChangePercentage24h || 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {/* Fear & Greed */}
        <div className="card !p-5">
          <p className="text-xs text-[var(--text-secondary)] mb-2">{t.dashboard.fearGreedIndex}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums" style={{ color: fgColor }}>{fgValue}</span>
            <span className="text-[11px] font-medium" style={{ color: fgColor }}>{fgLabel}</span>
          </div>
          <div className="mt-2 h-1 w-full rounded-full bg-[var(--bg-secondary)] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${fgValue}%`, background: fgColor }} />
          </div>
        </div>

        {/* Total Market Cap */}
        <div className="card !p-5">
          <p className="text-xs text-[var(--text-secondary)] mb-2">{t.dashboard.totalMarketCap}</p>
          <div className="text-lg font-semibold">{global ? formatMarketCap(global.totalMarketCap) : '-'}</div>
          <span className={`text-[11px] font-medium ${marketCapChange >= 0 ? 'price-up' : 'price-down'}`}>
            {formatPercent(marketCapChange)}
          </span>
        </div>

        {/* BTC Dominance */}
        <div className="card !p-5">
          <p className="text-xs text-[var(--text-secondary)] mb-2">{t.dashboard.btcDominance}</p>
          <div className="text-lg font-semibold">{global ? `${global.btcDominance.toFixed(1)}%` : '-'}</div>
          <div className="mt-1.5 h-1 w-full rounded-full bg-[var(--bg-secondary)] overflow-hidden">
            <div className="h-full rounded-full bg-[var(--accent-yellow)]/70" style={{ width: `${global?.btcDominance || 0}%` }} />
          </div>
        </div>

        {/* 24h Volume */}
        <div className="card !p-5">
          <p className="text-xs text-[var(--text-secondary)] mb-2">{t.dashboard.volume24h}</p>
          <div className="text-lg font-semibold">{global ? formatMarketCap(global.totalVolume) : '-'}</div>
          <span className="text-[11px] text-[var(--text-secondary)]">
            {global ? `${global.activeCryptos?.toLocaleString()} ${t.dashboard.activeCoins}` : '-'}
          </span>
        </div>
      </div>

      {/* Trending */}
      {data?.trending && data.trending.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {data.trending.map((coin, i) => (
            <div key={coin.id} className="shrink-0 flex items-center gap-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2.5">
              <img src={coin.thumb} alt={coin.name} className="h-6 w-6 rounded-full" />
              <span className="text-sm font-medium">{coin.symbol.toUpperCase()}</span>
              <span className={`text-xs font-medium ${coin.priceChangePercentage24h >= 0 ? 'price-up' : 'price-down'}`}>
                {formatPercent(coin.priceChangePercentage24h)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
