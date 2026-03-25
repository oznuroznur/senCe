"use client"

import Link from "next/link"
import { Clock, Layers } from "lucide-react"
import type { Market } from "@/lib/mock-data"

interface MarketCardProps {
  market: Market
}

export function MarketCard({ market }: MarketCardProps) {
  const yesPercent = market.yesPercentage ?? 50
  const noPercent = 100 - yesPercent

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
      <h3 className="font-semibold text-lg leading-snug mb-6 text-foreground line-clamp-2 min-h-[3.5rem]">
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
