"use client"

import { FormEvent, use, useMemo, useState } from "react"
import { Bookmark, Code, Eye, Gift, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PredictionPanel } from "@/components/prediction-panel"
import { MarketSidebar } from "@/components/home-sidebar"
import { useQuestionDetail } from "@/hooks/use-question-detail"
import { usePlacePrediction } from "@/hooks/use-place-prediction"
import { useComments } from "@/hooks/use-comments"
import { useToggleBookmark, useToggleFollow, useToggleQuestionReaction } from "@/hooks/use-question-actions"
import { getReadableApiError } from "@/lib/api/error-utils"
import { mapCommentsToFeed } from "@/lib/sence-mappers"

interface MarketPageProps {
  params: Promise<{ slug: string }>
}

export default function MarketPage({ params }: MarketPageProps) {
  const { slug } = use(params)
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null)
  const [selectedSide, setSelectedSide] = useState<"yes" | "no">("yes")
  const [timeRange, setTimeRange] = useState("ALL")
  const [commentBody, setCommentBody] = useState("")
  const [replyToId, setReplyToId] = useState<string | null>(null)
  const [replyBody, setReplyBody] = useState("")

  const detail = useQuestionDetail(slug)
  const market = detail.market
  const placePredictionMutation = usePlacePrediction()

  const questionId = detail.questionQuery.data?.id ?? ""
  const commentsApi = useComments(questionId)
  const toggleBookmarkMutation = useToggleBookmark()
  const toggleFollowMutation = useToggleFollow()
  const toggleReactionMutation = useToggleQuestionReaction(slug, questionId)

  const commentFeed = useMemo(
    () => mapCommentsToFeed(commentsApi.commentsQuery.data?.data ?? []),
    [commentsApi.commentsQuery.data],
  )

  const isPageLoading = detail.questionQuery.isLoading || detail.statsQuery.isLoading
  const pageError = detail.questionQuery.error || detail.statsQuery.error

  if (isPageLoading) {
    return <div className="container mx-auto px-4 py-10 text-sm text-muted-foreground">Loading market...</div>
  }

  if (pageError || !market || !questionId) {
    return (
      <div className="container mx-auto px-4 py-10 text-sm text-red-500">
        {getReadableApiError(pageError)}
      </div>
    )
  }

  const question = detail.questionQuery.data
  if (!question) {
    return <div className="container mx-auto px-4 py-10 text-sm text-red-500">The requested resource was not found.</div>
  }

  const timeRanges = ["1H", "6H", "1D", "1W", "1M", "ALL"]
  const yesPercent = market.yesPercentage
  const noPercent = 100 - yesPercent
  const totalPool = market.totalVolume
  const rawValues = market.chartData?.map((point) => point.value) ?? []
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
    market.chartData?.map((point) => ({ time: point.time, value: normalizePercent(point.value) })) ??
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

  async function handlePlacePrediction(payload: { optionId: string; xpWagered: number }) {
    await placePredictionMutation.mutateAsync({
      questionId,
      optionId: payload.optionId,
      xpWagered: payload.xpWagered,
      slug,
    })
  }

  async function handleCreateComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!commentBody.trim()) return

    await commentsApi.createCommentMutation.mutateAsync(commentBody.trim())
    setCommentBody("")
  }

  async function handleReply(commentId: string) {
    if (!replyBody.trim()) return

    await commentsApi.replyCommentMutation.mutateAsync({ commentId, body: replyBody.trim() })
    setReplyToId(null)
    setReplyBody("")
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-2xl">
                {market.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span>{market.category}</span>
                  <span>•</span>
                  <span>{question.type}</span>
                </div>
                <h1 className="text-xl font-bold sm:text-2xl">{market.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={() => toggleReactionMutation.mutate("LIKE")}
                disabled={toggleReactionMutation.isPending}
              >
                <Code className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={() => toggleFollowMutation.mutate({ questionId, slug })}
                disabled={toggleFollowMutation.isPending}
              >
                <Eye className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={() => toggleBookmarkMutation.mutate({ questionId, slug })}
                disabled={toggleBookmarkMutation.isPending}
              >
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

            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Prediction Trend</span>
                <span>|</span>
                <span>{totalPool}</span>
                <span>|</span>
                <span>Ends {market.endDate}</span>
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

          {market.outcomes && (
            <div className="space-y-2">
              {market.outcomes.map((outcome) => (
                <div
                  key={outcome.id}
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
                          onClick={(event) => {
                            event.stopPropagation()
                            setSelectedOutcome(outcome.name)
                            setSelectedSide("yes")
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4"
                        >
                          YES
                        </Button>
                        <Button
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation()
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

          <section className="mt-6 rounded-xl bg-card border border-border p-4">
            <h2 className="mb-3 text-lg font-semibold">Comments</h2>
            <form onSubmit={handleCreateComment} className="mb-4 flex gap-2">
              <input
                value={commentBody}
                onChange={(event) => setCommentBody(event.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Add a comment"
              />
              <Button type="submit" disabled={commentsApi.createCommentMutation.isPending}>
                Post
              </Button>
            </form>

            <div className="space-y-3">
              {commentFeed.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-border p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-medium">{comment.displayName}</p>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setReplyToId(comment.id)
                          setReplyBody("")
                        }}
                      >
                        Reply
                      </button>
                      <button
                        className="text-xs text-red-500"
                        onClick={() => commentsApi.deleteCommentMutation.mutate(comment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.comment}</p>

                  {replyToId === comment.id && (
                    <div className="mt-2 flex gap-2">
                      <input
                        value={replyBody}
                        onChange={(event) => setReplyBody(event.target.value)}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                        placeholder="Reply to comment"
                      />
                      <Button onClick={() => handleReply(comment.id)} size="sm">
                        Send
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="w-full shrink-0 space-y-4 xl:w-80">
          <PredictionPanel
            market={market}
            selectedOutcome={selectedOutcome || market.outcomes?.[0]?.name}
            initialChoice={selectedSide}
            onPlacePrediction={handlePlacePrediction}
            isSubmitting={placePredictionMutation.isPending}
            submitError={placePredictionMutation.isError ? getReadableApiError(placePredictionMutation.error) : null}
          />
          <MarketSidebar excludedQuestionId={questionId} />
        </div>
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        {detail.myParticipationQuery.data
          ? `Your prediction: ${detail.myParticipationQuery.data.xpWagered} XP`
          : "No prediction placed yet."}
      </div>
    </div>
  )
}
