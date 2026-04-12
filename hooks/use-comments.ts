"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createComment,
  deleteComment,
  listComments,
  replyComment,
  toggleCommentReaction,
} from "@/lib/api/comments"
import { queryKeys } from "@/lib/api/query-keys"
import { useAuthToken } from "@/hooks/use-auth-token"
import type { ReactionType } from "@/lib/api/types"

interface UseCommentsOptions {
  page?: number
  limit?: number
}

export function useComments(questionId: string, options: UseCommentsOptions = {}) {
  const { page = 1, limit = 20 } = options
  const queryClient = useQueryClient()
  const { getRequiredToken } = useAuthToken()

  const commentsQuery = useQuery({
    queryKey: queryKeys.questionComments(questionId, page, limit),
    enabled: Boolean(questionId),
    queryFn: () => listComments(questionId, page, limit),
  })

  const invalidateComments = () => {
    queryClient.invalidateQueries({ queryKey: ["question-comments", questionId] })
  }

  const createCommentMutation = useMutation({
    mutationFn: async (body: string) => {
      const token = await getRequiredToken()
      return createComment(questionId, body, token)
    },
    onSuccess: invalidateComments,
  })

  const replyCommentMutation = useMutation({
    mutationFn: async ({ commentId, body }: { commentId: string; body: string }) => {
      const token = await getRequiredToken()
      return replyComment(questionId, commentId, body, token)
    },
    onSuccess: invalidateComments,
  })

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const token = await getRequiredToken()
      return deleteComment(questionId, commentId, token)
    },
    onSuccess: invalidateComments,
  })

  const toggleCommentReactionMutation = useMutation({
    mutationFn: async ({ commentId, type }: { commentId: string; type: ReactionType }) => {
      const token = await getRequiredToken()
      return toggleCommentReaction(commentId, type, token)
    },
    onSuccess: invalidateComments,
  })

  return {
    commentsQuery,
    createCommentMutation,
    replyCommentMutation,
    deleteCommentMutation,
    toggleCommentReactionMutation,
  }
}
