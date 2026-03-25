"use client"

import { useState, use } from "react"
import { notFound } from "next/navigation"
import { Code, Eye, Bookmark, Gift, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PredictionPanel } from "@/components/prediction-panel"
import { MarketSidebar } from "@/components/home-sidebar"
import { getMarketBySlug, nbaChampionMarket } from "@/lib/mock-data"

interface MarketPageProps {
  params: Promise<{ slug: string }>
}

export default function MarketPage({ params }: MarketPageProps) {
  const { slug } = use(params)
  const market = getMarketBySlug(slug)
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("ALL")

  if (!market) {
    notFound()
  }

  const timeRanges = ["1H", "6H", "1D", "1W", "1M", "ALL"]

  // Use NBA champion market for the detailed view
  const displayMarket = slug === "2026-nba-champion" ? nbaChampionMarket : market

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6 xl:flex-row">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-2xl">
                {displayMarket.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span>{displayMarket.category}</span>
                  {displayMarket.category === "Sports" && (
                    <>
                      <span>•</span>
                      <span>NBA</span>
                    </>
                  )}
                </div>
                <h1 className="text-xl font-bold sm:text-2xl">{displayMarket.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Code className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Eye className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Bookmark className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Legend */}
          {displayMarket.outcomes && (
            <div className="flex items-center gap-4 mb-4 text-sm flex-wrap">
              {displayMarket.outcomes.slice(0, 4).map((outcome, idx) => {
                const colors = ["#3B82F6", "#06B6D4", "#EAB308", "#F97316"]
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: colors[idx] }}
                    />
                    <span className="text-muted-foreground">{outcome.name}</span>
                    <span className="font-medium">{outcome.percentage}%</span>
                  </div>
                )
              })}
              <div className="flex items-center gap-2 text-muted-foreground sm:ml-auto">
                <span>⊞</span>
                <span>Polymarket</span>
              </div>
            </div>
          )}

          {/* Chart area */}
          <div className="rounded-xl bg-card border border-border p-4 mb-4">
            <div className="h-64 relative">
              {/* Chart placeholder */}
              <svg className="w-full h-full" viewBox="0 0 800 250" preserveAspectRatio="none">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="100" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeOpacity="0.1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Y-axis labels */}
                <text x="780" y="20" className="text-xs fill-muted-foreground" textAnchor="end">50%</text>
                <text x="780" y="70" className="text-xs fill-muted-foreground" textAnchor="end">40%</text>
                <text x="780" y="120" className="text-xs fill-muted-foreground" textAnchor="end">30%</text>
                <text x="780" y="170" className="text-xs fill-muted-foreground" textAnchor="end">20%</text>
                <text x="780" y="220" className="text-xs fill-muted-foreground" textAnchor="end">10%</text>
                <text x="780" y="245" className="text-xs fill-muted-foreground" textAnchor="end">0%</text>

                {/* Lines */}
                {/* OKC Thunder - Blue */}
                <path
                  d="M 0 180 Q 100 175, 200 170 T 300 165 T 400 100 T 500 50 T 600 55 T 700 45 T 780 50"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
                {/* Spurs - Cyan */}
                <path
                  d="M 0 195 Q 100 190, 200 185 T 300 180 T 400 175 T 500 170 T 600 178 T 700 185 T 780 195"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="2"
                />
                {/* Celtics - Yellow */}
                <path
                  d="M 0 185 Q 100 182, 200 180 T 300 178 T 400 175 T 500 180 T 600 185 T 700 195 T 780 200"
                  fill="none"
                  stroke="#EAB308"
                  strokeWidth="2"
                />
                {/* Nuggets - Orange */}
                <path
                  d="M 0 195 Q 100 192, 200 190 T 300 188 T 400 185 T 500 190 T 600 195 T 700 205 T 780 210"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="2"
                />

                {/* X-axis labels */}
                <text x="50" y="245" className="text-xs fill-muted-foreground">Jul</text>
                <text x="150" y="245" className="text-xs fill-muted-foreground">Aug</text>
                <text x="250" y="245" className="text-xs fill-muted-foreground">Sep</text>
                <text x="350" y="245" className="text-xs fill-muted-foreground">Oct</text>
                <text x="450" y="245" className="text-xs fill-muted-foreground">Nov</text>
                <text x="550" y="245" className="text-xs fill-muted-foreground">Dec</text>
                <text x="650" y="245" className="text-xs fill-muted-foreground">Jan</text>
                <text x="730" y="245" className="text-xs fill-muted-foreground">Feb</text>
              </svg>
            </div>

            {/* Chart controls */}
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">⊠ {displayMarket.totalVolume}</span>
                <span>|</span>
                <span>⊙ {displayMarket.endDate}</span>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
                {timeRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      timeRange === range
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {range}
                  </button>
                ))}
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Outcomes list */}
          {displayMarket.outcomes && (
            <div className="space-y-2">
              {displayMarket.outcomes.map((outcome, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedOutcome(outcome.name)}
                  className={`rounded-xl bg-card border p-4 cursor-pointer transition-colors ${
                    selectedOutcome === outcome.name
                      ? "border-[#0066FF]"
                      : "border-border hover:border-muted-foreground/50"
                  }`}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className="font-medium">{outcome.name}</div>
                      <div className="text-sm text-muted-foreground">{outcome.volume}</div>
                      <Gift className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold sm:text-2xl">{outcome.percentage}%</span>
                        <span
                          className={`text-sm ${
                            outcome.change >= 0 ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {outcome.change >= 0 ? "▲" : "▼"} {Math.abs(outcome.change)}%
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4"
                        >
                          Buy Yes {outcome.percentage}¢
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-500/30 hover:bg-red-500/10 px-4"
                        >
                          Buy No {100 - outcome.percentage}.0¢
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar - Prediction Panel */}
        <div className="w-full shrink-0 space-y-4 xl:w-80">
          <PredictionPanel
            market={displayMarket}
            selectedOutcome={selectedOutcome || displayMarket.outcomes?.[0]?.name}
          />
          <MarketSidebar />
        </div>
      </div>
    </div>
  )
}
