"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MarketCard } from "@/components/market-card"
import { useQuestions } from "@/hooks/use-questions"
import { useTopics } from "@/hooks/use-topics"
import { mapQuestionToMarket } from "@/lib/sence-mappers"
import { getReadableApiError } from "@/lib/api/error-utils"

export function MarketList() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [page, setPage] = useState(1)
  const limit = 12

  const topicsQuery = useTopics()
  const selectedTopic = topicsQuery.data?.find((topic) => topic.name === activeCategory)
  const questionsQuery = useQuestions({ page, limit, topicId: selectedTopic?.id })

  const categories = ["All", ...(topicsQuery.data?.map((topic) => topic.name) ?? [])]
  const marketItems = (questionsQuery.data?.data ?? []).map((question) => mapQuestionToMarket(question))
  const total = questionsQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  const filteredMarkets = marketItems

  function handleCategoryChange(category: string) {
    setActiveCategory(category)
    setPage(1)
  }

  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">All markets</h2>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Category filters */}
      <nav className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-[#0066FF] text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {category}
          </button>
        ))}
      </nav>

      {/* Markets grid */}
      {questionsQuery.isLoading ? (
        <div className="py-8 text-sm text-muted-foreground">Loading markets...</div>
      ) : questionsQuery.isError ? (
        <div className="py-8 text-sm text-red-500">{getReadableApiError(questionsQuery.error)}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button variant="outline" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page <= 1}>
              Previous
            </Button>
            <p className="text-sm text-muted-foreground">
              Page {page} / {totalPages}
            </p>
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </section>
  )
}
