'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowUpDown, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
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

  const SortHeader = ({ label, sortKeyName, align = 'left' }: { label: string; sortKeyName: SortKey; align?: string }) => (
    <th
      onClick={() => handleSort(sortKeyName)}
      className={`cursor-pointer px-4 py-3 text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-[0.05em] hover:text-[var(--text-secondary)] transition-colors select-none whitespace-nowrap ${align === 'right' ? 'text-right' : 'text-left'}`}
    >
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : ''}`}>
        {label}
        {sortKey === sortKeyName ? (
          sortAsc ? <ChevronUp className="h-3 w-3 text-[var(--accent-blue)]" /> : <ChevronDown className="h-3 w-3 text-[var(--accent-blue)]" />
        ) : (
          <ArrowUpDown className="h-2.5 w-2.5 opacity-25" />
        )}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-color)]">
          <div className="h-5 w-40 bg-[var(--bg-elevated)] rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-[var(--bg-secondary)] rounded-lg animate-pulse" />
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
        <div>
          <h2 className="text-[15px] font-bold">{t.dashboard.realTimePrice}</h2>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{t.dashboard.top100}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[var(--text-muted)] tabular-nums font-mono">
            {lastUpdate.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchCoins}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/40">
              <SortHeader label="#" sortKeyName="market_cap_rank" />
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-[0.05em]">{t.common.coin}</th>
              <SortHeader label={t.common.price} sortKeyName="current_price" align="right" />
              <SortHeader label={t.common.change24h} sortKeyName="price_change_percentage_24h" align="right" />
              <SortHeader label={t.common.marketCap} sortKeyName="market_cap" align="right" />
              <SortHeader label={t.common.volume24h} sortKeyName="total_volume" align="right" />
              <th className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-[0.05em]">{t.common.chart7d}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((coin) => {
              const change = coin.price_change_percentage_24h || 0;
              return (
                <tr
                  key={coin.id}
                  className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-card-hover)] transition-colors group"
                >
                  <td className="px-4 py-3.5 text-xs text-[var(--text-muted)] tabular-nums font-medium">{coin.market_cap_rank}</td>
                  <td className="px-4 py-3.5">
                    <Link href={`/${lang}/coin/${coin.id}`} className="flex items-center gap-3 group/link">
                      <img src={coin.image} alt={coin.name} className="h-8 w-8 rounded-full ring-1 ring-[var(--border-color)]" />
                      <div>
                        <span className="text-sm font-semibold group-hover/link:text-[var(--accent-blue)] transition-colors">
                          {coin.name}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] uppercase ml-2">{coin.symbol}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm font-mono tabular-nums font-medium">{formatPrice(coin.current_price)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`inline-flex items-center gap-1 text-sm font-semibold tabular-nums px-2 py-0.5 rounded-md ${
                      change >= 0 ? 'text-[var(--accent-green)] bg-[var(--accent-green-bg)]' : 'text-[var(--accent-red)] bg-[var(--accent-red-bg)]'
                    }`}>
                      {formatPercent(change)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm text-[var(--text-secondary)] tabular-nums">{formatMarketCap(coin.market_cap)}</td>
                  <td className="px-4 py-3.5 text-right text-sm text-[var(--text-secondary)] tabular-nums">{formatMarketCap(coin.total_volume)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <MiniChart
                      data={coin.sparkline_in_7d?.price || []}
                      isPositive={(coin.price_change_percentage_7d_in_currency || 0) >= 0}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MiniChart({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  if (data.length === 0) return <div className="h-8 w-20" />;

  const sampled = data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 28)) === 0);
  const min = Math.min(...sampled);
  const max = Math.max(...sampled);
  const range = max - min || 1;
  const width = 80;
  const height = 32;

  const points = sampled
    .map((v, i) => {
      const x = (i / (sampled.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  const color = isPositive ? 'var(--accent-green)' : 'var(--accent-red)';
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="inline-block">
      <defs>
        <linearGradient id={`mc-${isPositive ? 'g' : 'r'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#mc-${isPositive ? 'g' : 'r'})`} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
