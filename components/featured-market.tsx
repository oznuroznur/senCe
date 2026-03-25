"use client"

import { useState } from "react"
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { featuredMarket, comments } from "@/lib/mock-data"

export function FeaturedMarket() {
  const [betSide, setBetSide] = useState<"up" | "down">("up")

  return (
    <section className="w-[80%] rounded-xl bg-card border border-border overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          {/* Market info */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500 text-white text-2xl font-bold">
              ₿
            </div>
            <div>
              <h2 className="text-xl font-semibold">{featuredMarket.title}</h2>
              <p className="text-sm text-muted-foreground">{featuredMarket.endDate}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-start gap-8 text-right">
            <div>
              <p className="text-xs text-muted-foreground">Price To Beat</p>
              <p className="text-2xl font-semibold">$71,890</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Current Price <span className="text-red-500">▼ $43</span>
              </p>
              <p className="text-2xl font-semibold text-emerald-500">$71.848</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ends in</p>
              <p className="text-2xl font-semibold text-orange-500">4:07</p>
            </div>
          </div>
        </div>

        {/* Bet buttons and chart area */}
        <div className="flex gap-6">
          {/* Left side - bet buttons and comments */}
          <div className="w-80 shrink-0">
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
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
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
            <div className="h-64 rounded-lg bg-secondary/30 flex items-center justify-center relative">
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
                <div className="absolute right-0 top-1/4 flex items-center gap-2">
                  <div className="h-px w-full border-t border-dashed border-muted-foreground/30" />
                  <span className="bg-muted-foreground/20 text-xs px-2 py-1 rounded">Target ↗</span>
                </div>
                {/* Price annotations */}
                <div className="absolute right-2 top-4 text-xs text-muted-foreground">$71,880</div>
                <div className="absolute right-2 top-1/2 text-xs text-muted-foreground">$71,860</div>
                <div className="absolute right-2 bottom-4 text-xs text-muted-foreground">$71,840</div>
              </div>
              {/* Live indicator */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs">
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
      <div className="flex items-center justify-center gap-4 py-3 border-t border-border">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Sports
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Oil Prices
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        <Link href="/markets" className="ml-auto">
          <Button variant="outline" size="sm">
            Explore all
          </Button>
        </Link>
      </div>
    </section>
  )
}
