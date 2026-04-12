import type {
  Comment,
  LeaderboardEntry,
  ParticipationStats,
  Question,
  Topic,
} from "@/lib/api/types"
import type {
  BreakingNewsItem,
  FeedComment,
  HotTopic,
  LeaderboardUser,
  Market,
  MarketOutcome,
  RelatedMarket,
} from "@/lib/ui-models"

const topicIcons: Record<string, string> = {
  sports: "🏅",
  sport: "🏅",
  crypto: "₿",
  politics: "🏛️",
  geopolitics: "🌍",
  finance: "📈",
  technology: "🧠",
  tech: "🧠",
  weather: "⛅",
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value)
}

function formatDateLabel(value?: string | null) {
  if (!value) {
    return "Open"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Open"
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function buildTrendData(percentages: number[]) {
  return percentages.map((value, index) => ({
    time: `${index + 1}`,
    value,
  }))
}

function deriveTrendPercentages(baseValue: number, sampleCount = 8) {
  return Array.from({ length: sampleCount }, (_, index) => {
    const offset = (index - Math.floor(sampleCount / 2)) * 2
    return Math.max(5, Math.min(95, Math.round(baseValue + offset)))
  })
}

function getMarketIcon(question: Question) {
  const topicSlug = question.topic?.slug?.toLowerCase()
  if (topicSlug && topicIcons[topicSlug]) {
    return topicIcons[topicSlug]
  }

  if (question.type === "BINARY") {
    return "🎯"
  }

  if (question.type === "PREDICTION_MARKET") {
    return "📊"
  }

  return "❓"
}

function mapOutcomeVolumes(question: Question, stats?: ParticipationStats) {
  const statsOptions = Array.isArray(stats?.options) ? stats.options : []
  const statsMap = new Map(statsOptions.map((option) => [option.id, option]))

  return question.options
    .slice()
    .sort((left, right) => left.position - right.position)
    .map<MarketOutcome>((option, index) => {
      const stat = statsMap.get(option.id)
      const percentage = Math.round(stat?.percentage ?? fallbackPercentage(question.options.length, index))

      return {
        id: option.id,
        key: option.key,
        name: option.label,
        percentage,
        change: 0,
        volume: `${formatCompactNumber(stat?.xpTotal ?? 0)} XP`,
        participantCount: stat?.participantCount ?? 0,
      }
    })
}

function fallbackPercentage(optionCount: number, index: number) {
  if (optionCount <= 1) {
    return 100
  }

  if (optionCount === 2) {
    return index === 0 ? 50 : 50
  }

  return Math.round(100 / optionCount)
}

export function mapQuestionToMarket(question: Question, stats?: ParticipationStats | null): Market {
  const outcomes = mapOutcomeVolumes(question, stats ?? undefined)
  const primaryOutcome = outcomes[0]
  const yesPercentage = primaryOutcome?.percentage ?? 50
  const normalizedYes = outcomes.length === 2 ? yesPercentage : Math.min(95, Math.max(5, yesPercentage))
  const noPercentage = outcomes.length === 2 ? Math.max(0, 100 - normalizedYes) : Math.max(0, 100 - normalizedYes)
  const trendSeed = outcomes.length >= 2 ? normalizedYes : Math.round(100 / Math.max(outcomes.length, 1))

  return {
    id: question.id,
    slug: question.slug,
    title: question.title,
    description: question.description || "No description provided yet.",
    category: question.topic?.name || question.type.replaceAll("_", " "),
    icon: getMarketIcon(question),
    yesPercentage: normalizedYes,
    noPercentage,
    totalVolume: `${formatCompactNumber(stats?.totalXPPool ?? question.totalXPPool)} XP`,
    endDate: formatDateLabel(question.closesAt),
    outcomes,
    isLive: question.status === "PUBLISHED",
    chartData: buildTrendData(deriveTrendPercentages(trendSeed)),
  }
}

export function mapCommentsToFeed(comments: Comment[] = []): FeedComment[] {
  return comments.map((comment) => ({
    id: comment.id,
    username: comment.user.username,
    displayName: comment.user.displayName,
    avatarUrl: comment.user.avatarUrl,
    avatar: getInitials(comment.user.displayName || comment.user.username),
    comment: comment.body,
  }))
}

export function mapQuestionsToBreakingNews(questions: Question[] = []): BreakingNewsItem[] {
  return questions.slice(0, 3).map((question) => ({
    id: question.id,
    title: question.title,
    percentage: getBinaryPercentage(question),
    change: 0,
    slug: question.slug,
  }))
}

export function mapTopicsToHotTopics(topics: Topic[] = []): HotTopic[] {
  return topics.slice(0, 6).map((topic) => ({
    id: topic.id,
    name: topic.name,
    slug: topic.slug,
    volume: `${topic.questionCount ?? 0} questions`,
  }))
}

export function mapQuestionsToRelatedMarkets(questions: Question[] = [], excludedId?: string): RelatedMarket[] {
  return questions
    .filter((question) => question.id !== excludedId)
    .slice(0, 4)
    .map((question) => ({
      id: question.id,
      title: question.title,
      percentage: getBinaryPercentage(question),
      slug: question.slug,
    }))
}

export function mapLeaderboard(entries: LeaderboardEntry[] = []): LeaderboardUser[] {
  return entries.map((entry) => ({
    rank: entry.rank,
    username: entry.username,
    displayName: entry.displayName,
    avatarUrl: entry.avatarUrl,
    avatar: getInitials(entry.displayName || entry.username),
    points: entry.xpTotal,
    winRate: entry.totalPredictions > 0 ? (entry.correctPredictions / entry.totalPredictions) * 100 : 0,
    totalTrades: entry.totalPredictions,
  }))
}

export function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return "SN"
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
}

function getBinaryPercentage(question: Question) {
  if (question.options.length <= 1) {
    return 100
  }

  return 50
}

export function formatPoints(value: number) {
  return new Intl.NumberFormat("en").format(value)
}