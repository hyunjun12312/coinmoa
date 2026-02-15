// API 유틸리티 함수 모음
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const UPBIT_BASE = 'https://api.upbit.com/v1';
const FEAR_GREED_API = 'https://api.alternative.me/fng/';

export async function fetchTopCoins(page = 1, perPage = 100, currency = 'usd') {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=7d`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Failed to fetch coins');
  return res.json();
}

export async function fetchCoinDetail(id: string) {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=true`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Failed to fetch coin detail');
  return res.json();
}

export async function fetchCoinChart(id: string, days = 7, currency = 'usd') {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error('Failed to fetch chart');
  return res.json();
}

export async function fetchTrendingCoins() {
  const res = await fetch(`${COINGECKO_BASE}/search/trending`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Failed to fetch trending');
  return res.json();
}

export async function fetchGlobalData() {
  const res = await fetch(`${COINGECKO_BASE}/global`, {
    next: { revalidate: 120 },
  });
  if (!res.ok) throw new Error('Failed to fetch global data');
  return res.json();
}

export async function fetchFearGreedIndex() {
  const res = await fetch(`${FEAR_GREED_API}?limit=30`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Failed to fetch fear/greed');
  return res.json();
}

export async function fetchUpbitTickers() {
  // 먼저 마켓 목록 가져오기
  const marketsRes = await fetch(`${UPBIT_BASE}/market/all?is_details=false`, {
    next: { revalidate: 3600 },
  });
  if (!marketsRes.ok) throw new Error('Failed to fetch Upbit markets');
  const markets = await marketsRes.json();
  
  // KRW 마켓만 필터
  const krwMarkets = markets
    .filter((m: { market: string }) => m.market.startsWith('KRW-'))
    .map((m: { market: string }) => m.market)
    .slice(0, 50)
    .join(',');
  
  const tickerRes = await fetch(`${UPBIT_BASE}/ticker?markets=${krwMarkets}`, {
    next: { revalidate: 30 },
  });
  if (!tickerRes.ok) throw new Error('Failed to fetch Upbit tickers');
  return tickerRes.json();
}

export async function fetchExchangeRate() {
  // CoinGecko에서 USD/KRW 환율 간접 추출 (BTC 기준)
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/simple/price?ids=bitcoin&vs_currencies=usd,krw`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return 1350; // 기본값
    const data = await res.json();
    return data.bitcoin.krw / data.bitcoin.usd;
  } catch {
    return 1350;
  }
}

export async function fetchCryptoNews() {
  // CryptoCompare News API (무료)
  const res = await fetch(
    'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest',
    { next: { revalidate: 120 } }
  );
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
}

export async function searchCoins(query: string) {
  const res = await fetch(`${COINGECKO_BASE}/search?query=${encodeURIComponent(query)}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to search coins');
  return res.json();
}

// 숫자 포맷 유틸
export function formatPrice(price: number, currency: 'USD' | 'KRW' = 'USD'): string {
  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(price);
  }
  if (price >= 1) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(price);
}

export function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

export function formatVolume(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toLocaleString();
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}초 전`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}일 전`;
  return date.toLocaleDateString('ko-KR');
}
