import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(
      'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest',
      { next: { revalidate: 120 } }
    );
    
    if (!res.ok) throw new Error('CryptoCompare API error');
    
    const data = await res.json();
    
    const articles = (data.Data || []).slice(0, 50).map((item: {
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
    
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
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
