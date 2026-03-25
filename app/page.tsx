import { FeaturedMarket } from "@/components/featured-market";
import { HomeSidebar } from "@/components/home-sidebar";
import { MarketList } from "@/components/market-list";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
            <HomeSidebar />
        <FeaturedMarket />
    
      </div>
      <MarketList />
    </div>
  );
}
