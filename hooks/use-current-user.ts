"use client"

import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "@/lib/api/users"
import { queryKeys } from "@/lib/api/query-keys"
import { useAuthToken } from "@/hooks/use-auth-token"

export function useCurrentUser() {
  const { isSignedIn, getToken } = useAuthToken()

  return useQuery({
    queryKey: queryKeys.currentUser,
    enabled: isSignedIn,
    queryFn: async () => {
      const token = await getToken()
      if (!token) {
        throw new Error("Missing auth token")
      }

      return getCurrentUser(token)
    },
  })
}
