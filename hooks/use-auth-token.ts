"use client"

import { useAuth } from "@clerk/nextjs"

export function useAuthToken() {
  const { isSignedIn, getToken } = useAuth()

  async function getRequiredToken() {
    const token = await getToken()
    if (!token) {
      throw new Error("Authentication token is missing")
    }

    return token
  }

  return {
    isSignedIn,
    getToken,
    getRequiredToken,
  }
}
