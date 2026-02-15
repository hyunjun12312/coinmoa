import { MetadataRoute } from 'next';
import { i18n } from '@/i18n/config';
import { SITE_URL } from '@/lib/constants';

// 주요 코인 ID 목록 (sitemap에 포함)
const MAJOR_COINS = [
  'bitcoin', 'ethereum', 'tether', 'binancecoin', 'ripple',
  'solana', 'cardano', 'dogecoin', 'polkadot', 'avalanche-2',
  'chainlink', 'polygon', 'shiba-inu', 'litecoin', 'uniswap',
  'cosmos', 'stellar', 'near', 'algorand', 'aptos',
  'arbitrum', 'optimism', 'sui', 'sei-network', 'celestia',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // 각 언어별 페이지
  const pages = ['', '/news', '/social', '/kimchi', '/tools', '/search'];

  for (const locale of i18n.locales) {
    for (const page of pages) {
      const languages: Record<string, string> = {};
      for (const l of i18n.locales) {
        languages[l] = `${SITE_URL}/${l}${page}`;
      }
      // x-default는 영어로
      languages['x-default'] = `${SITE_URL}/en${page}`;

      entries.push({
        url: `${SITE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'hourly' : page === '/news' ? 'always' : 'hourly',
        priority: page === '' ? 1.0 : page === '/news' ? 0.9 : 0.8,
        alternates: {
          languages,
        },
      });
    }

    // 코인 상세 페이지
    for (const coinId of MAJOR_COINS) {
      const languages: Record<string, string> = {};
      for (const l of i18n.locales) {
        languages[l] = `${SITE_URL}/${l}/coin/${coinId}`;
      }
      languages['x-default'] = `${SITE_URL}/en/coin/${coinId}`;

      entries.push({
        url: `${SITE_URL}/${locale}/coin/${coinId}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.7,
        alternates: {
          languages,
        },
      });
    }
  }

  return entries;
}
