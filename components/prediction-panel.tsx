"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Market } from "@/lib/mock-data"

interface PredictionPanelProps {
  market: Market
  selectedOutcome?: string
}

export function PredictionPanel({ market, selectedOutcome }: PredictionPanelProps) {
  const [side, setSide] = useState<"buy" | "sell">("buy")
  const [choice, setChoice] = useState<"yes" | "no">("yes")
  const [amount, setAmount] = useState("")

  const yesPrice = market.yesPercentage
  const noPrice = 100 - market.yesPercentage

  const amountNum = parseFloat(amount) || 0
  const potentialReturn = choice === "yes"
    ? amountNum / (yesPrice / 100)
    : amountNum / (noPrice / 100)

  const quickAmounts = [1, 5, 10, 100]

  return (
    <div className="rounded-xl bg-card border border-border p-4 sticky top-20">
      {/* Header with outcome name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-lg">
          {market.icon}
        </div>
        <span className="font-medium">{selectedOutcome || market.title}</span>
      </div>

      {/* Buy/Sell tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <button
            onClick={() => setSide("buy")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              side === "buy"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setSide("sell")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              side === "sell"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Sell
          </button>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
          Market
          <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </div>

      {/* Yes/No buttons */}
      <div className="flex gap-2 mb-4">
        <Button
          onClick={() => setChoice("yes")}
          className={`flex-1 h-12 text-base font-medium ${
            choice === "yes"
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
          }`}
        >
          Yes {yesPrice}¢
        </Button>
        <Button
          onClick={() => setChoice("no")}
          className={`flex-1 h-12 text-base font-medium ${
            choice === "no"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
          }`}
        >
          No {noPrice}¢
        </Button>
      </div>

      {/* Amount input */}
      <div className="mb-4">
        <label className="text-sm text-muted-foreground mb-2 block">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl font-medium text-muted-foreground">$</span>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="h-14 pl-8 text-2xl font-medium bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0"
          />
        </div>
      </div>

      {/* Quick amount buttons */}
      <div className="flex gap-2 mb-4">
        {quickAmounts.map((amt) => (
          <Button
            key={amt}
            variant="outline"
            size="sm"
            onClick={() => setAmount((prev) => (parseFloat(prev) || 0) + amt + "")}
            className="flex-1 text-xs"
          >
            +${amt}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAmount("1000")}
          className="flex-1 text-xs"
        >
          Max
        </Button>
      </div>

      {/* Trade button */}
      <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-medium mb-3">
        Trade
      </Button>

      <p className="text-xs text-muted-foreground text-center mb-4">
        By trading, you agree to the <span className="underline cursor-pointer">Terms of Use</span>.
      </p>

      {/* Potential return */}
      {amountNum > 0 && (
        <div className="rounded-lg bg-secondary p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Potential return</span>
            <span className="font-medium text-emerald-500">
              ${potentialReturn.toFixed(2)} ({((potentialReturn / amountNum - 1) * 100).toFixed(0)}%)
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
