"use client"

import { ChevronRight, Flame } from "lucide-react"
import Link from "next/link"
import { useQuestions } from "@/hooks/use-questions"
import { useTopics } from "@/hooks/use-topics"
import { mapQuestionsToBreakingNews, mapQuestionsToRelatedMarkets, mapTopicsToHotTopics } from "@/lib/sence-mappers"

export function HomeSidebar() {
  const questionsQuery = useQuestions({ page: 1, limit: 8 })
  const topicsQuery = useTopics()
  const breakingNews = mapQuestionsToBreakingNews(questionsQuery.data?.data ?? [])
  const hotTopics = mapTopicsToHotTopics(topicsQuery.data ?? [])

  return (
    <aside className="w-full shrink-0 space-y-6 lg:w-80">
      {/* Breaking News */}
      <section className="rounded-xl bg-card border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Breaking news</h3>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          {breakingNews.map((item, idx) => (
            <Link
              key={item.id}
              href={`/markets/${item.slug}`}
              className="flex items-start gap-3 group"
            >
              <span className="text-sm text-muted-foreground">{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-tight line-clamp-2 group-hover:text-foreground transition-colors">
                  {item.title}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-semibold">{item.percentage}%</span>
                <p className={`text-xs ${item.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {item.change >= 0 ? "↗" : "↘"} {Math.abs(item.change)}%
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hot Topics */}
      <section className="rounded-xl bg-card border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Hot topics</h3>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          {hotTopics.map((topic, idx) => (
            <Link
              key={topic.id}
              href="/"
              className="flex items-center gap-3 group"
            >
              <span className="text-sm text-muted-foreground">{idx + 1}</span>
              <span className="flex-1 text-sm font-medium group-hover:text-foreground transition-colors">
                {topic.name}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{topic.volume}</span>
                <Flame className="h-3 w-3 text-orange-500" />
                <ChevronRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  )
}

interface MarketSidebarProps {
  excludedQuestionId?: string
}

export function MarketSidebar({ excludedQuestionId }: MarketSidebarProps) {
  const relatedQuery = useQuestions({ page: 1, limit: 6 })
  const relatedMarkets = mapQuestionsToRelatedMarkets(relatedQuery.data?.data ?? [], excludedQuestionId)

  return (
    <aside className="w-full shrink-0 space-y-4">
      {/* Related Markets */}
      <section>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm bg-secondary text-foreground">
            All
          </button>
          <button className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
            Sports
          </button>
          <button className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
            NBA
          </button>
          <button className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
            Hide From New
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {relatedMarkets.map((market, idx) => (
            <Link
              key={market.id}
              href={`/markets/${market.slug}`}
              className="flex items-start gap-3 group"
            >
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-lg shrink-0">
                🏆
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-tight line-clamp-2 group-hover:text-foreground transition-colors">
                  {market.title}
                </p>
              </div>
              <span className="font-semibold text-sm shrink-0">{market.percentage}%</span>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  )
}
