export interface ApiErrorDetail {
  field: string
  message: string
}

export interface ApiErrorResponse {
  statusCode: number
  message: string
  error: string
  details?: ApiErrorDetail[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface User {
  id: string
  username: string
  displayName: string
  email?: string
  avatarUrl?: string
  bio?: string
  xpTotal: number
  level: number
  correctPredictions: number
  totalPredictions: number
  createdAt: string
}

export interface LeaderboardEntry extends User {
  rank: number
}

export interface XpHistoryEntry {
  id: string
  amount: number
  reason:
    | "PREDICTION_CORRECT"
    | "PREDICTION_INCORRECT"
    | "PREDICTION_PLACED"
    | "STREAK_BONUS"
    | "BADGE_REWARD"
    | "LEVEL_UP_BONUS"
    | "SIGNUP_BONUS"
    | "DAILY_LOGIN_BONUS"
    | "ADMIN_ADJUSTMENT"
  balanceAfter: number
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface QuestionOption {
  id: string
  key: string
  label: string
  position: number
}

export interface Question {
  id: string
  slug: string
  title: string
  description?: string
  type: "BINARY" | "MULTIPLE_CHOICE" | "OPEN_ENDED" | "PREDICTION_MARKET"
  status: "DRAFT" | "PUBLISHED" | "CLOSED" | "RESOLVED" | "ARCHIVED" | "REMOVED"
  visibility: "PUBLIC" | "UNLISTED" | "PRIVATE"
  creator: {
    id: string
    username: string
    displayName: string
  }
  topic?: {
    id: string
    name: string
    slug: string
  }
  options: QuestionOption[]
  resolvedOptionId?: string | null
  closesAt?: string | null
  totalParticipants: number
  totalXPPool: number
  createdAt: string
}

export interface Participation {
  id: string
  questionId: string
  optionId: string
  xpWagered: number
  xpResult?: number | null
  isCorrect?: boolean | null
  createdAt: string
}

export interface ParticipationStatsOption {
  id: string
  key: string
  label: string
  participantCount: number
  xpTotal: number
  percentage: number
}

export interface ParticipationStats {
  options: ParticipationStatsOption[]
  totalParticipants: number
  totalXPPool: number
}

export interface Comment {
  id: string
  body: string
  status: "ACTIVE" | "HIDDEN" | "REMOVED"
  depth: 0 | 1
  user: {
    id: string
    username: string
    displayName: string
    avatarUrl?: string
  }
  reactionCounts: {
    LIKE: number
    DISLIKE: number
    AGREE: number
    DISAGREE: number
  }
  replies?: Comment[]
  createdAt: string
}

export interface Topic {
  id: string
  name: string
  slug: string
  description?: string
  questionCount?: number
  createdAt?: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}