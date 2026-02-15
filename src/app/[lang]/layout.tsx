import { getDictionary } from '@/i18n/getDictionary';
import { DictionaryProvider } from '@/i18n/DictionaryProvider';
import { i18n, type Locale } from '@/i18n/config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL, SITE_NAME, OG_LOCALE_MAP } from '@/lib/constants';

// RTL 언어 지원
const rtlLocales = ['ar'];

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as Locale;
  const dictionary = await getDictionary(locale);

  const canonicalUrl = `${SITE_URL}/${locale}`;

  return {
    title: {
      default: dictionary.meta.title,
      template: `%s | ${SITE_NAME}`,
    },
    description: dictionary.meta.description,
    keywords: dictionary.meta.keywords,
    openGraph: {
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      type: 'website',
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale] || 'en_US',
      alternateLocale: i18n.locales
        .filter(l => l !== locale)
        .map(l => OG_LOCALE_MAP[l as Locale]),
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.meta.title,
      description: dictionary.meta.description,
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

// JSON-LD 구조화 데이터
function JsonLd({ locale, dictionary }: { locale: Locale; dictionary: { meta: { title: string; description: string } } }) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: ['CryptoPulse', '크립토펄스'],
    url: `${SITE_URL}/${locale}`,
    description: dictionary.meta.description,
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: i18n.locales.map(l => l.toUpperCase()),
    },
  };

  const financeSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: SITE_NAME,
    description: dictionary.meta.description,
    url: `${SITE_URL}/${locale}`,
    serviceType: 'Cryptocurrency Market Data',
    areaServed: 'Worldwide',
    availableLanguage: i18n.locales.map(l => l.toUpperCase()),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financeSchema) }}
      />
    </>
  );
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as Locale;
  const dictionary = await getDictionary(locale);
  const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr';

  return (
    <div dir={dir} lang={locale}>
      <JsonLd locale={locale} dictionary={dictionary} />
      <DictionaryProvider dictionary={dictionary} lang={locale}>
        <Header />
        <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </main>
        <Footer />
      </DictionaryProvider>
    </div>
  );
}
