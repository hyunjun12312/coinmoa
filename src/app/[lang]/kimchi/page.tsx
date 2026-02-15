import type { Metadata } from 'next';
import { getDictionary } from '@/i18n/getDictionary';
import { i18n, type Locale } from '@/i18n/config';
import { SITE_URL, SITE_NAME, OG_LOCALE_MAP } from '@/lib/constants';
import KimchiPageClient from './KimchiPageClient';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as Locale;
  const dictionary = await getDictionary(locale);
  const canonicalUrl = `${SITE_URL}/${locale}/kimchi`;

  return {
    title: dictionary.pageSeo.kimchi.title,
    description: dictionary.pageSeo.kimchi.description,
    openGraph: {
      title: dictionary.pageSeo.kimchi.title,
      description: dictionary.pageSeo.kimchi.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.pageSeo.kimchi.title,
      description: dictionary.pageSeo.kimchi.description,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries([
        ...i18n.locales.map((l) => [l, `${SITE_URL}/${l}/kimchi`]),
        ['x-default', `${SITE_URL}/en/kimchi`],
      ]),
    },
  };
}

export default function KimchiPagePage() {
  return <KimchiPageClient />;
}
