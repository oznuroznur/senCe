export interface ChartDataPoint {
  time: string
  value: number
}

export interface MarketOutcome {
  id: string
  name: string
  key: string
  percentage: number
  change: number
  volume: string
  participantCount: number
}

export interface Market {
  id: string
  slug: string
  title: string
  description: string
  category: string
  icon: string
  yesPercentage: number
  noPercentage: number
  totalVolume: string
  endDate: string
  outcomes: MarketOutcome[]
  isLive: boolean
  chartData: ChartDataPoint[]
}

export interface FeedComment {
  id: string
  username: string
  displayName: string
  avatar: string
  avatarUrl?: string
  comment: string
}

export interface BreakingNewsItem {
  id: string
  title: string
  percentage: number
  change: number
  slug: string
}

export interface HotTopic {
  id: string
  name: string
  volume: string
  slug: string
}

export interface RelatedMarket {
  id: string
  title: string
  percentage: number
  slug: string
}

export interface LeaderboardUser {
  rank: number
  username: string
  displayName: string
  avatar: string
  avatarUrl?: string
  points: number
  winRate: number
  totalTrades: number
}