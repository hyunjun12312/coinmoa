import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 30;

export async function GET() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=7d',
      { next: { revalidate: 30 } }
    );
    
    if (!res.ok) {
      // Rate limit 대응: 캐시된 데이터가 없으면 에러
      return NextResponse.json({ error: 'CoinGecko rate limited' }, { status: 429 });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coins' }, { status: 500 });
  }
}
