export interface Market {
  id: string
  slug: string
  title: string
  description: string
  category: string
  icon: string
  yesPercentage: number
  noPercentage: number
  yesChange: number
  totalVolume: string
  endDate: string
  outcomes?: MarketOutcome[]
  isLive?: boolean
  chartData?: ChartDataPoint[]
}

export interface MarketOutcome {
  name: string
  percentage: number
  change: number
  volume: string
  icon?: string
}

export interface ChartDataPoint {
  time: string
  value: number
}

export interface BreakingNewsItem {
  id: number
  title: string
  percentage: number
  change: number
}

export interface HotTopic {
  id: number
  name: string
  volume: string
}

export interface LeaderboardUser {
  rank: number
  username: string
  avatar: string
  points: number
  winRate: number
  totalTrades: number
}

export const categories = [
  "All",
  "Trump",
  "NCAA Basketball",
  "Iran",
  "Oil",
  "Denmark Election",
  "Iran Ceasefire",
  "Strait of Hormuz",
  "Cuba",
  "Gov Shutdown",
  "Fed",
  "Daily Temperature",
  "Tweet Markets",
]

export const navCategories = [
  "Trending",
  "Breaking",
  "New",
  "Politics",
  "Sports",
  "Crypto",
  "Iran",
  "Finance",
  "Geopolitics",
  "Tech",
  "Culture",
  "Economy",
  "Weather",
  "Mentions",
  "Elections",
]

export const featuredMarket: Market = {
  id: "denmark-pm",
  slug: "next-prime-minister-denmark",
  title: "Next Prime Minister of Denmark?",
  description: "Who will be the next Prime Minister of Denmark?",
  category: "Politics",
  icon: "🇩🇰",
  yesPercentage: 84,
  noPercentage: 16,
  yesChange: 0,
  totalVolume: "$45M Vol",
  endDate: "March 25, 7:40AM-7:45AM ET",
  isLive: true,
  chartData: [
    { time: "10:36 PM", value: 71860 },
    { time: "2:40:40 PM", value: 71880 },
    { time: "2:40:44 PM", value: 71840 },
    { time: "2:40:48 PM", value: 71848 },
  ],
}

export const markets: Market[] = [
  {
    id: "ncaa-2026",
    slug: "2026-ncaa-tournament-winner",
    title: "2026 NCAA Tournament Winner",
    description: "Which team will win the 2026 NCAA Basketball Tournament?",
    category: "Sports",
    icon: "🏀",
    yesPercentage: 21,
    noPercentage: 79,
    yesChange: 0,
    totalVolume: "$18M Vol.",
    endDate: "April 2026",
    outcomes: [
      { name: "Michigan", percentage: 21, change: 0, volume: "" },
      { name: "Arizona", percentage: 20, change: 0, volume: "" },
    ],
  },
  {
    id: "btc-5min",
    slug: "btc-5-minute-up-down",
    title: "BTC 5 Minute Up or Down",
    description: "Will Bitcoin price be up or down in 5 minutes?",
    category: "Crypto",
    icon: "₿",
    yesPercentage: 48,
    noPercentage: 52,
    yesChange: 0,
    totalVolume: "",
    endDate: "Live",
    isLive: true,
  },
  {
    id: "denmark-pm",
    slug: "next-prime-minister-denmark",
    title: "Next Prime Minister of Denmark?",
    description: "Who will be the next Prime Minister of Denmark?",
    category: "Politics",
    icon: "🇩🇰",
    yesPercentage: 84,
    noPercentage: 16,
    yesChange: 0,
    totalVolume: "$3M Vol.",
    endDate: "2026",
    outcomes: [
      { name: "Mette Frederiksen", percentage: 84, change: 0, volume: "" },
      { name: "Lars Løkke Rasmussen", percentage: 11, change: 0, volume: "" },
    ],
  },
  {
    id: "crude-oil",
    slug: "crude-oil-price",
    title: "Will Crude Oil (CL) hit__ by end of March?",
    description: "Oil price predictions for end of March",
    category: "Finance",
    icon: "🛢️",
    yesPercentage: 74,
    noPercentage: 26,
    yesChange: 0,
    totalVolume: "$58M Vol.",
    endDate: "March 31, 2026",
    outcomes: [
      { name: "↑ $90", percentage: 74, change: 0, volume: "" },
      { name: "↓ $85", percentage: 46, change: 0, volume: "" },
    ],
  },
  {
    id: "iran-ceasefire",
    slug: "us-iran-ceasefire",
    title: "US x Iran ceasefire by...?",
    description: "When will US and Iran reach a ceasefire?",
    category: "Geopolitics",
    icon: "🕊️",
    yesPercentage: 78,
    noPercentage: 22,
    yesChange: 0,
    totalVolume: "$44M Vol.",
    endDate: "2026",
    outcomes: [
      { name: "December 31", percentage: 78, change: 0, volume: "" },
      { name: "June 30", percentage: 68, change: 0, volume: "" },
    ],
  },
  {
    id: "us-iran-forces",
    slug: "us-forces-enter-iran",
    title: "US forces enter Iran by..?",
    description: "Will US forces enter Iran?",
    category: "Geopolitics",
    icon: "🇺🇸",
    yesPercentage: 63,
    noPercentage: 37,
    yesChange: 0,
    totalVolume: "$30M Vol.",
    endDate: "2026",
    outcomes: [
      { name: "December 31", percentage: 63, change: 0, volume: "" },
      { name: "April 30", percentage: 54, change: 0, volume: "" },
    ],
  },
  {
    id: "fifa-2026",
    slug: "2026-fifa-world-cup-winner",
    title: "2026 FIFA World Cup Winner",
    description: "Which country will win the 2026 FIFA World Cup?",
    category: "Sports",
    icon: "⚽",
    yesPercentage: 15,
    noPercentage: 85,
    yesChange: 0,
    totalVolume: "$368M Vol.",
    endDate: "July 2026",
    outcomes: [
      { name: "Spain", percentage: 15, change: 0, volume: "" },
      { name: "England", percentage: 13, change: 0, volume: "" },
    ],
  },
  {
    id: "kharg-island",
    slug: "kharg-island-control",
    title: "Kharg Island no longer under Iranian control by...?",
    description: "Kharg Island control predictions",
    category: "Geopolitics",
    icon: "🏝️",
    yesPercentage: 39,
    noPercentage: 61,
    yesChange: 0,
    totalVolume: "$6M Vol.",
    endDate: "2026",
    outcomes: [
      { name: "May 31", percentage: 39, change: 0, volume: "" },
      { name: "June 30", percentage: 39, change: 0, volume: "" },
    ],
  },
  {
    id: "trump-china",
    slug: "trump-visit-china",
    title: "Will Trump visit China by...?",
    description: "Trump China visit predictions",
    category: "Politics",
    icon: "🇨🇳",
    yesPercentage: 73,
    noPercentage: 27,
    yesChange: 0,
    totalVolume: "$9M Vol.",
    endDate: "2026",
    outcomes: [
      { name: "June 30", percentage: 73, change: 0, volume: "" },
      { name: "May 31", percentage: 64, change: 0, volume: "" },
    ],
  },
  {
    id: "china-taiwan",
    slug: "china-invade-taiwan",
    title: "Will China invade Taiwan by end of 2026?",
    description: "China Taiwan invasion predictions",
    category: "Geopolitics",
    icon: "🇹🇼",
    yesPercentage: 10,
    noPercentage: 90,
    yesChange: 0,
    totalVolume: "$14M Vol.",
    endDate: "December 31, 2026",
  },
  {
    id: "hormuz-traffic",
    slug: "strait-of-hormuz-traffic",
    title: "Strait of Hormuz traffic returns to normal by end of April?",
    description: "Strait of Hormuz traffic predictions",
    category: "Geopolitics",
    icon: "🚢",
    yesPercentage: 35,
    noPercentage: 65,
    yesChange: 0,
    totalVolume: "$1M Vol.",
    endDate: "April 30, 2026",
  },
]

export const nbaChampionMarket: Market = {
  id: "nba-2026",
  slug: "2026-nba-champion",
  title: "2026 NBA Champion",
  description: "Which team will win the 2026 NBA Championship?",
  category: "Sports",
  icon: "🏀",
  yesPercentage: 39,
  noPercentage: 61,
  yesChange: 4,
  totalVolume: "$251,656,711 Vol.",
  endDate: "Jul 1, 2026",
  outcomes: [
    { name: "Oklahoma City Thunder", percentage: 39, change: 4, volume: "$5,447,635 Vol." },
    { name: "San Antonio Spurs", percentage: 15, change: -6, volume: "$5,748,302 Vol." },
    { name: "Boston Celtics", percentage: 11, change: -11, volume: "$5,217,767 Vol." },
    { name: "Denver Nuggets", percentage: 8, change: -14, volume: "$3,094,715 Vol." },
    { name: "Cleveland Cavaliers", percentage: 5, change: -2, volume: "$2,100,000 Vol." },
  ],
  chartData: [
    { time: "Jul", value: 15 },
    { time: "Aug", value: 18 },
    { time: "Sep", value: 17 },
    { time: "Oct", value: 20 },
    { time: "Nov", value: 22 },
    { time: "Dec", value: 45 },
    { time: "Jan", value: 42 },
    { time: "Feb", value: 40 },
  ],
}

export const breakingNews: BreakingNewsItem[] = [
  { id: 1, title: "Will the DHS shutdown end after March 31, 2026?", percentage: 66, change: 28 },
  { id: 2, title: "Will Israel take military action in Lebanon on March 20, 2026?", percentage: 22, change: 19 },
  { id: 3, title: "Will Russia enter Ternuvate again by March 31?", percentage: 21, change: -17 },
]

export const hotTopics: HotTopic[] = [
  { id: 1, name: "Denmark", volume: "$10M today" },
  { id: 2, name: "Russia", volume: "$1M today" },
  { id: 3, name: "SpaceX", volume: "$694K today" },
  { id: 4, name: "France", volume: "$25M today" },
  { id: 5, name: "Big Brother", volume: "$184K today" },
]

export const relatedMarkets: { title: string; percentage: number }[] = [
  { title: "Will the Colorado Avalanche win the 2026 NHL Stanley Cup?", percentage: 19 },
  { title: "Will the Boston Celtics win the NBA Eastern Conference Finals?", percentage: 36 },
  { title: "Will the Oklahoma City Thunder win the NBA Western Conference...", percentage: 51 },
]

export const leaderboard: LeaderboardUser[] = [
  { rank: 1, username: "crypto_whale", avatar: "CW", points: 1250000, winRate: 72.5, totalTrades: 543 },
  { rank: 2, username: "prediction_pro", avatar: "PP", points: 980000, winRate: 68.2, totalTrades: 421 },
  { rank: 3, username: "market_maven", avatar: "MM", points: 875000, winRate: 65.8, totalTrades: 389 },
  { rank: 4, username: "odds_master", avatar: "OM", points: 720000, winRate: 63.4, totalTrades: 356 },
  { rank: 5, username: "bet_king", avatar: "BK", points: 650000, winRate: 61.2, totalTrades: 312 },
  { rank: 6, username: "fortune_teller", avatar: "FT", points: 580000, winRate: 59.8, totalTrades: 287 },
  { rank: 7, username: "risk_taker", avatar: "RT", points: 520000, winRate: 57.5, totalTrades: 265 },
  { rank: 8, username: "chart_reader", avatar: "CR", points: 475000, winRate: 55.3, totalTrades: 243 },
  { rank: 9, username: "data_analyst", avatar: "DA", points: 430000, winRate: 53.9, totalTrades: 221 },
  { rank: 10, username: "smart_trader", avatar: "ST", points: 395000, winRate: 52.1, totalTrades: 198 },
]

export const comments = [
  { username: "it-aint-much", avatar: "IA", comment: "I refreshed like 500 times today :D", amount: null },
  { username: "Blue31", avatar: "B3", comment: "Waiting for 1min market", amount: null },
  { username: "Cardenas", avatar: "CA", comment: "I've been studying this market for several hours now... My conclusion is that it can go UP or DOWN. Very...", amount: null },
  { username: "ghachu", avatar: "GH", comment: "you can like only one comment a time", amount: null },
  { username: "it-aint-much", avatar: "IA", comment: "I refreshed like 500 times today :D", amount: null },
]

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`
  }
  return num.toString()
}

export function getMarketBySlug(slug: string): Market | undefined {
  if (slug === "2026-nba-champion") return nbaChampionMarket
  return markets.find((m) => m.slug === slug)
}
