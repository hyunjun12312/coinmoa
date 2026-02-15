'use client';

import { useEffect, useState, useCallback } from 'react';
import { Activity, Globe, TrendingUp, TrendingDown, Gauge } from 'lucide-react';
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
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
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
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse h-24" />
        ))}
      </div>
    );
  }

  const fg = data?.fearGreed?.current;
  const fgValue = fg ? parseInt(fg.value) : 50;
  const fgColor = fgValue <= 25 ? 'var(--accent-red)' : fgValue <= 45 ? '#ff8c00' : fgValue <= 55 ? 'var(--accent-yellow)' : fgValue <= 75 ? 'var(--accent-green)' : '#00ff88';
  const fgLabel = fgValue <= 25 ? t.dashboard.extremeFear : fgValue <= 45 ? t.dashboard.fear : fgValue <= 55 ? t.dashboard.neutral : fgValue <= 75 ? t.dashboard.greed : t.dashboard.extremeGreed;
  
  const global = data?.global;
  const marketCapChange = global?.marketCapChangePercentage24h || 0;

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {/* Fear & Greed */}
        <div className="card text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Gauge className="h-4 w-4 text-[var(--text-secondary)]" />
            <span className="text-xs text-[var(--text-secondary)]">{t.dashboard.fearGreedIndex}</span>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: fgColor }}>
            {fgValue}
          </div>
          <span className="text-xs font-medium" style={{ color: fgColor }}>{fgLabel}</span>
          {/* Mini gauge bar */}
          <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--bg-secondary)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${fgValue}%`, background: `linear-gradient(90deg, var(--accent-red), var(--accent-yellow), var(--accent-green))` }}
            />
          </div>
        </div>

        {/* Total Market Cap */}
        <div className="card">
          <div className="flex items-center gap-1 mb-2">
            <Globe className="h-4 w-4 text-[var(--text-secondary)]" />
            <span className="text-xs text-[var(--text-secondary)]">{t.dashboard.totalMarketCap}</span>
          </div>
          <div className="text-xl font-bold">{global ? formatMarketCap(global.totalMarketCap) : '-'}</div>
          <span className={`text-xs font-medium ${marketCapChange >= 0 ? 'price-up' : 'price-down'}`}>
            {formatPercent(marketCapChange)}
          </span>
        </div>

        {/* BTC Dominance */}
        <div className="card">
          <div className="flex items-center gap-1 mb-2">
            <Activity className="h-4 w-4 text-[var(--accent-yellow)]" />
            <span className="text-xs text-[var(--text-secondary)]">{t.dashboard.btcDominance}</span>
          </div>
          <div className="text-xl font-bold">{global ? `${global.btcDominance.toFixed(1)}%` : '-'}</div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--bg-secondary)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--accent-yellow)]"
              style={{ width: `${global?.btcDominance || 0}%` }}
            />
          </div>
        </div>

        {/* 24h Volume */}
        <div className="card">
          <div className="flex items-center gap-1 mb-2">
            <TrendingUp className="h-4 w-4 text-[var(--accent-blue)]" />
            <span className="text-xs text-[var(--text-secondary)]">{t.dashboard.volume24h}</span>
          </div>
          <div className="text-xl font-bold">{global ? formatMarketCap(global.totalVolume) : '-'}</div>
          <span className="text-xs text-[var(--text-secondary)]">
            {global ? `${global.activeCryptos?.toLocaleString()} ${t.dashboard.activeCoins}` : '-'}
          </span>
        </div>
      </div>

      {/* Trending Coins */}
      {data?.trending && data.trending.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔥</span>
            <h3 className="text-sm font-bold">{t.dashboard.trendingCoins}</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {data.trending.map((coin, i) => (
              <div
                key={coin.id}
                className="shrink-0 flex items-center gap-2 rounded-lg bg-[var(--bg-secondary)] p-2.5 min-w-[140px]"
              >
                <span className="text-xs text-[var(--text-secondary)] font-mono">#{i + 1}</span>
                <img src={coin.thumb} alt={coin.name} className="h-6 w-6 rounded-full" />
                <div>
                  <span className="text-xs font-medium">{coin.symbol.toUpperCase()}</span>
                  <div className={`text-[10px] font-medium ${
                    coin.priceChangePercentage24h >= 0 ? 'price-up' : 'price-down'
                  }`}>
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
