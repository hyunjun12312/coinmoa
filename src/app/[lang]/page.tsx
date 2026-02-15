import MarketOverview from '@/components/MarketOverview';
import CoinTable from '@/components/CoinTable';
import NewsFeed from '@/components/NewsFeed';
import SocialFeed from '@/components/SocialFeed';
import AdBanner from '@/components/AdBanner';

export default function Home() {
  return (
    <div className="space-y-6">
      <MarketOverview />

      <AdBanner slot="home-top" className="min-h-[90px]" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
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
