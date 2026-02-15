// 공통 타입 정의
export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  sparkline_in_7d?: { price: number[] };
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  imageUrl?: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  categories?: string[];
}

export interface SocialPost {
  id: string;
  platform: 'twitter' | 'reddit' | 'youtube';
  author: string;
  authorHandle: string;
  authorImage?: string;
  content: string;
  url: string;
  publishedAt: string;
  likes: number;
  reposts: number;
  comments: number;
  verified: boolean;
  relatedCoins?: string[];
}

export interface KimchiPremium {
  coinId: string;
  symbol: string;
  name: string;
  upbitPrice: number;
  binancePrice: number;
  binancePriceKRW: number;
  premiumPercent: number;
  exchangeRate: number;
}

export interface FearGreedData {
  value: number;
  valueClassification: string;
  timestamp: string;
  timeUntilUpdate?: string;
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  score: number;
  marketCapRank: number;
  priceChangePercentage24h: number;
}

export interface InfluencerProfile {
  name: string;
  handle: string;
  platform: string;
  image?: string;
  followers: string;
  description: string;
  verified: boolean;
}
