"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useQuestions } from "@/hooks/use-questions"
import { useQuestionDetail } from "@/hooks/use-question-detail"
import { getReadableApiError } from "@/lib/api/error-utils"

export function FeaturedMarket() {
  const [predictionSide, setPredictionSide] = useState<"yes" | "no">("yes")
  const questionsQuery = useQuestions({ page: 1, limit: 1 })
  const featuredSlug = questionsQuery.data?.data[0]?.slug || ""
  const detail = useQuestionDetail(featuredSlug, { commentsLimit: 5 })

  if (questionsQuery.isLoading || detail.questionQuery.isLoading) {
    return <section className="w-full rounded-xl border border-border bg-card p-8 text-sm text-muted-foreground">Loading featured market...</section>
  }

  if (questionsQuery.isError || detail.questionQuery.isError || !detail.market) {
    return (
      <section className="w-full rounded-xl border border-border bg-card p-8 text-sm text-red-500">
        {getReadableApiError(questionsQuery.error ?? detail.questionQuery.error)}
      </section>
    )
  }

  const featuredMarket = detail.market
  const comments = detail.commentsFeed

  const yesPercent = featuredMarket.yesPercentage
  const noPercent = 100 - yesPercent
  const totalPool = featuredMarket.totalVolume
  const trendPoints = [52, 55, 53, 58, 61, 65, 63, 69, 71, 74, 72, yesPercent]
  const chartWidth = 420
  const chartHeight = 180
  const minPoint = Math.min(...trendPoints) - 4
  const maxPoint = Math.max(...trendPoints) + 4
  const step = chartWidth / (trendPoints.length - 1)
  const chartCoords = trendPoints.map((value, idx) => {
    const x = idx * step
    const y = chartHeight - ((value - minPoint) / (maxPoint - minPoint)) * chartHeight
    return { x, y, value }
  })
  const trendPath = chartCoords
    .map((point, idx) => `${idx === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ")
  const trendAreaPath = `${trendPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`
  const latestPoint = chartCoords[chartCoords.length - 1]
  const momentum = trendPoints[trendPoints.length - 1] - trendPoints[0]

  return (
    <section className="w-full rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          {/* Market info */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500 text-white text-2xl font-bold">
              ₿
            </div>
            <div>
              <h2 className="text-lg font-semibold sm:text-xl">{featuredMarket.title}</h2>
              <p className="text-sm text-muted-foreground">{featuredMarket.endDate}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-3 sm:gap-8 sm:text-right">
            <div>
              <p className="text-xs text-muted-foreground">YES %</p>
              <p className="text-xl font-semibold text-emerald-500 sm:text-2xl">{yesPercent}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">NO %</p>
              <p className="text-xl font-semibold text-red-500 sm:text-2xl">{noPercent}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Participation Trend</p>
              <p className="text-xl font-semibold text-orange-500 sm:text-2xl">{totalPool}</p>
            </div>
          </div>
        </div>

        {/* Prediction controls and chart area */}
        <div className="flex flex-col gap-6 xl:flex-row">
          {/* Left side - yes/no and comments */}
          <div className="w-full shrink-0 xl:w-80">
            {/* YES/NO buttons */}
            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => setPredictionSide("yes")}
                className={`flex-1 h-12 text-base font-medium ${
                  predictionSide === "yes"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                YES
              </Button>
              <Button
                onClick={() => setPredictionSide("no")}
                className={`flex-1 h-12 text-base font-medium ${
                  predictionSide === "no"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                NO
              </Button>
            </div>

            <div className="mb-4 rounded-lg border border-border bg-secondary/20 p-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                YES vs NO Distribution
              </p>
              <div className="mb-3 rounded-md bg-background/50 p-2">
                <div className="mb-2 flex h-2 overflow-hidden rounded-full">
                  <div className="bg-emerald-500" style={{ width: `${yesPercent}%` }} />
                  <div className="bg-red-500" style={{ width: `${noPercent}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1.5 text-center">
                    <p className="text-[10px] text-emerald-300">YES</p>
                    <p className="text-sm font-semibold text-emerald-400">{yesPercent}%</p>
                  </div>
                  <div className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1.5 text-center">
                    <p className="text-[10px] text-red-300">NO</p>
                    <p className="text-sm font-semibold text-red-400">{noPercent}%</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-emerald-500">YES {yesPercent}%</span>
                <span className="text-red-500">NO {noPercent}%</span>
              </div>
            </div>

            {/* Comments */}
            <div className="max-h-64 space-y-3 overflow-y-auto pr-1 sm:pr-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium shrink-0">
                    {comment.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{comment.username}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-muted-foreground">{totalPool}</p>
          </div>

          {/* Right side - prediction trend chart */}
          <div className="flex-1 relative">
            <div className="relative flex h-56 items-center justify-center rounded-lg border border-border/60 bg-linear-to-b from-secondary/40 to-secondary/10 sm:h-64">
              <div className="w-full px-3 sm:px-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Prediction Trend</p>
                    <p className="text-xl font-semibold text-emerald-500">YES {yesPercent}%</p>
                  </div>
                  <div className="rounded-md border border-border/60 bg-background/40 px-2 py-1 text-right">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Momentum</p>
                    <p className={`text-sm font-semibold ${momentum >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                      {momentum >= 0 ? "+" : ""}{momentum}%
                    </p>
                  </div>
                </div>

                <div className="relative h-36 rounded-lg border border-border/60 bg-background/40 p-2">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full">
                    <defs>
                      <linearGradient id="featuredTrendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {[0, 1, 2, 3, 4].map((row) => (
                      <line
                        key={row}
                        x1="0"
                        y1={(chartHeight / 4) * row}
                        x2={chartWidth}
                        y2={(chartHeight / 4) * row}
                        stroke="currentColor"
                        strokeOpacity="0.08"
                      />
                    ))}

                    <path d={trendAreaPath} fill="url(#featuredTrendFill)" />
                    <path d={trendPath} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />

                    {chartCoords.map((point, idx) => (
                      <circle
                        key={idx}
                        cx={point.x}
                        cy={point.y}
                        r={idx === chartCoords.length - 1 ? 4.5 : 2.5}
                        fill={idx === chartCoords.length - 1 ? "#34D399" : "#10B981"}
                      />
                    ))}
                  </svg>

                  <div className="pointer-events-none absolute right-2 top-2 rounded bg-background/70 px-2 py-1 text-[11px] text-muted-foreground">
                    {latestPoint.value}%
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>12h ago</span>
                  <span>6h ago</span>
                  <span>Now</span>
                </div>
              </div>

              {/* Live indicator */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs sm:bottom-4 sm:right-4">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-500 font-medium">LIVE</span>
                <span className="text-muted-foreground">• ⊞ Sence?</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel indicators */}
      <div className="flex items-center justify-center gap-1.5 py-3 border-t border-border">
        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
        <div className="h-1.5 w-6 rounded-full bg-foreground" />
        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
      </div>

      {/* Quick nav */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-border px-3 py-3 sm:gap-4">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Sports
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Oil Prices
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        <Link href="/markets" className="sm:ml-auto">
          <Button variant="outline" size="sm">
            Explore all
          </Button>
        </Link>
      </div>
    </section>
  )
}
