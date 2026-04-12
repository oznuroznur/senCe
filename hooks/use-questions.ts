"use client"

import { useQuery } from "@tanstack/react-query"
import { listQuestions } from "@/lib/api/questions"
import { queryKeys } from "@/lib/api/query-keys"

interface UseQuestionsParams {
  page?: number
  limit?: number
  topicId?: string
}

export function useQuestions({ page = 1, limit = 20, topicId }: UseQuestionsParams = {}) {
  return useQuery({
    queryKey: queryKeys.questions({ page, limit, topicId }),
    queryFn: () => listQuestions({ page, limit, topicId }),
  })
}
