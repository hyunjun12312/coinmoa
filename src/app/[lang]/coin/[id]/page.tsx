'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatPrice, formatMarketCap, formatPercent } from '@/lib/api';
import { useDictionary } from '@/i18n/DictionaryProvider';
import AdBanner from '@/components/AdBanner';

interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { large: string; small: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    high_24h: { usd: number };
    low_24h: { usd: number };
    circulating_supply: number;
    total_supply: number | null;
    ath: { usd: number };
    atl: { usd: number };
    market_cap_rank: number;
  };
  description: { en: string };
}

interface ChartData {
  prices: [number, number][];
}

export default function CoinDetailPage() {
  const params = useParams();
  const coinId = params.id as string;
  const { dictionary: t, lang } = useDictionary();

  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartDays, setChartDays] = useState(7);

  const fetchCoin = useCallback(async () => {
    try {
      const [coinRes, chartRes] = await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`),
        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${chartDays}`),
      ]);
      if (coinRes.ok) setCoin(await coinRes.json());
      if (chartRes.ok) setChart(await chartRes.json());
    } catch (e) {
      console.error('Failed to fetch coin detail', e);
    } finally {
      setLoading(false);
    }
  }, [coinId, chartDays]);

  useEffect(() => {
    fetchCoin();
  }, [fetchCoin]);

  const dayOptions = [
    { label: t.coin.day, value: 1 },
    { label: t.coin.week, value: 7 },
    { label: t.coin.month, value: 30 },
    { label: t.coin.threeMonths, value: 90 },
    { label: t.coin.year, value: 365 },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="card animate-pulse h-32" />
        <div className="card animate-pulse h-52" />
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="card text-center py-10">
        <p className="text-[13px] text-[var(--text-secondary)]">{t.common.noData}</p>
        <Link href={`/${lang}`} className="text-[var(--accent-blue)] text-[13px] mt-2 inline-block">
          ← {t.nav.dashboard}
        </Link>
      </div>
    );
  }

  const md = coin.market_data;
  const isPositive = md.price_change_percentage_24h >= 0;

  return (
    <div className="space-y-4">
      {/* Back + Header */}
      <div>
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-1 text-[13px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t.nav.dashboard}
        </Link>

        <div className="flex items-center gap-3">
          <img src={coin.image.large} alt={coin.name} className="h-10 w-10 rounded-full" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{coin.name}</h1>
              <span className="text-xs text-[var(--text-tertiary)] uppercase">{coin.symbol}</span>
              <span className="text-[10px] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded text-[var(--text-tertiary)]">
                #{md.market_cap_rank}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-semibold font-mono tabular-nums">{formatPrice(md.current_price.usd)}</span>
              <span className={`text-[13px] font-medium tabular-nums ${isPositive ? 'price-up' : 'price-down'}`}>
                {formatPercent(md.price_change_percentage_24h)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AdBanner slot="coin-top" className="min-h-[90px]" />

      {/* Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">{t.coin.priceChart}</h2>
          <div className="flex gap-1">
            {dayOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setChartDays(opt.value)}
                className={`pill ${chartDays === opt.value ? 'pill-active' : 'pill-inactive'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {chart && chart.prices.length > 0 ? (
          <SimpleChart prices={chart.prices} />
        ) : (
          <div className="h-44 flex items-center justify-center text-[var(--text-tertiary)] text-[13px]">
            {t.common.noData}
          </div>
        )}
      </div>

      {/* Market Data */}
      <div className="card">
        <h2 className="text-sm font-semibold mb-3">{t.coin.marketData}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <DataItem label={t.common.marketCap} value={formatMarketCap(md.market_cap.usd)} />
          <DataItem label={t.common.volume24h} value={formatMarketCap(md.total_volume.usd)} />
          <DataItem label={t.coin.high24h} value={formatPrice(md.high_24h.usd)} />
          <DataItem label={t.coin.low24h} value={formatPrice(md.low_24h.usd)} />
          <DataItem label={t.coin.circulatingSupply} value={md.circulating_supply?.toLocaleString() || '-'} />
          <DataItem label={t.coin.totalSupply} value={md.total_supply?.toLocaleString() || '∞'} />
          <DataItem label={t.coin.allTimeHigh} value={formatPrice(md.ath.usd)} />
          <DataItem label={t.coin.allTimeLow} value={formatPrice(md.atl.usd)} />
        </div>
      </div>

      {/* Description */}
      {coin.description.en && (
        <div className="card">
          <h2 className="text-sm font-semibold mb-3">{t.coin.overview}</h2>
          <div
            className="text-[13px] text-[var(--text-secondary)] leading-relaxed prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: coin.description.en.slice(0, 1000) }}
          />
        </div>
      )}

      <AdBanner slot="coin-bottom" className="min-h-[90px]" />
    </div>
  );
}

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[var(--bg-secondary)] px-3 py-2.5">
      <span className="text-[10px] text-[var(--text-tertiary)] block">{label}</span>
      <div className="text-[13px] font-semibold mt-0.5 tabular-nums">{value}</div>
    </div>
  );
}

function SimpleChart({ prices }: { prices: [number, number][] }) {
  const sampled = prices.filter((_, i) => i % Math.max(1, Math.floor(prices.length / 100)) === 0);
  const values = sampled.map(p => p[1]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const width = 800;
  const height = 180;

  const points = sampled
    .map((p, i) => {
      const x = (i / (sampled.length - 1)) * width;
      const y = height - ((p[1] - min) / range) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  const isPositive = values[values.length - 1] >= values[0];
  const color = isPositive ? 'var(--accent-green)' : 'var(--accent-red)';
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#chartGrad)" />
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}
