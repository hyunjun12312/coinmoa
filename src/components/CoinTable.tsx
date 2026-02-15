'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
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
    const interval = setInterval(fetchCoins, 30000);
    return () => clearInterval(interval);
  }, [fetchCoins]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(key === 'market_cap_rank'); }
  };

  const sorted = [...coins].sort((a, b) => {
    const va = a[sortKey] ?? 0;
    const vb = b[sortKey] ?? 0;
    return sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <th
      onClick={() => handleSort(sortKeyName)}
      className="cursor-pointer px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider hover:text-[var(--text-secondary)] transition-colors select-none"
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-2.5 w-2.5 ${sortKey === sortKeyName ? 'opacity-80' : 'opacity-30'}`} />
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="card !p-0 overflow-hidden">
        <div className="p-4 space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-10 bg-[var(--bg-secondary)] rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden !p-0">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
        <div>
          <h2 className="text-base font-semibold">{t.dashboard.realTimePrice}</h2>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{t.dashboard.top100}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--text-tertiary)] tabular-nums">
            {lastUpdate.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchCoins}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-color)]">
              <SortHeader label={t.common.rank} sortKeyName="market_cap_rank" />
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{t.common.coin}</th>
              <SortHeader label={t.common.price} sortKeyName="current_price" />
              <SortHeader label={t.common.change24h} sortKeyName="price_change_percentage_24h" />
              <SortHeader label={t.common.marketCap} sortKeyName="market_cap" />
              <SortHeader label={t.common.volume24h} sortKeyName="total_volume" />
              <th className="px-4 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{t.common.chart7d}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((coin) => (
              <tr
                key={coin.id}
                className="border-b border-[var(--border-color)]/40 hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                <td className="px-4 py-3.5 text-xs text-[var(--text-tertiary)] tabular-nums">{coin.market_cap_rank}</td>
                <td className="px-4 py-3.5">
                  <Link href={`/${lang}/coin/${coin.id}`} className="flex items-center gap-3 group">
                    <img src={coin.image} alt={coin.name} className="h-7 w-7 rounded-full" />
                    <span className="text-sm font-medium group-hover:text-[var(--accent-blue)] transition-colors">
                      {coin.name}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)] uppercase">{coin.symbol}</span>
                  </Link>
                </td>
                <td className="px-4 py-3.5 text-sm font-mono tabular-nums">{formatPrice(coin.current_price)}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-sm font-medium tabular-nums ${
                    coin.price_change_percentage_24h >= 0 ? 'price-up' : 'price-down'
                  }`}>
                    {formatPercent(coin.price_change_percentage_24h || 0)}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm text-[var(--text-secondary)] tabular-nums">{formatMarketCap(coin.market_cap)}</td>
                <td className="px-4 py-3.5 text-sm text-[var(--text-secondary)] tabular-nums">{formatMarketCap(coin.total_volume)}</td>
                <td className="px-4 py-3.5">
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
  if (data.length === 0) return <div className="h-7 w-16" />;

  const sampled = data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 24)) === 0);
  const min = Math.min(...sampled);
  const max = Math.max(...sampled);
  const range = max - min || 1;
  const width = 64;
  const height = 28;

  const points = sampled
    .map((v, i) => {
      const x = (i / (sampled.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible opacity-70">
      <polyline
        fill="none"
        stroke={isPositive ? 'var(--accent-green)' : 'var(--accent-red)'}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
