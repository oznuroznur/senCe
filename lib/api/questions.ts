import { apiClient } from "@/lib/api/client"
import type {
  PaginatedResponse,
  Participation,
  ParticipationStats,
  Question,
  ReactionType,
  ToggleBookmarkResponse,
  ToggleFollowResponse,
  ToggleReactionResponse,
} from "@/lib/api/types"

export interface ListQuestionsParams {
  page?: number
  limit?: number
  topicId?: string
}

export async function listQuestions(params: ListQuestionsParams = {}) {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  })

  if (params.topicId) {
    query.set("topicId", params.topicId)
  }

  return apiClient<PaginatedResponse<Question>>(`/questions?${query.toString()}`)
}

export async function getQuestionBySlug(slug: string) {
  return apiClient<Question>(`/questions/${slug}`)
}

export async function getQuestionStats(questionId: string) {
  return apiClient<ParticipationStats>(`/questions/${questionId}/participations`)
}

export async function getMyParticipation(questionId: string, authToken: string) {
  return apiClient<Participation>(`/questions/${questionId}/participations/me`, {
    authToken,
  })
}

export async function placePrediction(
  questionId: string,
  payload: { optionId: string; xpWagered: number },
  authToken: string,
) {
  return apiClient<Participation>(`/questions/${questionId}/participations`, {
    method: "POST",
    authToken,
    body: payload,
  })
}

export async function toggleBookmark(questionId: string, authToken: string) {
  return apiClient<ToggleBookmarkResponse>(`/questions/${questionId}/bookmark`, {
    method: "POST",
    authToken,
  })
}

export async function toggleFollow(questionId: string, authToken: string) {
  return apiClient<ToggleFollowResponse>(`/questions/${questionId}/follow`, {
    method: "POST",
    authToken,
  })
}

export async function toggleQuestionReaction(questionId: string, type: ReactionType, authToken: string) {
  return apiClient<ToggleReactionResponse>(`/questions/${questionId}/reactions`, {
    method: "POST",
    authToken,
    body: { type },
  })
}
