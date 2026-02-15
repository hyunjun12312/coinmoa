import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Real-Time Crypto News · Prices · SNS Feed`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Check real-time cryptocurrency prices, news, influencer SNS feeds, and Kimchi Premium all in one place. All the information you need for crypto investing in real-time.",
  keywords: [
    "bitcoin", "ethereum", "cryptocurrency", "crypto prices", "kimchi premium",
    "crypto news", "real-time prices", "bitcoin price", "altcoin",
    "비트코인", "이더리움", "암호화폐", "코인 시세", "김치프리미엄",
    "暗号資産", "仮想通貨", "加密货币", "criptomonedas", "cryptomonnaies",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Real-Time Crypto News · Prices · SNS Feed`,
    description:
      "Check real-time cryptocurrency prices, news, influencer SNS feeds, and Kimchi Premium all in one place.",
    url: SITE_URL,
    locale: "en_US",
    alternateLocale: ["ko_KR", "ja_JP", "zh_CN", "es_ES", "fr_FR", "de_DE", "pt_BR", "ru_RU", "ar_SA", "vi_VN", "th_TH", "tr_TR", "hi_IN", "id_ID"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Real-Time Crypto Prices & News`,
    description:
      "Track real-time crypto prices, news, SNS feeds, and Kimchi Premium in one place.",
    creator: "@cryptopulse",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
