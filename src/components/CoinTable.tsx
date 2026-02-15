'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ArrowUpDown, RefreshCw } from 'lucide-react';
import { formatPrice, formatMarketCap, formatPercent } from '@/lib/api';
import type { CoinData } from '@/types';
import { useDictionary } from '@/i18n/DictionaryProvider';

type SortKey = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'market_cap' | 'total_volume';

export default function CoinTable() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('market_cap_rank');
  const [sortAsc, setSortAsc] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { dictionary: t, lang } = useDictionary();

  const fetchCoins = useCallback(async () => {
    try {
      const res = await fetch('/api/coins');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCoins(data);
          setLastUpdate(new Date());
        }
      }
    } catch (e) {
      console.error('Failed to fetch coins', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 30000); // 30초마다 갱신
    return () => clearInterval(interval);
  }, [fetchCoins]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === 'market_cap_rank');
    }
  };

  const sorted = [...coins].sort((a, b) => {
    const va = a[sortKey] ?? 0;
    const vb = b[sortKey] ?? 0;
    return sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <th
      onClick={() => handleSort(sortKeyName)}
      className="cursor-pointer px-3 py-3 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition select-none"
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3 opacity-40" />
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-[var(--bg-secondary)] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
        <div>
          <h2 className="text-lg font-bold">{t.dashboard.realTimePrice}</h2>
          <p className="text-xs text-[var(--text-secondary)]">{t.dashboard.top100}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[var(--text-secondary)]">
            {lastUpdate.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchCoins}
            className="flex items-center gap-1 rounded-lg bg-[var(--bg-secondary)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
          >
            <RefreshCw className="h-3 w-3" />
            {t.common.refresh}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--bg-secondary)]">
            <tr>
              <SortHeader label={t.common.rank} sortKeyName="market_cap_rank" />
              <th className="px-3 py-3 text-left text-xs font-medium text-[var(--text-secondary)]">{t.common.coin}</th>
              <SortHeader label={t.common.price} sortKeyName="current_price" />
              <SortHeader label={t.common.change24h} sortKeyName="price_change_percentage_24h" />
              <SortHeader label={t.common.marketCap} sortKeyName="market_cap" />
              <SortHeader label={t.common.volume24h} sortKeyName="total_volume" />
              <th className="px-3 py-3 text-xs font-medium text-[var(--text-secondary)]">{t.common.chart7d}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((coin) => (
              <tr
                key={coin.id}
                className="border-b border-[var(--border-color)]/50 hover:bg-[var(--bg-card-hover)] transition"
              >
                <td className="px-3 py-3 text-sm text-[var(--text-secondary)]">{coin.market_cap_rank}</td>
                <td className="px-3 py-3">
                  <Link href={`/${lang}/coin/${coin.id}`} className="flex items-center gap-2 group">
                    <img src={coin.image} alt={coin.name} className="h-7 w-7 rounded-full" />
                    <div>
                      <span className="text-sm font-medium group-hover:text-[var(--accent-blue)] transition">
                        {coin.name}
                      </span>
                      <span className="ml-2 text-xs text-[var(--text-secondary)] uppercase">{coin.symbol}</span>
                    </div>
                  </Link>
                </td>
                <td className="px-3 py-3 text-sm font-mono">{formatPrice(coin.current_price)}</td>
                <td className="px-3 py-3">
                  <span className={`flex items-center gap-1 text-sm font-medium ${
                    coin.price_change_percentage_24h >= 0 ? 'price-up' : 'price-down'
                  }`}>
                    {coin.price_change_percentage_24h >= 0 ?
                      <TrendingUp className="h-3 w-3" /> :
                      <TrendingDown className="h-3 w-3" />
                    }
                    {formatPercent(coin.price_change_percentage_24h || 0)}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-[var(--text-secondary)]">{formatMarketCap(coin.market_cap)}</td>
                <td className="px-3 py-3 text-sm text-[var(--text-secondary)]">{formatMarketCap(coin.total_volume)}</td>
                <td className="px-3 py-3">
                  <MiniChart
                    data={coin.sparkline_in_7d?.price || []}
                    isPositive={(coin.price_change_percentage_7d_in_currency || 0) >= 0}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MiniChart({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  if (data.length === 0) return <div className="h-8 w-20" />;
  
  // 간단한 SVG 스파크라인
  const sampled = data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 30)) === 0);
  const min = Math.min(...sampled);
  const max = Math.max(...sampled);
  const range = max - min || 1;
  const width = 80;
  const height = 32;
  
  const points = sampled
    .map((v, i) => {
      const x = (i / (sampled.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={isPositive ? 'var(--accent-green)' : 'var(--accent-red)'}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
}
