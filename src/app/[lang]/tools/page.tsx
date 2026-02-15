import type { Metadata } from 'next';
import { getDictionary } from '@/i18n/getDictionary';
import { i18n, type Locale } from '@/i18n/config';
import { SITE_URL, SITE_NAME, OG_LOCALE_MAP } from '@/lib/constants';
import ToolsPageClient from './ToolsPageClient';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as Locale;
  const dictionary = await getDictionary(locale);
  const canonicalUrl = `${SITE_URL}/${locale}/tools`;

  return {
    title: dictionary.pageSeo.tools.title,
    description: dictionary.pageSeo.tools.description,
    openGraph: {
      title: dictionary.pageSeo.tools.title,
      description: dictionary.pageSeo.tools.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.pageSeo.tools.title,
      description: dictionary.pageSeo.tools.description,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries([
        ...i18n.locales.map((l) => [l, `${SITE_URL}/${l}/tools`]),
        ['x-default', `${SITE_URL}/en/tools`],
      ]),
    },
  };
}

export default function ToolsPagePage() {
  return <ToolsPageClient />;
}
