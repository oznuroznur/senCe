"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Market } from "@/lib/ui-models"

interface PredictionPanelProps {
  market: Market
  selectedOutcome?: string
  initialChoice?: "yes" | "no"
  isSubmitting?: boolean
  submitError?: string | null
  onPlacePrediction?: (payload: { optionId: string; xpWagered: number }) => Promise<void> | void
}

export function PredictionPanel({
  market,
  selectedOutcome,
  initialChoice = "yes",
  isSubmitting = false,
  submitError,
  onPlacePrediction,
}: PredictionPanelProps) {
  const [choice, setChoice] = useState<"yes" | "no">(initialChoice)
  const [points, setPoints] = useState("")
  const { isSignedIn } = useAuth()

  useEffect(() => {
    setChoice(initialChoice)
  }, [initialChoice])

  const yesPercent = market.yesPercentage
  const noPercent = 100 - market.yesPercentage
  const totalPool = market.totalVolume.replace(/Vol\.?/gi, "Pool")

  const pointsNum = parseFloat(points) || 0
  const selectedPercent = choice === "yes" ? yesPercent : noPercent
  const payoutPreview = selectedPercent > 0 ? pointsNum * (100 / selectedPercent) : 0
  const selectedMarketOutcome = market.outcomes.find((outcome) => outcome.name === selectedOutcome) ?? market.outcomes[0]
  const fallbackNoOutcome = market.outcomes.find((outcome) => outcome.id !== selectedMarketOutcome?.id)

  const quickPoints = [10, 50, 100, 250]

  async function handlePlacePrediction() {
    if (!onPlacePrediction || pointsNum <= 0) {
      return
    }

    const optionId =
      choice === "yes" ? selectedMarketOutcome?.id : fallbackNoOutcome?.id ?? selectedMarketOutcome?.id

    if (!optionId) {
      return
    }

    await onPlacePrediction({ optionId, xpWagered: pointsNum })
  }

  return (
    <div className="rounded-xl bg-card border border-border p-4 lg:sticky lg:top-20">
      {/* Header with outcome name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-lg">
          {market.icon}
        </div>
        <span className="font-medium line-clamp-1">{selectedOutcome || market.title}</span>
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

      <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-secondary/10 p-3 text-sm">
        <span className="text-muted-foreground">Participation Trend</span>
        <span className="font-medium">{totalPool}</span>
      </div>

      {/* Yes/No buttons */}
      <div className="grid grid-cols-1 gap-2 mb-4 sm:grid-cols-2">
        <Button
          onClick={() => setChoice("yes")}
          className={`flex-1 h-12 text-base font-medium ${
            choice === "yes"
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
          }`}
        >
          YES
        </Button>
        <Button
          onClick={() => setChoice("no")}
          className={`flex-1 h-12 text-base font-medium ${
            choice === "no"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
          }`}
        >
          NO
        </Button>
      </div>

      {/* Points input */}
      <div className="mb-4">
        <label className="text-sm text-muted-foreground mb-2 block">Points</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-medium text-muted-foreground">P</span>
          <Input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="0"
            className="h-14 pl-8 text-2xl font-medium bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0"
          />
        </div>
      </div>

      {/* Quick points buttons */}
      <div className="grid grid-cols-3 gap-2 mb-4 sm:grid-cols-5">
        {quickPoints.map((amt) => (
          <Button
            key={amt}
            variant="outline"
            size="sm"
            onClick={() => setPoints((prev) => (parseFloat(prev) || 0) + amt + "")}
            className="flex-1 text-xs"
          >
            +{amt}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPoints("1000")}
          className="flex-1 text-xs"
        >
          Max
        </Button>
      </div>

      {/* Place prediction */}
      {isSignedIn ? (
        <Button
          onClick={handlePlacePrediction}
          disabled={isSubmitting || pointsNum < 10}
          className="mb-3 h-12 w-full bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700"
        >
          Place Prediction
        </Button>
      ) : (
        <Button asChild className="mb-3 h-12 w-full bg-[#0066FF] text-base font-medium text-white hover:bg-[#0052CC]">
          <Link href="/sign-in">Sign In to Place Prediction</Link>
        </Button>
      )}

      <p className="text-xs text-muted-foreground text-center mb-4">
        By placing a prediction, you agree to the <span className="underline cursor-pointer">Terms of Use</span>.
      </p>

      {submitError && <p className="mb-4 text-xs text-red-500 text-center">{submitError}</p>}

      {/* Payout preview */}
      {pointsNum > 0 && (
        <div className="rounded-lg bg-secondary p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payout preview</span>
            <span className="font-medium text-emerald-500">
              {payoutPreview.toFixed(1)} pts ({((payoutPreview / pointsNum - 1) * 100).toFixed(0)}%)
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
