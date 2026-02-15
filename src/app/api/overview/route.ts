import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [fearGreedRes, trendingRes, globalRes] = await Promise.allSettled([
      fetch('https://api.alternative.me/fng/?limit=30'),
      fetch('https://api.coingecko.com/api/v3/search/trending'),
      fetch('https://api.coingecko.com/api/v3/global'),
    ]);

    let fearGreed = null;
    if (fearGreedRes.status === 'fulfilled' && fearGreedRes.value.ok) {
      const fgData = await fearGreedRes.value.json();
      fearGreed = {
        current: fgData.data?.[0],
        history: fgData.data?.slice(0, 30),
      };
    }

    let trending = null;
    if (trendingRes.status === 'fulfilled' && trendingRes.value.ok) {
      const tData = await trendingRes.value.json();
      trending = tData.coins?.slice(0, 10).map((c: {
        item: {
          id: string;
          name: string;
          symbol: string;
          thumb: string;
          score: number;
          market_cap_rank: number;
          data?: { price_change_percentage_24h?: { usd?: number } };
        }
      }) => ({
        id: c.item.id,
        name: c.item.name,
        symbol: c.item.symbol,
        thumb: c.item.thumb,
        score: c.item.score,
        marketCapRank: c.item.market_cap_rank,
        priceChangePercentage24h: c.item.data?.price_change_percentage_24h?.usd || 0,
      }));
    }

    let global = null;
    if (globalRes.status === 'fulfilled' && globalRes.value.ok) {
      const gData = await globalRes.value.json();
      global = {
        totalMarketCap: gData.data?.total_market_cap?.usd,
        totalVolume: gData.data?.total_volume?.usd,
        btcDominance: gData.data?.market_cap_percentage?.btc,
        ethDominance: gData.data?.market_cap_percentage?.eth,
        marketCapChangePercentage24h: gData.data?.market_cap_change_percentage_24h_usd,
        activeCryptos: gData.data?.active_cryptocurrencies,
      };
    }

    return NextResponse.json({ fearGreed, trending, global });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch market overview' }, { status: 500 });
  }
}
