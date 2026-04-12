"use client"

import { useQuery } from "@tanstack/react-query"
import { getLeaderboard } from "@/lib/api/users"
import { queryKeys } from "@/lib/api/query-keys"

export function useLeaderboard() {
  return useQuery({
    queryKey: queryKeys.leaderboard,
    queryFn: getLeaderboard,
  })
}
