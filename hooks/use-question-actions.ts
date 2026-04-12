"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleBookmark, toggleFollow, toggleQuestionReaction } from "@/lib/api/questions"
import { queryKeys } from "@/lib/api/query-keys"
import { useAuthToken } from "@/hooks/use-auth-token"
import type { ReactionType } from "@/lib/api/types"

interface QuestionActionPayload {
  questionId: string
  slug: string
}

function useInvalidateQuestion(slug: string, questionId: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.question(slug) })
    queryClient.invalidateQueries({ queryKey: queryKeys.questionStats(questionId) })
  }
}

export function useToggleBookmark() {
  const { getRequiredToken } = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ questionId }: QuestionActionPayload) => {
      const token = await getRequiredToken()
      return toggleBookmark(questionId, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
    },
  })
}

export function useToggleFollow() {
  const { getRequiredToken } = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ questionId }: QuestionActionPayload) => {
      const token = await getRequiredToken()
      return toggleFollow(questionId, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
    },
  })
}

export function useToggleQuestionReaction(slug: string, questionId: string) {
  const { getRequiredToken } = useAuthToken()
  const invalidateQuestion = useInvalidateQuestion(slug, questionId)

  return useMutation({
    mutationFn: async (type: ReactionType) => {
      const token = await getRequiredToken()
      return toggleQuestionReaction(questionId, type, token)
    },
    onSuccess: invalidateQuestion,
  })
}
