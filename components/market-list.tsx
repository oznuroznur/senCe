"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MarketCard } from "@/components/market-card"
import { categories, markets } from "@/lib/mock-data"

export function MarketList() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredMarkets = activeCategory === "All"
    ? markets
    : markets.filter((m) => m.category === activeCategory || m.title.toLowerCase().includes(activeCategory.toLowerCase()))

  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">All markets</h2>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Category filters */}
      <nav className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-[#0066FF] text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {category}
          </button>
        ))}
      </nav>

      {/* Markets grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
    </section>
  )
}
