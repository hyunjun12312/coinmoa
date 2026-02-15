'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { useDictionary } from '@/i18n/DictionaryProvider';

interface KimchiItem {
  coinId: string;
  symbol: string;
  name: string;
  upbitPrice: number;
  binancePrice: number;
  binancePriceKRW: number;
  premiumPercent: number;
  exchangeRate: number;
  changeRate24h?: number;
  volume24h?: number;
}

export default function KimchiPremiumTable() {
  const [data, setData] = useState<KimchiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(1350);
  const [updatedAt, setUpdatedAt] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const { dictionary: t } = useDictionary();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/kimchi');
      if (res.ok) {
        const json = await res.json();
        setData(json.data || []);
        setExchangeRate(json.exchangeRate || 1350);
        setUpdatedAt(json.updatedAt || '');
      }
    } catch (e) {
      console.error('Failed to fetch kimchi data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const sorted = [...data].sort((a, b) =>
    sortAsc ? a.premiumPercent - b.premiumPercent : b.premiumPercent - a.premiumPercent
  );

  const avgPremium = data.length > 0
    ? (data.reduce((sum, d) => sum + d.premiumPercent, 0) / data.length).toFixed(2)
    : '0';

  if (loading) {
    return (
      <div className="card !p-0 overflow-hidden">
        <div className="p-4 space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-10 bg-[var(--bg-secondary)] rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden !p-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold">{t.kimchi.monitor}</h2>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{t.kimchi.subtitle}</p>
          </div>
          <button onClick={fetchData} className="flex items-center rounded-md px-2 py-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-[var(--bg-secondary)] px-4 py-3 text-center">
            <span className="text-[11px] text-[var(--text-tertiary)] block">{t.kimchi.avgPremium}</span>
            <span className={`text-sm font-semibold tabular-nums ${parseFloat(avgPremium) >= 0 ? 'price-up' : 'price-down'}`}>
              {avgPremium}%
            </span>
          </div>
          <div className="rounded-lg bg-[var(--bg-secondary)] px-4 py-3 text-center">
            <span className="text-[11px] text-[var(--text-tertiary)] block">{t.kimchi.exchangeRate}</span>
            <span className="text-sm font-semibold tabular-nums">{exchangeRate.toLocaleString()}</span>
          </div>
          <div className="rounded-lg bg-[var(--bg-secondary)] px-4 py-3 text-center">
            <span className="text-[11px] text-[var(--text-tertiary)] block">{t.kimchi.monitoring}</span>
            <span className="text-sm font-semibold tabular-nums">{data.length}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-color)]">
              <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{t.common.coin}</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{t.kimchi.upbitKRW}</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{t.kimchi.binanceKRW}</th>
              <th
                onClick={() => setSortAsc(!sortAsc)}
                className="px-5 py-3 text-right text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider cursor-pointer hover:text-[var(--text-secondary)] transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  {t.kimchi.premium}
                  <ArrowUpDown className="h-2.5 w-2.5" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr key={item.symbol} className="border-b border-[var(--border-color)]/40 hover:bg-[var(--bg-card-hover)] transition-colors">
                <td className="px-5 py-3.5">
                  <span className="text-sm font-medium">{item.symbol}</span>
                </td>
                <td className="px-5 py-3.5 text-right text-sm font-mono tabular-nums">
                  {item.upbitPrice.toLocaleString('ko-KR')}원
                </td>
                <td className="px-5 py-3.5 text-right text-sm font-mono tabular-nums text-[var(--text-secondary)]">
                  {item.binancePriceKRW.toLocaleString('ko-KR')}원
                  <span className="block text-[11px] text-[var(--text-tertiary)]">(${item.binancePrice.toLocaleString('en-US', { maximumFractionDigits: 4 })})</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className={`text-sm font-medium tabular-nums ${
                    item.premiumPercent >= 0 ? 'price-up' : 'price-down'
                  }`}>
                    {item.premiumPercent >= 0 ? '+' : ''}{item.premiumPercent}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {updatedAt && (
        <div className="px-4 py-2 text-[10px] text-[var(--text-tertiary)] text-right border-t border-[var(--border-color)]">
          {new Date(updatedAt).toLocaleString('ko-KR')}
        </div>
      )}
    </div>
  );
}
