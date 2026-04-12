"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { placePrediction } from "@/lib/api/questions"
import { queryKeys } from "@/lib/api/query-keys"
import { useAuthToken } from "@/hooks/use-auth-token"

interface PlacePredictionPayload {
  questionId: string
  optionId: string
  xpWagered: number
  slug: string
}

export function usePlacePrediction() {
  const queryClient = useQueryClient()
  const { getRequiredToken } = useAuthToken()

  return useMutation({
    mutationFn: async ({ questionId, optionId, xpWagered }: PlacePredictionPayload) => {
      const token = await getRequiredToken()
      return placePrediction(questionId, { optionId, xpWagered }, token)
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.questionStats(variables.questionId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.myParticipation(variables.questionId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.question(variables.slug) })
      queryClient.invalidateQueries({ queryKey: ["questions"] })
    },
  })
}
