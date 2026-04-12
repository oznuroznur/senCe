import { apiClient } from "@/lib/api/client"
import type { LeaderboardEntry, PaginatedResponse, Question, User } from "@/lib/api/types"

export async function getCurrentUser(authToken: string) {
  return apiClient<User>("/users/me", { authToken })
}

export async function getLeaderboard() {
  return apiClient<{ data: LeaderboardEntry[] }>("/users/leaderboard")
}

export async function getMyBookmarks(authToken: string, page = 1, limit = 20) {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) })
  return apiClient<PaginatedResponse<Question>>(`/users/me/bookmarks?${query.toString()}`, {
    authToken,
  })
}
