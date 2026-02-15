'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowUpDown, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
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
    const interval = setInterval(fetchData, 30000); // 30초마다 갱신
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
      <div className="card">
        <div className="animate-pulse space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-[var(--bg-secondary)] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-3">
          <div>
          <h2 className="text-lg font-bold">🇰🇷 {t.kimchi.monitor}</h2>
            <p className="text-xs text-[var(--text-secondary)]">{t.kimchi.subtitle}</p>
          </div>
          <button onClick={fetchData} className="flex items-center gap-1 rounded-lg bg-[var(--bg-secondary)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
            <RefreshCw className="h-3 w-3" />
            {t.common.refresh}
          </button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-[var(--bg-secondary)] p-3 text-center">
            <span className="text-[10px] text-[var(--text-secondary)]">{t.kimchi.avgPremium}</span>
            <div className={`text-lg font-bold ${parseFloat(avgPremium) >= 0 ? 'price-up' : 'price-down'}`}>
              {avgPremium}%
            </div>
          </div>
          <div className="rounded-lg bg-[var(--bg-secondary)] p-3 text-center">
            <span className="text-[10px] text-[var(--text-secondary)]">{t.kimchi.exchangeRate}</span>
            <div className="text-lg font-bold">{exchangeRate.toLocaleString()}</div>
          </div>
          <div className="rounded-lg bg-[var(--bg-secondary)] p-3 text-center">
            <span className="text-[10px] text-[var(--text-secondary)]">{t.kimchi.monitoring}</span>
            <div className="text-lg font-bold">{data.length}개</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--bg-secondary)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)]">{t.common.coin}</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-secondary)]">{t.kimchi.upbitKRW}</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-secondary)]">{t.kimchi.binanceKRW}</th>
              <th
                onClick={() => setSortAsc(!sortAsc)}
                className="px-4 py-3 text-right text-xs font-medium text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] transition"
              >
                <div className="flex items-center justify-end gap-1">
                  {t.kimchi.premium}
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr
                key={item.symbol}
                className="border-b border-[var(--border-color)]/50 hover:bg-[var(--bg-card-hover)] transition"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{item.symbol}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm font-mono">
                  {item.upbitPrice.toLocaleString('ko-KR')}원
                </td>
                <td className="px-4 py-3 text-right text-sm font-mono text-[var(--text-secondary)]">
                  {item.binancePriceKRW.toLocaleString('ko-KR')}원
                  <span className="block text-[10px]">(${item.binancePrice.toLocaleString('en-US', { maximumFractionDigits: 4 })})</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold ${
                    item.premiumPercent >= 0 ? 'bg-[var(--accent-green)]/10 price-up' : 'bg-[var(--accent-red)]/10 price-down'
                  }`}>
                    {item.premiumPercent >= 0 ?
                      <TrendingUp className="h-3 w-3" /> :
                      <TrendingDown className="h-3 w-3" />
                    }
                    {item.premiumPercent >= 0 ? '+' : ''}{item.premiumPercent}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {updatedAt && (
        <div className="px-5 py-3 text-[10px] text-[var(--text-secondary)] text-right border-t border-[var(--border-color)]">
          마지막 업데이트: {new Date(updatedAt).toLocaleString('ko-KR')}
        </div>
      )}
    </div>
  );
}
