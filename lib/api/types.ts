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

export type QuestionType = "BINARY" | "MULTIPLE_CHOICE" | "OPEN_ENDED" | "PREDICTION_MARKET"
export type QuestionStatus = "DRAFT" | "PUBLISHED" | "CLOSED" | "RESOLVED" | "ARCHIVED" | "REMOVED"
export type QuestionVisibility = "PUBLIC" | "UNLISTED" | "PRIVATE"
export type CommentStatus = "ACTIVE" | "HIDDEN" | "REMOVED"
export type ReactionType = "LIKE" | "DISLIKE" | "AGREE" | "DISAGREE"

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
  type: QuestionType
  status: QuestionStatus
  visibility: QuestionVisibility
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
  xpTotal?: number
  totalXP?: number
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
  status: CommentStatus
  depth: 0 | 1
  user: {
    id: string
    username: string
    displayName: string
    avatarUrl?: string
  }
  reactionCounts: Record<ReactionType, number>
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

export interface ToggleBookmarkResponse {
  bookmarked: boolean
}

export interface ToggleFollowResponse {
  following: boolean
}

export interface ToggleReactionResponse {
  type: ReactionType
  isActive: boolean
  count: number
}

export interface DeleteCommentResponse {
  success: boolean
}
