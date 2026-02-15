import type { Metadata } from 'next';
import { getDictionary } from '@/i18n/getDictionary';
import { i18n, type Locale } from '@/i18n/config';
import { SITE_URL, SITE_NAME, OG_LOCALE_MAP } from '@/lib/constants';
import MarketOverview from '@/components/MarketOverview';
import CoinTable from '@/components/CoinTable';
import NewsFeed from '@/components/NewsFeed';
import SocialFeed from '@/components/SocialFeed';
import AdBanner from '@/components/AdBanner';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as Locale;
  const dictionary = await getDictionary(locale);
  const canonicalUrl = `${SITE_URL}/${locale}`;

  return {
    title: dictionary.pageSeo.dashboard.title,
    description: dictionary.pageSeo.dashboard.description,
    openGraph: {
      title: dictionary.pageSeo.dashboard.title,
      description: dictionary.pageSeo.dashboard.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.pageSeo.dashboard.title,
      description: dictionary.pageSeo.dashboard.description,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries([
        ...i18n.locales.map((l) => [l, `${SITE_URL}/${l}`]),
        ['x-default', `${SITE_URL}/en`],
      ]),
    },
  };
}

export default function Home() {
  return (
    <div className="space-y-8">
      <MarketOverview />

      <AdBanner slot="home-top" className="min-h-[90px]" />

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_400px]">
        <div className="min-w-0">
          <CoinTable />
        </div>

        <div className="space-y-6">
          <NewsFeed limit={8} />
          <AdBanner slot="home-sidebar" className="min-h-[250px]" />
          <SocialFeed limit={6} />
        </div>
      </div>

      <AdBanner slot="home-bottom" className="min-h-[90px]" />
    </div>
  );
}