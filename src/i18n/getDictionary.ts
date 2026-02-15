import type { Locale } from './config';

// 번역 사전 타입
export interface Dictionary {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  nav: {
    dashboard: string;
    news: string;
    social: string;
    kimchi: string;
    tools: string;
    search: string;
  };
  common: {
    live: string;
    refresh: string;
    loading: string;
    noData: string;
    all: string;
    coin: string;
    price: string;
    change24h: string;
    marketCap: string;
    volume24h: string;
    chart7d: string;
    rank: string;
    secondsAgo: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
    adSlot: string;
    adArea: string;
    disclaimer: string;
  };
  dashboard: {
    title: string;
    realTimePrice: string;
    top100: string;
    fearGreedIndex: string;
    totalMarketCap: string;
    btcDominance: string;
    volume24h: string;
    activeCoins: string;
    trendingCoins: string;
    extremeFear: string;
    fear: string;
    neutral: string;
    greed: string;
    extremeGreed: string;
  };
  news: {
    title: string;
    subtitle: string;
    realTimeNews: string;
    sentiment: {
      positive: string;
      negative: string;
      neutral: string;
    };
    categories: {
      all: string;
      btc: string;
      eth: string;
      defi: string;
      regulation: string;
      exchange: string;
    };
  };
  social: {
    title: string;
    subtitle: string;
    feedTitle: string;
    monitoring: string;
    allPlatforms: string;
    allCoins: string;
  };
  kimchi: {
    title: string;
    subtitle: string;
    monitor: string;
    avgPremium: string;
    exchangeRate: string;
    monitoring: string;
    upbitKRW: string;
    binanceKRW: string;
    premium: string;
    whatIs: string;
    whatIsDesc: string;
    positive: string;
    positiveDesc: string;
    zero: string;
    zeroDesc: string;
    negative: string;
    negativeDesc: string;
  };
  tools: {
    title: string;
    subtitle: string;
    profitCalc: {
      title: string;
      buyPrice: string;
      sellPrice: string;
      quantity: string;
      fee: string;
      calculate: string;
      investment: string;
      revenue: string;
      profit: string;
      profitRate: string;
    };
    positionCalc: {
      title: string;
      totalCapital: string;
      riskPercent: string;
      entryPrice: string;
      stopLoss: string;
      calculate: string;
      riskAmount: string;
      positionSize: string;
      quantity: string;
    };
    converter: {
      title: string;
      amount: string;
      from: string;
      to: string;
      result: string;
    };
  };
  coin: {
    detailTitle: string;
    overview: string;
    priceChart: string;
    marketData: string;
    high24h: string;
    low24h: string;
    circulatingSupply: string;
    totalSupply: string;
    allTimeHigh: string;
    allTimeLow: string;
    day: string;
    week: string;
    month: string;
    threeMonths: string;
    year: string;
  };
  footer: {
    description: string;
    price: string;
    info: string;
    notice: string;
    disclaimerFull: string;
    copyright: string;
    dataBy: string;
  };
  pageSeo: {
    dashboard: { title: string; description: string };
    news: { title: string; description: string };
    social: { title: string; description: string };
    kimchi: { title: string; description: string };
    tools: { title: string; description: string };
    search: { title: string; description: string };
    coinDetail: { title: string; description: string };
  };
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('./dictionaries/en.json').then(m => m.default),
  ko: () => import('./dictionaries/ko.json').then(m => m.default),
  ja: () => import('./dictionaries/ja.json').then(m => m.default),
  zh: () => import('./dictionaries/zh.json').then(m => m.default),
  es: () => import('./dictionaries/es.json').then(m => m.default),
  fr: () => import('./dictionaries/fr.json').then(m => m.default),
  de: () => import('./dictionaries/de.json').then(m => m.default),
  pt: () => import('./dictionaries/pt.json').then(m => m.default),
  ru: () => import('./dictionaries/ru.json').then(m => m.default),
  ar: () => import('./dictionaries/ar.json').then(m => m.default),
  vi: () => import('./dictionaries/vi.json').then(m => m.default),
  th: () => import('./dictionaries/th.json').then(m => m.default),
  tr: () => import('./dictionaries/tr.json').then(m => m.default),
  hi: () => import('./dictionaries/hi.json').then(m => m.default),
  id: () => import('./dictionaries/id.json').then(m => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  try {
    return await dictionaries[locale]();
  } catch {
    return await dictionaries.en();
  }
}
