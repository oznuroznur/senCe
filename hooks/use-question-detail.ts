"use client"

import { useQuery } from "@tanstack/react-query"
import { getQuestionBySlug, getQuestionStats, getMyParticipation } from "@/lib/api/questions"
import { listComments } from "@/lib/api/comments"
import { queryKeys } from "@/lib/api/query-keys"
import { useAuthToken } from "@/hooks/use-auth-token"
import { mapCommentsToFeed, mapQuestionToMarket } from "@/lib/sence-mappers"

interface UseQuestionDetailOptions {
  commentsPage?: number
  commentsLimit?: number
}

export function useQuestionDetail(slug: string, options: UseQuestionDetailOptions = {}) {
  const { commentsPage = 1, commentsLimit = 20 } = options
  const { isSignedIn, getToken } = useAuthToken()

  const questionQuery = useQuery({
    queryKey: queryKeys.question(slug),
    queryFn: () => getQuestionBySlug(slug),
    enabled: Boolean(slug),
  })

  const questionId = questionQuery.data?.id

  const statsQuery = useQuery({
    queryKey: queryKeys.questionStats(questionId || ""),
    enabled: Boolean(questionId),
    queryFn: () => getQuestionStats(questionId as string),
  })

  const commentsQuery = useQuery({
    queryKey: queryKeys.questionComments(questionId || "", commentsPage, commentsLimit),
    enabled: Boolean(questionId),
    queryFn: () => listComments(questionId as string, commentsPage, commentsLimit),
  })

  const myParticipationQuery = useQuery({
    queryKey: queryKeys.myParticipation(questionId || ""),
    enabled: Boolean(questionId) && isSignedIn,
    retry: false,
    queryFn: async () => {
      const token = await getToken()
      if (!token) {
        return null
      }

      try {
        return await getMyParticipation(questionId as string, token)
      } catch {
        return null
      }
    },
  })

  const market = questionQuery.data ? mapQuestionToMarket(questionQuery.data, statsQuery.data) : null
  const commentsFeed = mapCommentsToFeed(commentsQuery.data?.data ?? [])

  return {
    questionQuery,
    statsQuery,
    commentsQuery,
    myParticipationQuery,
    market,
    commentsFeed,
  }
}
