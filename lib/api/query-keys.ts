export const queryKeys = {
  questions: (params: { page: number; limit: number; topicId?: string }) => ["questions", params] as const,
  question: (slug: string) => ["question", slug] as const,
  questionStats: (questionId: string) => ["question-stats", questionId] as const,
  questionComments: (questionId: string, page: number, limit: number) =>
    ["question-comments", questionId, page, limit] as const,
  myParticipation: (questionId: string) => ["my-participation", questionId] as const,
  currentUser: ["current-user"] as const,
  leaderboard: ["leaderboard"] as const,
  topics: ["topics"] as const,
}
