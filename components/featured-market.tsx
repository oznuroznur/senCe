"use client"

import { useState } from "react"
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { featuredMarket, comments } from "@/lib/mock-data"

export function FeaturedMarket() {
  const [betSide, setBetSide] = useState<"up" | "down">("up")

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
              <p className="text-xs text-muted-foreground">Price To Beat</p>
              <p className="text-xl font-semibold sm:text-2xl">$71,890</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Current Price <span className="text-red-500">▼ $43</span>
              </p>
              <p className="text-xl font-semibold text-emerald-500 sm:text-2xl">$71.848</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ends in</p>
              <p className="text-xl font-semibold text-orange-500 sm:text-2xl">4:07</p>
            </div>
          </div>
        </div>

        {/* Bet buttons and chart area */}
        <div className="flex flex-col gap-6 xl:flex-row">
          {/* Left side - bet buttons and comments */}
          <div className="w-full shrink-0 xl:w-80">
            {/* Up/Down buttons */}
            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => setBetSide("up")}
                className={`flex-1 h-12 text-base font-medium ${
                  betSide === "up"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <span className="text-xs mr-2 opacity-70">+ $2</span>
                UP 3,17x
              </Button>
              <Button
                onClick={() => setBetSide("down")}
                className={`flex-1 h-12 text-base font-medium ${
                  betSide === "down"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                DOWN 1,43x
              </Button>
            </div>

            {/* Comments */}
            <div className="max-h-64 space-y-3 overflow-y-auto pr-1 sm:pr-2">
              {comments.map((comment, idx) => (
                <div key={idx} className="flex items-start gap-2">
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

            <p className="mt-4 text-xs text-muted-foreground">{featuredMarket.totalVolume}</p>
          </div>

          {/* Right side - chart placeholder */}
          <div className="flex-1 relative">
            <div className="relative flex h-56 items-center justify-center rounded-lg bg-secondary/30 sm:h-64">
              {/* Simple price visualization */}
              <div className="absolute inset-4">
                <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgb(234, 179, 8)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(234, 179, 8)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 150 Q 50 140, 100 130 T 150 100 T 200 80 T 250 90 T 300 70 T 350 85 T 400 75"
                    fill="none"
                    stroke="rgb(234, 179, 8)"
                    strokeWidth="2"
                  />
                  <path
                    d="M 0 150 Q 50 140, 100 130 T 150 100 T 200 80 T 250 90 T 300 70 T 350 85 T 400 75 V 200 H 0 Z"
                    fill="url(#chartGradient)"
                  />
                </svg>
                {/* Target line */}
                <div className="absolute left-2 right-2 top-1/4 flex items-center gap-2 sm:left-auto sm:right-0 sm:w-auto">
                  <div className="h-px w-full border-t border-dashed border-muted-foreground/30" />
                  <span className="bg-muted-foreground/20 text-xs px-2 py-1 rounded">Target ↗</span>
                </div>
                {/* Price annotations */}
                <div className="absolute right-2 top-4 text-xs text-muted-foreground">$71,880</div>
                <div className="absolute right-2 top-1/2 text-xs text-muted-foreground">$71,860</div>
                <div className="absolute right-2 bottom-4 text-xs text-muted-foreground">$71,840</div>
              </div>
              {/* Live indicator */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs sm:bottom-4 sm:right-4">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-500 font-medium">LIVE</span>
                <span className="text-muted-foreground">• ⊞ Polymarket</span>
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
