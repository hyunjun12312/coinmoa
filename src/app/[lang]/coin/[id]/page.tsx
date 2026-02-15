import type { Metadata } from 'next';
import { getDictionary } from '@/i18n/getDictionary';
import { i18n, type Locale } from '@/i18n/config';
import { SITE_URL, SITE_NAME, OG_LOCALE_MAP } from '@/lib/constants';
import CoinDetailClient from './CoinDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const locale = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as Locale;
  const dictionary = await getDictionary(locale);
  const canonicalUrl = `${SITE_URL}/${locale}/coin/${id}`;

  // 서버에서 코인 기본 정보 가져오기 (SEO용)
  let coinName = id.charAt(0).toUpperCase() + id.slice(1);
  let coinSymbol = id.toUpperCase();
  let coinDescription = '';

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`,
      { next: { revalidate: 300 } }
    );
    if (res.ok) {
      const coin = await res.json();
      coinName = coin.name;
      coinSymbol = coin.symbol?.toUpperCase() || coinSymbol;
      coinDescription = coin.description?.en?.slice(0, 160)?.replace(/<[^>]*>/g, '') || '';
    }
  } catch {}

  const title = dictionary.pageSeo.coinDetail.title
    .replace('{name}', coinName);
  const description = coinDescription || dictionary.pageSeo.coinDetail.description
    .replace(/{name}/g, coinName)
    .replace('{symbol}', coinSymbol);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries([
        ...i18n.locales.map((l) => [l, `${SITE_URL}/${l}/coin/${id}`]),
        ['x-default', `${SITE_URL}/en/coin/${id}`],
      ]),
    },
  };
}

export default function CoinDetailPage() {
  return <CoinDetailClient />;
}
