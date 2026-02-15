import { getDictionary } from '@/i18n/getDictionary';
import { DictionaryProvider } from '@/i18n/DictionaryProvider';
import { i18n, type Locale } from '@/i18n/config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// RTL 언어 지원
const rtlLocales = ['ar'];

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as Locale;
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    keywords: dictionary.meta.keywords,
    openGraph: {
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      type: 'website',
    },
    alternates: {
      languages: Object.fromEntries(
        i18n.locales.map((l) => [l, `/${l}`])
      ),
    },
  };
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
      <DictionaryProvider dictionary={dictionary} lang={locale}>
        <Header />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 py-5">
          {children}
        </main>
        <Footer />
      </DictionaryProvider>
    </div>
  );
}
