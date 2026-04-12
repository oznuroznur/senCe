import { apiClient } from "@/lib/api/client"
import type {
  Comment,
  DeleteCommentResponse,
  PaginatedResponse,
  ReactionType,
  ToggleReactionResponse,
} from "@/lib/api/types"

export async function listComments(questionId: string, page = 1, limit = 20) {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) })
  return apiClient<PaginatedResponse<Comment>>(`/questions/${questionId}/comments?${query.toString()}`)
}

export async function createComment(questionId: string, body: string, authToken: string) {
  return apiClient<Comment>(`/questions/${questionId}/comments`, {
    method: "POST",
    authToken,
    body: { body },
  })
}

export async function replyComment(questionId: string, commentId: string, body: string, authToken: string) {
  return apiClient<Comment>(`/questions/${questionId}/comments/${commentId}/reply`, {
    method: "POST",
    authToken,
    body: { body },
  })
}

export async function deleteComment(questionId: string, commentId: string, authToken: string) {
  return apiClient<DeleteCommentResponse>(`/questions/${questionId}/comments/${commentId}`, {
    method: "DELETE",
    authToken,
  })
}

export async function toggleCommentReaction(commentId: string, type: ReactionType, authToken: string) {
  return apiClient<ToggleReactionResponse>(`/comments/${commentId}/reactions`, {
    method: "POST",
    authToken,
    body: { type },
  })
}
