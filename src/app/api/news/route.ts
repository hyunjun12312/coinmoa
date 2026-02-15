import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Try CryptoCompare first
    const articles = await fetchCryptoCompareNews();
    if (articles.length > 0) {
      return NextResponse.json(articles);
    }

    // Fallback: CoinGecko trending + status updates
    const fallback = await fetchCoinGeckoNews();
    if (fallback.length > 0) {
      return NextResponse.json(fallback);
    }

    // Last fallback: return empty with 200
    return NextResponse.json([]);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json([]);
  }
}

async function fetchCryptoCompareNews() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(
      'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest',
      {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 120 },
      }
    );
    clearTimeout(timeout);

    if (!res.ok) return [];

    const data = await res.json();

    return (data.Data || []).slice(0, 50).map((item: {
      id: string;
      title: string;
      body: string;
      url: string;
      source: string;
      imageurl: string;
      published_on: number;
      categories: string;
    }) => ({
      id: String(item.id),
      title: item.title,
      description: item.body?.substring(0, 200) + '...',
      url: item.url,
      source: item.source,
      imageUrl: item.imageurl,
      publishedAt: new Date(item.published_on * 1000).toISOString(),
      categories: item.categories?.split('|') || [],
      sentiment: analyzeSentiment(item.title + ' ' + item.body),
    }));
  } catch {
    return [];
  }
}

async function fetchCoinGeckoNews() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    // Use CoinGecko status updates as news fallback
    const res = await fetch(
      'https://api.coingecko.com/api/v3/status_updates?per_page=50',
      {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 300 },
      }
    );
    clearTimeout(timeout);

    if (!res.ok) return [];

    const data = await res.json();
    return (data.status_updates || []).map((item: {
      created_at: string;
      description: string;
      project: { name: string; id: string };
      user: string;
      user_title: string;
    }, idx: number) => ({
      id: `cg-${idx}`,
      title: item.description?.substring(0, 150),
      description: item.description,
      url: `https://www.coingecko.com/en/coins/${item.project?.id || ''}`,
      source: item.project?.name || 'CoinGecko',
      imageUrl: '',
      publishedAt: item.created_at,
      categories: [],
      sentiment: 'neutral' as const,
    }));
  } catch {
    return [];
  }
}

function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lower = text.toLowerCase();
  const positiveWords = ['bull', 'surge', 'rally', 'gain', 'rise', 'soar', 'high', 'record', 'adoption', 'approve', 'launch', 'partnership', 'upgrade', 'growth', 'buy'];
  const negativeWords = ['bear', 'crash', 'drop', 'fall', 'plunge', 'hack', 'scam', 'fraud', 'ban', 'reject', 'warning', 'risk', 'sell', 'dump', 'fear', 'lawsuit'];
  
  let score = 0;
  positiveWords.forEach(w => { if (lower.includes(w)) score++; });
  negativeWords.forEach(w => { if (lower.includes(w)) score--; });
  
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}
