"use client"

import { useQuery } from "@tanstack/react-query"
import { listTopics } from "@/lib/api/topics"
import { queryKeys } from "@/lib/api/query-keys"

export function useTopics() {
  return useQuery({
    queryKey: queryKeys.topics,
    queryFn: listTopics,
  })
}
