"use client"

import Link from "next/link"
import { Clock, Layers } from "lucide-react"
import type { Market } from "@/lib/ui-models"

interface MarketCardProps {
  market: Market
}

export function MarketCard({ market }: MarketCardProps) {
  const yesPercent = market.yesPercentage ?? 50
  const noPercent = 100 - yesPercent
  const trendPoints = [
    Math.max(5, yesPercent - 8),
    Math.max(5, yesPercent - 5),
    Math.max(5, yesPercent - 2),
    Math.min(95, yesPercent + 1),
    Math.min(95, yesPercent + 3),
    yesPercent,
  ]
  const trendPath = trendPoints
    .map((value, idx) => {
      const x = idx * 20
      const y = 36 - (value / 100) * 30
      return `${idx === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  return (
    <Link
      href={`/markets/${market.slug}`}
      className="group block rounded-xl bg-card p-5 hover:bg-card/80 transition-colors border border-border"
    >
      {/* Category Badge */}
      <div className="mb-3">
        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded bg-cyan-500/10 text-cyan-400 uppercase tracking-wide">
          {market.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-lg leading-snug mb-6 text-foreground line-clamp-2 min-h-14">
        {market.title}
      </h3>

      {/* Yes/No Percentages */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Yes</span>
          <p className="text-3xl font-bold text-emerald-500">{yesPercent}%</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">No</span>
          <p className="text-3xl font-bold text-red-500">{noPercent}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-emerald-500 transition-all duration-300"
          style={{ width: `${yesPercent}%` }}
        />
        <div
          className="bg-red-500 transition-all duration-300"
          style={{ width: `${noPercent}%` }}
        />
      </div>

      <div className="mb-4 rounded-lg border border-border/70 bg-secondary/20 p-2.5">
        <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
          <span>Prediction Trend</span>
          <span>YES {yesPercent}%</span>
        </div>
        <svg viewBox="0 0 100 40" className="h-10 w-full">
          <path d={trendPath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5" />
          <span>{market.totalVolume} Pool</span>
        </div>
        {market.endDate && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{market.endDate}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
