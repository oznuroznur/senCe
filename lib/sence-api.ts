import type {
  Comment,
  LeaderboardEntry,
  PaginatedResponse,
  Participation,
  ParticipationStats,
  Question,
  Topic,
} from "@/lib/api-types"
import { apiFetch, safeApiFetch } from "@/lib/api-client"

export async function getQuestions(page = 1, limit = 20, topicId?: string) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (topicId) {
    params.set("topicId", topicId)
  }

  return safeApiFetch<PaginatedResponse<Question>>(`/questions?${params.toString()}`, {
    next: { revalidate: 300 },
  })
}

export async function getQuestionBySlug(slug: string) {
  return safeApiFetch<Question>(`/questions/${slug}`, {
    next: { revalidate: 60 },
  })
}

export async function getQuestionComments(questionId: string, page = 1, limit = 10) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  return safeApiFetch<PaginatedResponse<Comment>>(`/questions/${questionId}/comments?${params.toString()}`, {
    cache: "no-store",
  })
}

export async function getQuestionParticipationStats(questionId: string) {
  return safeApiFetch<ParticipationStats>(`/questions/${questionId}/participations`, {
    next: { revalidate: 60 },
  })
}

export async function getTopics() {
  return safeApiFetch<Topic[]>("/topics", {
    next: { revalidate: 300 },
  })
}

export async function getLeaderboard() {
  return safeApiFetch<{ data: LeaderboardEntry[] }>("/users/leaderboard", {
    next: { revalidate: 300 },
  })
}

export async function placePrediction(token: string, questionId: string, optionId: string, xpWagered: number) {
  return apiFetch<Participation>(`/questions/${questionId}/participations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      optionId,
      xpWagered,
    }),
  })
}