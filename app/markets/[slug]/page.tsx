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
  const [selectedSide, setSelectedSide] = useState<"yes" | "no">("yes")
  const [timeRange, setTimeRange] = useState("ALL")

  if (!market) {
    notFound()
  }

  const timeRanges = ["1H", "6H", "1D", "1W", "1M", "ALL"]

  // Use NBA champion market for the detailed view
  const displayMarket = slug === "2026-nba-champion" ? nbaChampionMarket : market
  const yesPercent = displayMarket.yesPercentage
  const noPercent = 100 - yesPercent
  const totalPool = displayMarket.totalVolume.replace(/Vol\.?/gi, "Pool")
  const rawValues = displayMarket.chartData?.map((point) => point.value) ?? []
  const rawMin = rawValues.length ? Math.min(...rawValues) : 0
  const rawMax = rawValues.length ? Math.max(...rawValues) : 100
  const normalizePercent = (value: number) => {
    if (value > 100) {
      if (rawMax === rawMin) return 60
      return Math.round(30 + ((value - rawMin) / (rawMax - rawMin)) * 55)
    }
    return Math.max(5, Math.min(95, Math.round(value)))
  }
  const chartSeries =
    displayMarket.chartData?.map((point) => ({ time: point.time, value: normalizePercent(point.value) })) ??
    [
      { time: "Jul", value: 48 },
      { time: "Aug", value: 52 },
      { time: "Sep", value: 56 },
      { time: "Oct", value: 54 },
      { time: "Nov", value: 61 },
      { time: "Dec", value: 58 },
      { time: "Jan", value: 63 },
      { time: "Feb", value: 67 },
    ]
  const yesCandles = chartSeries.map((point, idx) => {
    const prev = chartSeries[Math.max(0, idx - 1)].value
    const open = idx === 0 ? prev : chartSeries[idx - 1].value
    const close = point.value
    const high = Math.min(95, Math.max(open, close) + 3)
    const low = Math.max(5, Math.min(open, close) - 3)
    return { time: point.time, open, close, high, low }
  })

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

          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card/60 p-3">
              <p className="mb-1 text-xs text-muted-foreground">YES %</p>
              <p className="text-xl font-semibold text-emerald-500">{yesPercent}%</p>
            </div>
            <div className="rounded-lg border border-border bg-card/60 p-3">
              <p className="mb-1 text-xs text-muted-foreground">NO %</p>
              <p className="text-xl font-semibold text-red-500">{noPercent}%</p>
            </div>
            <div className="rounded-lg border border-border bg-card/60 p-3">
              <p className="mb-1 text-xs text-muted-foreground">Participation Trend</p>
              <p className="text-xl font-semibold">{totalPool}</p>
            </div>
          </div>

          <div className="mb-4 rounded-lg border border-border bg-secondary/20 p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              YES vs NO Distribution
            </p>
            <div className="mb-2 flex h-2 overflow-hidden rounded-full">
              <div className="bg-emerald-500" style={{ width: `${yesPercent}%` }} />
              <div className="bg-red-500" style={{ width: `${noPercent}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-emerald-500">YES {yesPercent}%</span>
              <span className="font-medium text-red-500">NO {noPercent}%</span>
            </div>
          </div>

          {/* Chart area */}
          <div className="rounded-xl bg-card border border-border p-4 mb-4">
            <div className="h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 800 250" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="100" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeOpacity="0.1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                <path
                  d={yesCandles
                    .map((candle, idx) => {
                      const step = 760 / Math.max(yesCandles.length, 1)
                      const x = 20 + step / 2 + idx * step
                      const y = 240 - candle.close * 2.2
                      return `${idx === 0 ? "M" : "L"} ${x} ${y}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#60A5FA"
                  strokeOpacity="0.45"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />

                <text x="780" y="20" className="text-xs fill-muted-foreground" textAnchor="end">100%</text>
                <text x="780" y="75" className="text-xs fill-muted-foreground" textAnchor="end">75%</text>
                <text x="780" y="130" className="text-xs fill-muted-foreground" textAnchor="end">50%</text>
                <text x="780" y="185" className="text-xs fill-muted-foreground" textAnchor="end">25%</text>
                <text x="780" y="245" className="text-xs fill-muted-foreground" textAnchor="end">0%</text>

                {yesCandles.map((candle, idx) => {
                  const step = 760 / Math.max(yesCandles.length, 1)
                  const x = 20 + step / 2 + idx * step
                  const width = Math.min(24, step * 0.35)
                  const scaleY = (value: number) => 240 - value * 2.2
                  const openY = scaleY(candle.open)
                  const closeY = scaleY(candle.close)
                  const highY = scaleY(candle.high)
                  const lowY = scaleY(candle.low)
                  const bullish = candle.close >= candle.open

                  return (
                    <g key={`${candle.time}-${idx}`}>
                      <line x1={x} y1={highY} x2={x} y2={lowY} stroke={bullish ? "#10B981" : "#EF4444"} strokeWidth="2" />
                      <rect
                        x={x - width / 2}
                        y={Math.min(openY, closeY)}
                        width={width}
                        height={Math.max(3, Math.abs(closeY - openY))}
                        fill={bullish ? "#10B981" : "#EF4444"}
                        rx="2"
                      />
                      <text x={x} y="245" className="text-xs fill-muted-foreground" textAnchor="middle">
                        {candle.time}
                      </text>
                    </g>
                  )
                })}
              </svg>
              <div className="pointer-events-none absolute left-3 top-2 rounded bg-background/70 px-2 py-1 text-xs text-muted-foreground">
                Prediction Trend (YES %)
              </div>
            </div>

            {/* Chart controls */}
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Prediction Trend</span>
                <span>|</span>
                <span>{totalPool}</span>
                <span>|</span>
                <span>Ends {displayMarket.endDate}</span>
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
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedOutcome(outcome.name)
                            setSelectedSide("yes")
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4"
                        >
                          YES
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedOutcome(outcome.name)
                            setSelectedSide("no")
                          }}
                          variant="outline"
                          className="text-red-500 border-red-500/30 hover:bg-red-500/10 px-4"
                        >
                          NO
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
            initialChoice={selectedSide}
          />
          <MarketSidebar />
        </div>
      </div>
    </div>
  )
}
